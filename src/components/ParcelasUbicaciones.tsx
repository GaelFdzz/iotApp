import { useEffect, useRef, useState } from "react"
import mapboxgl, { Marker } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { obtenerParcelas } from "../data/ObtenerParcelas"
import CircularProgress from "@mui/material/CircularProgress"

// Interfaces
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
    longitud: number
    latitud: number
    sensores: Sensor[]
    activa: boolean
}

mapboxgl.accessToken = "pk.eyJ1IjoiZ2FlbGZkeiIsImEiOiJjbTJjZXZxd2YweXNvMm1weTNvcDdjNG40In0.2POiq_70F9nHfajnXPPFSQ"

function ParcelasUbicaciones() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const [parcelasActivas, setParcelasActivas] = useState<Parcela[]>([])
    const [parcelasInactivas, setParcelasInactivas] = useState<Parcela[]>([])
    const [loading, setLoading] = useState(true)

    // Obtener parcelas
    useEffect(() => {
        async function fetchParcelas() {
            setLoading(true)
            try {
                const data = await obtenerParcelas()
                if (data) {
                    const activas = data.filter((p: Parcela) => p.activa)
                    const inactivas = data.filter((p: Parcela) => !p.activa)
                    setParcelasActivas(activas)
                    setParcelasInactivas(inactivas)
                }
            } catch (error) {
                console.error("Error al obtener parcelas:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchParcelas()
        const interval = setInterval(fetchParcelas, 60000)
        return () => clearInterval(interval)
    }, [])

    // Crear mapa con markers
    useEffect(() => {
        if (!mapContainerRef.current || parcelasActivas.length === 0) return

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v12",
                center: [-86.87333776892409, 21.062168954535487],
                zoom: 12,
            })
        }

        const map = mapRef.current
        const markers: Marker[] = []

        parcelasActivas.forEach((parcela) => {
            if (parcela.latitud && parcela.longitud) {
                const marker = new Marker()
                    .setLngLat([parcela.longitud, parcela.latitud])
                    .setPopup(
                        new mapboxgl.Popup().setHTML(`
                            <h3>${parcela.nombre}</h3>
                            <p><strong>Responsable:</strong> ${parcela.responsable}</p>
                            <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
                            <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
                            <p><strong>Último riego:</strong> ${parcela.ultimo_riego}</p>
                            ${parcela.sensores.map(sensor => `
                                <p><strong>Humedad:</strong> ${sensor.humedad}%</p>
                                <p><strong>Temperatura:</strong> ${sensor.temperatura}°C</p>
                                ${sensor.lluvia !== undefined ? `<p><strong>Lluvia:</strong> ${sensor.lluvia}</p>` : ""}
                                ${sensor.sol !== undefined ? `<p><strong>Sol:</strong> ${sensor.sol}</p>` : ""}
                            `).join("")}
                        `)
                    )
                    .addTo(map)

                markers.push(marker)
            }
        })

        return () => {
            markers.forEach(marker => marker.remove())
        }
    }, [parcelasActivas])

    // Destruir mapa si se desmonta el componente
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [])

    if (loading) {
        return (
            <div className="flex mt-50 justify-center items-center text-white">
                <CircularProgress size={80} color="inherit" />
                <p className="ml-4 text-xl">Cargando datos de sensores...</p>
            </div>
        )
    }

    return (
        <div className="">
            {/* Parcelas eliminadas */}
            {parcelasInactivas.length > 0 && (
                <div className="p-4">
                    <h2 className="text-3xl font-bold mb-4 text-white">Parcelas eliminadas ❌</h2>
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
                                            {<p><strong>Lluvia:</strong> {sensor.lluvia} mm</p>}
                                            {<p><strong>Sol:</strong> {sensor.sol}%</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p><strong>Sin sensores disponibles.</strong></p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ParcelasUbicaciones