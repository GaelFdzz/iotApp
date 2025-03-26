import { supabase } from "./supabaseConfig"

export async function obtenerParcelas() {
    try {
        const { data: parcelas, error: errorParcelas } = await supabase
            .from("parcelas")
            .select("*")

        if (errorParcelas) {
            console.error("Error al obtener parcelas:", errorParcelas)
            return []
        }

        const parcelasConUltimosSensores = await Promise.all(
            parcelas.map(async (parcela) => {
                const { data: sensores, error: errorSensores } = await supabase
                    .from("sensores_parcelas")
                    .select("*")
                    .eq("parcela_id", parcela.id)
                    .order("fecha_registro", { ascending: false })
                    .limit(1)

                if (errorSensores) {
                    console.error(`Error al obtener sensores para parcela ${parcela.id}:`, errorSensores)
                }

                return {
                    ...parcela,
                    sensores: sensores ?? []
                }
            })
        )

        return parcelasConUltimosSensores
    } catch (error) {
        console.error("Error inesperado al obtener parcelas:", error)
        return []
    }
}
