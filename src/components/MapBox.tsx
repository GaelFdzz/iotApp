import { useEffect, useRef, useState } from "react"
import mapboxgl, { Marker } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { obtenerParcelas } from "../data/ObtenerParcelas"

mapboxgl.accessToken = "pk.eyJ1IjoiZ2FlbGZkeiIsImEiOiJjbTJjZXZxd2YweXNvMm1weTNvcDdjNG40In0.2POiq_70F9nHfajnXPPFSQ"

interface Sensor {
  humedad: number
  temperatura: number
  lluvia?: number
  sol?: number
}

interface Parcela {
  id: number
  responsable: string
  longitud: number
  latitud: number
  nombre: string
  ubicacion: string
  tipo_cultivo: string
  ultimo_riego: string
  sensores: Sensor[]
}

function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const markersRef = useRef<Marker[]>([])

  // Obtener las parcelas y sensores desde la API
  useEffect(() => {
    async function fetchParcelas() {
      const data = await obtenerParcelas()
      console.log("📌 Parcelas obtenidas:", data)
      if (data && data.length > 0) setParcelas(data)
    }


    fetchParcelas()
    const interval = setInterval(fetchParcelas, 60000)

    return () => clearInterval(interval)
  }, [])

  // Inicialización del mapa
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-86.87333776892409, 21.062168954535487],
        zoom: 12,
      })
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || parcelas.length === 0) return

    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    setTimeout(() => {
      parcelas.forEach(parcela => {
        if (parcela.latitud && parcela.longitud) {
          const sensor = parcela.sensores.length > 0 ? parcela.sensores[0] : null
          const popupContent = `
            <h3>${parcela.nombre}</h3>
            <p><strong>Responsable:</strong> ${parcela.responsable}</p>
            <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
            <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
            <p><strong>Último riego:</strong> ${parcela.ultimo_riego}</p>
            <p><strong>Humedad:</strong> ${sensor?.humedad ?? "N/A"}%</p>
            <p><strong>Temperatura:</strong> ${sensor?.temperatura ?? "N/A"}°C</p>
            <p><strong>Lluvia:</strong> ${sensor?.lluvia ?? "N/A"} mm</p>
            <p><strong>Sol:</strong> ${sensor?.sol ?? "N/A"}%</p>
          `

          const marker = new Marker()
            .setLngLat([parcela.longitud, parcela.latitud])
            .setPopup(new mapboxgl.Popup().setHTML(popupContent))
            .addTo(mapRef.current!)

          markersRef.current.push(marker)
        }
      })
    }, 500)
  }, [parcelas])

  return (
    <>
      <div ref={mapContainerRef} className="absolute w-full h-full">
        {parcelas.length === 0 && (
            <div className="contain-content absolute flex bg-white text-center z-1 bg-clip-text items-center justify-center w-full h-full">
            <p className="text-white p-3 rounded-[7px] bg-red-500/30 border border-red-600">No hay parcelas activas en este momento.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default MapBox