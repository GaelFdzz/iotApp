// En src/data/ObtenerParcelas.ts

import { supabase } from "./supabaseConfig";

export async function obtenerParcelas() {
    try {
        // Primero obtenemos todas las parcelas
        const { data: parcelas, error: errorParcelas } = await supabase
            .from("parcelas")
            .select("*");

        if (errorParcelas) {
            console.error("Error al obtener parcelas:", errorParcelas);
            return [];
        }

        // Ahora obtenemos el último sensor relacionado con cada parcela
        const parcelasConUltimosSensores = await Promise.all(
            parcelas.map(async (parcela) => {
                // Obtener el último sensor para cada parcela
                const { data: sensores, error: errorSensores } = await supabase
                    .from("sensores_parcelas")
                    .select("*")
                    .eq("parcela_id", parcela.id) // Filtramos por el id de la parcela
                    .order("fecha_registro", { ascending: false }) // Ordenamos por fecha (descendente)
                    .limit(1); // Limitamos la consulta a 1 para obtener solo el último sensor

                if (errorSensores) {
                    console.error(`Error al obtener sensores para la parcela ${parcela.id}:`, errorSensores);
                }

                // Agregamos el último sensor a la parcela
                return {
                    ...parcela,
                    sensores
                };
            })
        );

        console.log("Parcelas con últimos sensores:", parcelasConUltimosSensores);
        return parcelasConUltimosSensores;
    } catch (error) {
        console.error("Error al obtener parcelas:", error);
        return [];
    }
}
