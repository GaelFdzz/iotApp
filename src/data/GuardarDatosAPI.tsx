import { supabase } from "../data/supabaseConfig";
import axios from "axios";

export async function guardarDatosAPI() {
    try {
        // Obtener datos de la API externa
        const response = await axios.get("http://moriahmkt.com/iotapp/");
        const data = response.data;

        if (!data) {
            console.warn("No se recibieron datos de la API.");
            return;
        }

        // 📌 1️⃣ Guardar sensores globales si cambian
        const { data: lastSensorGlobal, error: errorGlobal } = await supabase
            .from("sensores_globales")
            .select("*")
            .order("fecha_registro", { ascending: false })
            .limit(1)
            .single();

        if (errorGlobal) {
            console.error("Error al obtener sensores globales:", errorGlobal);
            return;
        }

        if (
            !lastSensorGlobal ||
            lastSensorGlobal.temperatura !== data.sensores.temperatura ||
            lastSensorGlobal.humedad !== data.sensores.humedad ||
            lastSensorGlobal.lluvia !== data.sensores.lluvia ||
            lastSensorGlobal.sol !== data.sensores.sol
        ) {
            const { error: insertError } = await supabase.from("sensores_globales").insert([{
                temperatura: data.sensores.temperatura,
                humedad: data.sensores.humedad,
                lluvia: data.sensores.lluvia,
                sol: data.sensores.sol,
            }]);

            if (insertError) {
                console.error("Error al insertar sensores globales:", insertError);
                return;
            }
        }

        // 📌 2️⃣ Guardar parcelas y verificar si alguna ha sido eliminada
        const { data: parcelasDB, error: errorParcelasDB } = await supabase.from("parcelas").select("id");

        if (errorParcelasDB) {
            console.error("Error al obtener parcelas de la base de datos:", errorParcelasDB);
            return;
        }

        const parcelasEnAPI = data.parcelas.map((p: any) => p.id);
        const parcelasEnBD = parcelasDB ? parcelasDB.map((p: any) => p.id) : [];

        // Marcar como eliminadas las que ya no están en la API
        for (const parcelaId of parcelasEnBD) {
            if (!parcelasEnAPI.includes(parcelaId)) {
                const { error: updateError } = await supabase.from("parcelas").update({ activa: false }).eq("id", parcelaId);
                if (updateError) {
                    console.error(`Error al desactivar parcela con id ${parcelaId}:`, updateError);
                }
            }
        }

        // 📌 3️⃣ Insertar/Actualizar datos de parcelas y sensores de parcelas
        for (const parcela of data.parcelas) {

            // Verifica si los datos de sensores están completos
            if (
                parcela.sensor &&
                parcela.sensor.temperatura !== undefined &&
                parcela.sensor.humedad !== undefined &&
                parcela.sensor.lluvia !== undefined &&
                parcela.sensor.sol !== undefined
            ) {

                // Insertar o actualizar la parcela
                const { error: upsertError } = await supabase.from("parcelas").upsert([{
                    id: parcela.id,
                    nombre: parcela.nombre,
                    ubicacion: parcela.ubicacion,
                    responsable: parcela.responsable,
                    tipo_cultivo: parcela.tipo_cultivo,
                    ultimo_riego: parcela.ultimo_riego,
                    latitud: parcela.latitud,
                    longitud: parcela.longitud,
                    activa: true,
                }]);

                if (upsertError) {
                    console.error(`Error al insertar o actualizar la parcela con id ${parcela.id}:`, upsertError);
                    continue; // Continúa con las siguientes parcelas si ocurre un error
                }

                // Insertar datos de sensores de la parcela
                const { error: insertSensorError } = await supabase.from("sensores_parcelas").insert([{
                    parcela_id: parcela.id,
                    temperatura: parcela.sensor.temperatura,
                    humedad: parcela.sensor.humedad,
                    lluvia: parcela.sensor.lluvia,
                    sol: parcela.sensor.sol,
                    fecha_registro: new Date(), // Asegúrate de incluir la fecha
                }]);

                if (insertSensorError) {
                    console.error(`Error al insertar sensores de la parcela con id ${parcela.id}:`, insertSensorError);
                } else {
                }
            } else {
                console.warn(`Datos de sensores incompletos para la parcela con id ${parcela.id}.`);
            }
        }
    } catch (error) {
        console.error("Error general al guardar datos en la API o base de datos:", error);
    }
}