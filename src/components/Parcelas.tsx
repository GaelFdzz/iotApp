import { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { obtenerParcelas } from "../data/ObtenerParcelas";

// Define la interfaz para un sensor
interface Sensor {
    id: number;
    humedad: number;
    temperatura: number;
    lluvia?: number;
    sol?: number;
}

// Define la interfaz para una parcela
interface Parcela {
    id: string;
    nombre: string;
    responsable: string;
    ubicacion: string;
    tipo_cultivo: string;
    ultimo_riego: string;
    longitud: number;
    latitud: number;
    sensores: Sensor[]; // Ahora esto es un array de sensores
}

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ2FlbGZkeiIsImEiOiJjbTJjZXZxd2YweXNvMm1weTNvcDdjNG40In0.2POiq_70F9nHfajnXPPFSQ";

function Parcelas() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [parcelas, setParcelas] = useState<Parcela[]>([]); // Especificamos el tipo de las parcelas

    useEffect(() => {
        async function fetchParcelas() {
            const data = await obtenerParcelas();
            if (data) setParcelas(data);
        }

        fetchParcelas();
        const interval = setInterval(fetchParcelas, 60000); // Actualiza cada 60 segundos

        return () => clearInterval(interval);
    }, []);

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

        // Asegurarse de que el mapa está completamente cargado
        parcelas.forEach((parcela) => {
            if (parcela.latitud && parcela.longitud) {
                new Marker()
                    .setLngLat([parcela.longitud, parcela.latitud])
                    .setPopup(
                        new mapboxgl.Popup().setHTML(`
              <h3>${parcela.nombre}</h3>
              <p><strong>Responsable:</strong> ${parcela.responsable}</p>
              <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
              <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
              <p><strong>Último riego:</strong> ${parcela.ultimo_riego}</p>
              ${parcela.sensores
                                .map(
                                    (sensor) => `
                    <p><strong>Humedad:</strong> ${sensor.humedad}%</p>
                    <p><strong>Temperatura:</strong> ${sensor.temperatura}°C</p>
                    ${sensor.lluvia ? `<p><strong>Lluvia:</strong> ${sensor.lluvia}</p>` : ""}
                    ${sensor.sol ? `<p><strong>Sol:</strong> ${sensor.sol}</p>` : ""}
                  `
                                )
                                .join("")}
            `)
                    )
                    .addTo(mapRef.current!);
            }
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
                        <p><strong>Responsable:</strong>{parcela.responsable}</p>
                        <p><strong>Ubicación:</strong> {parcela.ubicacion}</p>
                        <p><strong>Tipo de cultivo:</strong> {parcela.tipo_cultivo}</p>
                        <p><strong>Último riego:</strong> {parcela.ultimo_riego}</p>
                        {parcela.sensores.length > 0 ? (
                            parcela.sensores.map((sensor, index) => (
                                <div key={index}>
                                    <p><strong>Humedad:</strong> {sensor.humedad}%</p>
                                    <p><strong>Temperatura:</strong> {sensor.temperatura}°C</p>
                                    {sensor.lluvia && <p><strong>Lluvia:</strong> {sensor.lluvia}</p>}
                                    {sensor.sol && <p><strong>Sol:</strong> {sensor.sol}</p>}
                                </div>
                            ))
                        ) : (
                            <p><strong>Sin sensores disponibles.</strong></p>
                        )}
                    </div>
                ))}
            </div>
            <div ref={mapContainerRef} className="w-full h-[250px] mt-6" />
        </div>
    );
}

export default Parcelas;
