import { supabase } from "../data/supabaseConfig";
import axios from "axios";

export async function guardarDatosAPI() {
    console.log("🚀 Ejecutando guardarDatosAPI");

    try {
        // 1. Obtener datos de la API externa
        const response = await axios.get("api/test/");
        const data = response.data;

        console.log("📡 Data recibida de la API:", data);

        if (!data || !data.sensores || !data.parcelas) {
            console.warn("⚠️ Datos incompletos de la API.");
            return;
        }

        // 2. Guardar sensores globales si cambian
        const { data: lastSensorGlobal, error: errorGlobal } = await supabase
            .from("sensores_globales")
            .select("*")
            .order("fecha_registro", { ascending: false })
            .limit(1)
            .single();

        console.log("🌡 Último sensor global:", lastSensorGlobal);

        if (errorGlobal) {
            console.error("❌ Error al obtener sensores globales:", errorGlobal);
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
                fecha_registro: new Date(),
            }]);

            if (insertError) {
                console.error("❌ Error al insertar sensores globales:", insertError);
                return;
            } else {
                console.log("✅ Sensores globales insertados.");
            }
        }

        // 3. Verificar y actualizar parcelas inactivas
        const { data: parcelasDB, error: errorParcelasDB } = await supabase.from("parcelas").select("id");

        if (errorParcelasDB) {
            console.error("❌ Error al obtener parcelas de BD:", errorParcelasDB);
            return;
        }

        const parcelasEnAPI = data.parcelas.map((p: any) => p.id);
        const parcelasEnBD = parcelasDB ? parcelasDB.map((p: any) => p.id) : [];

        for (const parcelaId of parcelasEnBD) {
            if (!parcelasEnAPI.includes(parcelaId)) {
                const { error: updateError } = await supabase
                    .from("parcelas")
                    .update({ activa: false })
                    .eq("id", parcelaId);

                if (updateError) {
                    console.error(`❌ Error al desactivar parcela con id ${parcelaId}:`, updateError);
                } else {
                    console.log(`🟡 Parcela desactivada: ${parcelaId}`);
                }
            }
        }

        // 4. Insertar o actualizar parcelas y sensores
        for (const parcela of data.parcelas) {
            // Validar sensores
            if (
                parcela.sensor &&
                parcela.sensor.temperatura !== undefined &&
                parcela.sensor.humedad !== undefined &&
                parcela.sensor.lluvia !== undefined &&
                parcela.sensor.sol !== undefined
            ) {
                // Insertar o actualizar parcela
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
                    console.error(`❌ Error al insertar/actualizar parcela ${parcela.id}:`, upsertError);
                    continue;
                } else {
                    console.log(`✅ Parcela guardada: ${parcela.nombre} (${parcela.id})`);
                }

                // Insertar sensores de la parcela
                const { error: insertSensorError } = await supabase.from("sensores_parcelas").insert([{
                    parcela_id: parcela.id,
                    temperatura: parcela.sensor.temperatura,
                    humedad: parcela.sensor.humedad,
                    lluvia: parcela.sensor.lluvia,
                    sol: parcela.sensor.sol,
                    fecha_registro: new Date(),
                }]);

                if (insertSensorError) {
                    console.error(`❌ Error al insertar sensores de parcela ${parcela.id}:`, insertSensorError);
                } else {
                    console.log(`📊 Sensores guardados para parcela ${parcela.id}`);
                }
            } else {
                console.warn(`⚠️ Datos de sensores incompletos para parcela ${parcela.id}`);
            }
        }

    } catch (error) {
        console.error("🔥 Error general en guardarDatosAPI:", error);
    }
}
