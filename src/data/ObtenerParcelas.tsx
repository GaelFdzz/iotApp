import { supabase } from "./supabaseConfig"

export async function obtenerParcelas() {
    try {
        const { data: parcelas, error } = await supabase
            .from("parcelas")
            .select("*")
            .eq("activa", true)

        if (error) {
            console.error("Error al obtener parcelas:", error)
            return []
        }

        console.log("📌 Parcelas obtenidas de Supabase:", parcelas.length)

        const parcelasConSensores = await Promise.all(parcelas.map(async parcela => {
            const { data: sensores, error: errorSensores } = await supabase
                .from("sensores_parcelas")
                .select("*")
                .eq("parcela_id", parcela.id)
                .order("fecha_registro", { ascending: false })
                .limit(1)

            if (errorSensores) console.error(`Error sensores parcela ${parcela.id}:`, errorSensores)

            return { ...parcela, sensores: sensores ?? [] }
        }))

        console.log("✅ Parcelas con sensores procesadas:", parcelasConSensores.length)
        return parcelasConSensores
    } catch (error) {
        console.error("Error inesperado:", error)
        return []
    }
}  