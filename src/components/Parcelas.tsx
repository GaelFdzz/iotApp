import { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import apiData from "../data/api.json";

mapboxgl.accessToken = "pk.eyJ1IjoiZ2FlbGZkeiIsImEiOiJjbTJjZXZxd2YweXNvMm1weTNvcDdjNG40In0.2POiq_70F9nHfajnXPPFSQ";

function Parcelas() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [parcelas, setParcelas] = useState(apiData.parcelas);

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
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [parcelas]);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Parcelas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parcelas.map((parcela) => (
                    <div key={parcela.id} className="p-4 bg-white rounded-md shadow-md">
                        <h2 className="text-xl font-semibold">{parcela.nombre}</h2>
                        <p><strong>Ubicación:</strong> {parcela.ubicacion}</p>
                        <p><strong>Tipo de cultivo:</strong> {parcela.tipo_cultivo}</p>
                        <p><strong>Último riego:</strong> {parcela.ultimo_riego}</p>
                        <p><strong>Humedad:</strong> {parcela.sensor.humedad}%</p>
                        <p><strong>Temperatura:</strong> {parcela.sensor.temperatura}°C</p>
                    </div>
                ))}
            </div>
            <div ref={mapContainerRef} className="w-full h-[250px] mt-6" />
        </div>
    );
}

export default Parcelas;
