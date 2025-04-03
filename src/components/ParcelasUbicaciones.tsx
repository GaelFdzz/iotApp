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
            <h2 className="text-3xl font-bold mb text-white">Parcelas eliminadas <span></span></h2>
            <p className="text-white mb-4">Lista de parcelas que se encuentran en el estado de no-activa/eliminada.</p>
            {parcelasInactivas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parcelasInactivas.map((parcela) => (
                        <div key={parcela.id} className="p-4 bg-[#D9D9D9] rounded-md shadow-inner">
                            <h2 className="text-xl font-semibold">{parcela.nombre}</h2>
                            <p><strong>Responsable:</strong> {parcela.responsable}</p>
                            <p><strong>Ubicación:</strong> {parcela.ubicacion}</p>
                            <p><strong>Tipo de cultivo:</strong> {parcela.tipo_cultivo}</p>
                            <p><strong>Último riego:</strong> {parcela.ultimo_riego}</p>
                            {parcela.sensores.length > 0 ? (
                                parcela.sensores.map((sensor, index) => (
                                    <div key={index}>
                                        <p><strong>Humedad:</strong> {sensor.humedad}%</p>
                                        <p><strong>Temperatura:</strong> {sensor.temperatura}°C</p>
                                        {sensor.lluvia !== undefined && <p><strong>Lluvia:</strong> {sensor.lluvia} mm</p>}
                                        {sensor.sol !== undefined && <p><strong>Sol:</strong> {sensor.sol}%</p>}
                                    </div>
                                ))
                            ) : (
                                <p><strong>Sin sensores disponibles.</strong></p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-white text-lg place-self-center rounded-[7px] p-4 border-1 border-red-700 bg-red-400/10">No hay parcelas inactivas en este momento.</p>
            )}
        </div>
    )
}

export default ParcelasInactivas