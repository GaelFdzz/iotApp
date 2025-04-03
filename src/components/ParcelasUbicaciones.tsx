import { useEffect, useState } from "react"
import CircularProgress from "@mui/material/CircularProgress"
import { obtenerParcelasInactivas } from "../data/ObtenerParcelasInactivas"

interface Sensor {
    id: number
    humedad: number
    temperatura: number
    lluvia?: number
    sol?: number
}

interface Parcela {
    id: string
    nombre: string
    responsable: string
    ubicacion: string
    tipo_cultivo: string
    ultimo_riego: string
    sensores: Sensor[]
}

function ParcelasInactivas() {
    const [parcelasInactivas, setParcelasInactivas] = useState<Parcela[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchParcelas() {
            setLoading(true)
            try {
                const data = await obtenerParcelasInactivas()
                setParcelasInactivas(data)
            } catch (error) {
                console.error("Error al obtener parcelas inactivas:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchParcelas()
        const interval = setInterval(fetchParcelas, 60000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex mt-50 justify-center items-center text-white">
                <CircularProgress size={80} color="inherit" />
                <p className="ml-4 text-xl">Cargando datos de parcelas...</p>
            </div>
        )
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold text-white mb-4">Parcelas eliminadas</h2>
            <p className="text-white mb-4">Lista de parcelas que se encuentran en estado no activo/eliminado.</p>

            {parcelasInactivas.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-700">
                    <table className="w-full border-collapse text-white">
                        <thead className="bg-gray-800 rounded-t-lg">
                            <tr>
                                <th className="border border-gray-600 px-4 py-2">Nombre</th>
                                <th className="border border-gray-600 px-4 py-2">Responsable</th>
                                <th className="border border-gray-600 px-4 py-2">Ubicación</th>
                                <th className="border border-gray-600 px-4 py-2">Tipo de Cultivo</th>
                                <th className="border border-gray-600 px-4 py-2">Último Riego</th>
                                <th className="border border-gray-600 px-4 py-2">Sensores <br /> <span className="text-[10px] text-gray-500">(Temperatura / Humedad / Lluvia / Intensidad del sol)</span></th>
                            </tr>
                        </thead>
                        <tbody className="rounded-b-lg">
                            {parcelasInactivas.map((parcela) => (
                                <tr key={parcela.id} className="bg-gray-700 transition delay-0 duration-300 hover:bg-[#090B52] hover:-translate-y-0.5 hover:scale-101">
                                    <td className="border border-gray-600 px-4 py-2">{parcela.nombre}</td>
                                    <td className="border border-gray-600 px-4 py-2">{parcela.responsable}</td>
                                    <td className="border border-gray-600 px-4 py-2">{parcela.ubicacion}</td>
                                    <td className="border border-gray-600 px-4 py-2">{parcela.tipo_cultivo}</td>
                                    <td className="border border-gray-600 px-4 py-2">{parcela.ultimo_riego}</td>
                                    <td className="border border-gray-600 px-4 py-2">
                                        {parcela.sensores.length > 0 ? (
                                            <ul>
                                                {parcela.sensores.map((sensor, index) => (
                                                    <li key={index} className="text-sm">
                                                        🌡 {sensor.temperatura}°C | 💧 {sensor.humedad}%
                                                        {sensor.lluvia !== undefined && ` | 🌧 ${sensor.lluvia} mm`}
                                                        {sensor.sol !== undefined && ` | ☀️ ${sensor.sol}%`}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            "Sin sensores"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-white text-lg place-self-center rounded-[7px] p-4 border border-red-700 bg-red-400/10">
                    No hay parcelas inactivas en este momento.
                </p>
            )}
        </div>
    )
}

export default ParcelasInactivas
