import { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import apiData from "../data/api.json"; // Importa los datos directamente

mapboxgl.accessToken = "pk.eyJ1IjoiZ2FlbGZkeiIsImEiOiJjbTJjZXZxd2YweXNvMm1weTNvcDdjNG40In0.2POiq_70F9nHfajnXPPFSQ";

function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [parcelas, setParcelas] = useState(apiData.parcelas); // Asigna los datos directamente

  useEffect(() => {
    if (!mapContainerRef.current || parcelas.length === 0) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-86.87333776892409, 21.062168954535487],
        zoom: 12,
      });
    }

    // Agregar marcadores y mostrar los datos relevantes en el popup
    parcelas.forEach((parcela) => {
      const marker = new Marker()
        .setLngLat([parcela.longitud, parcela.latitud])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <h3>${parcela.nombre}</h3>
            <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
            <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
            <p><strong>Último riego:</strong> ${parcela.ultimo_riego}</p>
            <p><strong>Humedad:</strong> ${parcela.sensor.humedad}%</p>
            <p><strong>Temperatura:</strong> ${parcela.sensor.temperatura}°C</p>
          `)
        )
        .addTo(mapRef.current!);

      // Si deseas agregar algún comportamiento al hacer clic (ejemplo, mostrar más detalles)
      // Aquí no redirigimos, solo mostramos el popup.
      marker.getElement().addEventListener("click", () => {
        console.log("Mostrando datos de la parcela:", parcela.nombre);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [parcelas]);

  return <div ref={mapContainerRef} className="absolute w-full h-full" />;
}

export default MapBox;
