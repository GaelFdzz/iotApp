import { useEffect, useState } from "react"
import MapBox from "../components/MapBox"
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat"
import CloudIcon from "@mui/icons-material/Cloud"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import axios from "axios"
import { obtenerHistoricoSensores } from "../data/ObtenerHistoricoSensores"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js"
import { guardarDatosAPI } from "../data/GuardarDatosAPI"
import CircularProgress from "@mui/material/CircularProgress"

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

function Main() {
    const [loading, setLoading] = useState(true)
    const [sensores, setSensores] = useState({
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
    })

    const [historico, setHistorico] = useState({
        temperaturas: [] as number[],
        humedades: [] as number[],
        lluvias: [] as number[],
        sol: [] as number[],
        timestamps: [] as string[],
    })

    useEffect(() => {
        async function fetchData() {
            console.log("⏳ Ejecutando fetchData...")
            setLoading(true)
            // await new Promise((resolve) => setTimeout(resolve, 2000)) // Espera 2 segundos
            try {
                // Obtener histórico de sensores
                const historicoData = await obtenerHistoricoSensores()
                console.log("📊 Histórico de sensores recibido:", historicoData)

                if (historicoData.length > 0) {
                    const temperaturas: number[] = []
                    const humedades: number[] = []
                    const lluvias: number[] = []
                    const sol: number[] = []
                    const timestamps: string[] = []

                    historicoData.forEach((registro: any) => {
                        temperaturas.push(registro.temperatura)
                        humedades.push(registro.humedad)
                        lluvias.push(registro.lluvia)
                        sol.push(registro.sol)

                        const fecha = new Date(registro.fecha_registro)
                        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
                        timestamps.push(fechaFormateada)
                    })

                    setHistorico({
                        temperaturas,
                        humedades,
                        lluvias,
                        sol,
                        timestamps,
                    })
                }

                // Obtener datos de la API
                const { data } = await axios.get("api/updated/")
                console.log("📡 Datos de la API recibidos:", data)

                if (data) {
                    setSensores(data.sensores)
                    console.log("🌡 Sensores actualizados:", data.sensores)

                    setHistorico((prev) => {
                        const fechaActual = new Date()
                        const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`

                        return {
                            ...prev,
                            temperaturas: [...prev.temperaturas, data.sensores.temperatura],
                            humedades: [...prev.humedades, data.sensores.humedad],
                            lluvias: [...prev.lluvias, data.sensores.lluvia],
                            sol: [...prev.sol, data.sensores.sol],
                            timestamps: [...prev.timestamps, fechaFormateada],
                        }
                    })
                } else {
                    console.warn("⚠️ No se recibieron datos válidos de la API.")
                }
            } catch (error) {
                console.error("❌ Error en fetchData:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 60000)

        guardarDatosAPI()

        return () => clearInterval(interval)
    }, [])

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
    }

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
                backgroundColor: "#FFC701",
            },
        ],
    }

    // Calcular el promedio de cada sensor
    const calcularPromedio = (arr: number[]) => {
        if (arr.length === 0) return 0
        const suma = arr.reduce((acc, val) => acc + val, 0)
        return parseFloat((suma / arr.length).toFixed(2))
    }

    const promedioTemperatura = calcularPromedio(historico.temperaturas)
    const promedioHumedad = calcularPromedio(historico.humedades)
    const promedioLluvia = calcularPromedio(historico.lluvias)
    const promedioSol = calcularPromedio(historico.sol)

    const doughnutChartData = {
        labels: ["Temperatura", "Humedad", "Lluvia", "Sol"],
        datasets: [
            {
                label: "Promedio histórico",
                data: [
                    promedioTemperatura,
                    promedioHumedad,
                    promedioLluvia,
                    promedioSol,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(30, 144, 255, 0.2)",
                    "rgba(138, 43, 226, 0.2)",
                    "rgba(255, 215, 0, 0.4)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(30, 14, 255, 1)",
                    "rgba(138, 43, 226, 1)",
                    "rgba(255, 215, 0, 1)",
                ],
                borderWidth: 1,
            },
        ],
    }

    if (loading) {
        return (
            <div className="flex mt-50 justify-center items-center text-white">
                <CircularProgress size={80} color="inherit" />
                <p className="ml-4 text-xl">Cargando datos de sensores...</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-wrap gap-10 p-4 overflow-auto">
            {/* Mapa de Mapbox */}
            <div className="w-[500px] h-full flex flex-col bg-[#D9D9D9] p-4 rounded-md">
                <h1 className="text-2xl font-bold mb-2">Mapa de ubicaciones de las parcelas 📍</h1>
                <MapBox />
            </div>

            {/* Métricas de sensores */}
            <div className="grid grid-cols-2 gap-6 w-auto h-fit scroll-hide">
                <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[280px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex">
                        <h1 className="font-bold text-[20px]">Temperatura</h1>
                        <DeviceThermostatIcon sx={{ fontSize: 28 }} />
                    </div>
                    <p className="text-gray-700">{sensores.temperatura}°C</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[280px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex gap-2">
                        <h1 className="font-bold text-[20px]">Humedad</h1>
                        <WaterDropIcon />
                    </div>
                    <p className="text-gray-700 text-[16px]">{sensores.humedad}%</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[280px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex gap-2">
                        <h1 className="font-bold text-[20px]">Clima</h1>
                        <CloudIcon />
                    </div>
                    <p className="text-gray-700 text-[16px]">{sensores.lluvia === 0 ? "Soleado" : "Lluvia"}</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[280px] h-[120px] rounded-md shadow-md text-1xl">
                    <div className="flex gap-2">
                        <h1 className="font-bold text-[20px]">Intensidad del sol</h1>
                        <WarningAmberIcon />
                    </div>
                    <p className="text-gray-700 text-[16px]">{sensores.sol}%</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="flex flex-col bg-[#151321]">
                <h1 className="text-3xl font-bold text-white">Gráficos historicos de los terrenos</h1>
                <p className="text-white">Historico de los ultimos 50 registros de los sensores</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full justify-between scroll-hide">
                <div className="bg-[#D9D9D9] p-4 rounded-md shadow-md col-span-1 md:col-span-1 mb-4">
                    <h2 className="flex text-xl font-semibold mb-4 justify-center">Temperatura y Humedad</h2>
                    <Line data={lineChartData} height={400} />
                </div>
                <div className="bg-[#D9D9D9] p-4 rounded-md shadow-md col-span-1 md:col-span-1 mb-4">
                    <h2 className="flex text-xl font-semibold mb-4 justify-center">Lluvia y Sol</h2>
                    <Bar data={barChartData} height={400} />
                </div>
                <div className="bg-[#D9D9D9] p-4 rounded-md shadow-md col-span-1 md:col-span-1 mb-4">
                    <div>
                        <h2 className="flex text-xl font-semibold mb-4 justify-center">Todos los sensores</h2>
                        <Doughnut data={doughnutChartData} height={400} />
                        <p className="mt-30 text-gray-400">Promedio de los registros de cada sensor</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main