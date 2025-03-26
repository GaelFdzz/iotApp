// En src/components/MapBox.tsx

import { useEffect, useRef, useState } from "react"
import mapboxgl, { Marker } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { obtenerParcelas } from "../data/ObtenerParcelas"

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2FlbGZkeiIsImEiOiJjbTJjZXZxd2YweXNvMm1weTNvcDdjNG40In0.2POiq_70F9nHfajnXPPFSQ"

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

  // Obtener las parcelas y sensores desde la API
  useEffect(() => {
    async function fetchParcelas() {
      const data = await obtenerParcelas()
      if (data && data.length > 0) setParcelas(data)
    }

    fetchParcelas()
    const interval = setInterval(fetchParcelas, 60000) // Actualiza las parcelas cada 60 segundos

    return () => clearInterval(interval)
  }, [])

  // Inicialización y renderizado del mapa
  useEffect(() => {
    if (!mapContainerRef.current || parcelas.length === 0) return

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-86.87333776892409, 21.062168954535487],
        zoom: 12,
      })

      // Asegurarse de que el mapa está completamente cargado
      mapRef.current.on("load", () => {
        parcelas.forEach((parcela) => {
          // Accede al primer (último) sensor si existe
          const sensor = parcela.sensores && parcela.sensores.length > 0 ? parcela.sensores[0] : null
          console.log(`Procesando parcela con id ${parcela.id}:`, parcela) // Verifica los datos de la parcela

          if (parcela.latitud && parcela.longitud) {
            const popupContent = `
              <h3>${parcela.nombre}</h3>
              <p><strong>Responsable:</strong> ${parcela.responsable}</p>
              <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
              <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
              <p><strong>Último riego:</strong> ${parcela.ultimo_riego}</p>
              <p><strong>Humedad:</strong> ${sensor?.humedad !== undefined ? `${sensor.humedad}%` : "N/A"}</p>
              <p><strong>Temperatura:</strong> ${sensor?.temperatura !== undefined ? `${sensor.temperatura}°C` : "N/A"}</p>
              <p><strong>Lluvia:</strong> ${sensor?.lluvia !== undefined ? `${sensor.lluvia} ` : "N/A"}</p>
              <p><strong>Sol:</strong> ${sensor?.sol !== undefined ? `${sensor.sol} ` : "N/A"}</p>
            `

            // Añadir el marcador con popup
            new Marker()
              .setLngLat([parcela.longitud, parcela.latitud])
              .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Usamos popupContent aquí
              .addTo(mapRef.current!)
          } else {
            console.warn(`Coordenadas inválidas para la parcela con id ${parcela.id}.`)
          }
        })
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [parcelas])

  return <div ref={mapContainerRef} className="absolute w-full h-full" />
}

export default MapBox
