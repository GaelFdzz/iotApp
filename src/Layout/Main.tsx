import { useEffect, useState } from "react";
import MapBox from "../components/MapBox";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import CloudIcon from "@mui/icons-material/Cloud";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import apiData from "../data/api.json";

function Main() {
    const [sensores, setSensores] = useState({
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
    });

    useEffect(() => {
        const { sensores } = apiData;
        setSensores(sensores);  
    }, []);

    return (
        <div className="h-full flex flex-wrap gap-10">
            {/* Mapa de Mapbox */}
            <div className="w-[500px] h-full flex flex-col bg-white p-4 rounded-md overflow-hidden">
                <h1 className="text-2xl font-bold">Mapa de ubicaciones</h1>
                <MapBox />
            </div>

            {/* Métricas de sensores */}
            <div className="grid grid-cols-2 gap-6 w-auto h-fit">
                <div className="flex flex-col justify-center items-center bg-white w-[200px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex">
                        <h1 className="font-bold">Temperatura</h1>
                        <DeviceThermostatIcon sx={{ fontSize: 25 }} />
                    </div>
                    <p className="text-gray-700">{sensores.temperatura}°C</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-white w-[200px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex gap-2">
                        <h1 className="font-bold">Humedad</h1>
                        <WaterDropIcon />
                    </div>
                    <p className="text-gray-700">{sensores.humedad}%</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-white w-[200px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex gap-2">
                        <h1 className="font-bold">Clima</h1>
                        <CloudIcon />
                    </div>
                    <p className="text-gray-700">{sensores.lluvia === 0 ? "Soleado" : "Lluvia"}</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-white w-[200px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex gap-2">
                        <h1 className="font-bold">Intensidad del sol</h1>
                        <WarningAmberIcon />
                    </div>
                    <p className="text-gray-700">{sensores.sol}%</p>
                </div>
            </div>
        </div>
    );
}

export default Main;
