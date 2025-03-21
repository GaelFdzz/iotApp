// src/data/ObtenerHistoricoSensores.ts
import { supabase } from "./supabaseConfig";

export async function obtenerHistoricoSensores() {
    try {
        // Obtener los últimos 100 registros de la tabla sensores_globales
        const { data, error } = await supabase
            .from("sensores_globales")
            .select("temperatura, humedad, lluvia, sol, fecha_registro")
            .order("fecha_registro", { ascending: false }) // Ordenamos en orden descendente (más recientes primero)
            .limit(50); // Limitar a los últimos 100 registros

        if (error) {
            console.error("Error al obtener el histórico de sensores:", error);
            return [];
        }

        return data;
    } catch (error) {
        console.error("Error al obtener el histórico de sensores:", error);
        return [];
    }
}
