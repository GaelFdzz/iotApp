import { useEffect, useState } from "react";
import MapBox from "../components/MapBox";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import CloudIcon from "@mui/icons-material/Cloud";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import { obtenerHistoricoSensores } from "../data/ObtenerHistoricoSensores"; // Importa la función de obtener histórico
import { Line, Bar, Doughnut } from "react-chartjs-2"; // Cambiar de Radar a Doughnut
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes necesarios para los gráficos
ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale, // Registrar la escala radialLinear para gráficos de radar
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Main() {
    const [sensores, setSensores] = useState({
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
    });

    // Define los tipos de datos para el histórico
    const [historico, setHistorico] = useState({
        temperaturas: [] as number[], // Aseguramos que sea un arreglo de números
        humedades: [] as number[],
        lluvias: [] as number[],
        sol: [] as number[],
        timestamps: [] as string[], // Array de cadenas (timestamps)
    });

    useEffect(() => {
        async function fetchData() {
            // Obtener el histórico de los sensores desde Supabase
            const historicoData = await obtenerHistoricoSensores();
    
            // Si obtenemos datos históricos, los agregamos al estado
            if (historicoData.length > 0) {
                const temperaturas: number[] = [];
                const humedades: number[] = [];
                const lluvias: number[] = [];
                const sol: number[] = [];
                const timestamps: string[] = [];
    
                historicoData.forEach((registro: any) => {
                    temperaturas.push(registro.temperatura);
                    humedades.push(registro.humedad);
                    lluvias.push(registro.lluvia);
                    sol.push(registro.sol);
    
                    // Formatear la fecha para que solo muestre el día (día/mes/año)
                    const fecha = new Date(registro.fecha_registro);
                    const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
                    timestamps.push(fechaFormateada);
                });
    
                setHistorico({
                    temperaturas,
                    humedades,
                    lluvias,
                    sol,
                    timestamps,
                });
            }
    
            // Obtener los datos actuales de los sensores
            const { data } = await axios.get("http://moriahmkt.com/iotapp/");
            if (data) {
                setSensores(data.sensores);
                // Agregar los nuevos valores de los sensores al histórico
                setHistorico((prev) => {
                    const fechaActual = new Date();
                    const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
    
                    return {
                        ...prev,
                        temperaturas: [...prev.temperaturas, data.sensores.temperatura],
                        humedades: [...prev.humedades, data.sensores.humedad],
                        lluvias: [...prev.lluvias, data.sensores.lluvia],
                        sol: [...prev.sol, data.sensores.sol],
                        timestamps: [...prev.timestamps, fechaFormateada],
                    };
                });
            }
        }
    
        fetchData();
        const interval = setInterval(fetchData, 60000); // Actualiza cada 60 segundos
    
        return () => clearInterval(interval);
    }, []);
    

    // Configuración de gráficos
    const lineChartData = {
        labels: historico.timestamps,
        datasets: [
            {
                label: "Temperatura (°C)",
                data: historico.temperaturas,
                borderColor: "#FF6347",
                backgroundColor: "rgba(255, 99, 71, 0.2)",
                fill: true,
            },
            {
                label: "Humedad (%)",
                data: historico.humedades,
                borderColor: "#1E90FF",
                backgroundColor: "rgba(30, 144, 255, 0.2)",
                fill: true,
            },
        ],
    };

    const barChartData = {
        labels: historico.timestamps,
        datasets: [
            {
                label: "Lluvia (mm)",
                data: historico.lluvias,
                backgroundColor: "#8A2BE2",
            },
            {
                label: "Intensidad del sol (%)",
                data: historico.sol,
                backgroundColor: "#FFD700",
            },
        ],
    };

    const doughnutChartData = {
        labels: ["Temperatura", "Humedad", "Lluvia", "Sol"],
        datasets: [
            {
                label: "Sensor",
                data: [
                    sensores.temperatura,
                    sensores.humedad,
                    sensores.lluvia,
                    sensores.sol,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(30, 144, 255, 0.2)",
                    "rgba(138, 43, 226, 0.2)",
                    "rgba(255, 215, 0, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(30, 144, 255, 1)",
                    "rgba(138, 43, 226, 1)",
                    "rgba(255, 215, 0, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

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

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                <div className="bg-white p-4 rounded-md shadow-md col-span-1 md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Gráfico de Temperatura y Humedad</h2>
                    <Line data={lineChartData} height={400} />
                </div>
                <div className="bg-white p-4 rounded-md shadow-md col-span-1 md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Gráfico de Lluvia y Sol</h2>
                    <Bar data={barChartData} height={400} />
                </div>
                <div className="bg-white p-4 rounded-md shadow-md col-span-1 md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Gráfico Dona</h2>
                    <Doughnut data={doughnutChartData} height={400} />
                </div>
            </div>
        </div>
    );
}

export default Main;
