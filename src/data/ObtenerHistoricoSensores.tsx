import { supabase } from "./supabaseConfig"

export async function obtenerHistoricoSensores() {
    try {
        const { data, error } = await supabase
            .from("sensores_globales")
            .select("temperatura, humedad, lluvia, sol, fecha_registro")
            .order("fecha_registro", { ascending: false })
            .limit(50)

        if (error) {
            console.error("Error al obtener el histórico de sensores:", error)
            return []
        }

        return data
    } catch (error) {
        console.error("Error al obtener el histórico de sensores:", error)
        return []
    }
}
