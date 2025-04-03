import { Bar, Doughnut, Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js"
import { useEffect, useState } from "react"
import { obtenerHistoricoSensores } from "../data/ObtenerHistoricoSensores"
import { CircularProgress } from "@mui/material"

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

function Graficos() {
    const [loading, setLoading] = useState(true)

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
            } catch (error) {
                console.error("❌ Error en fetchData:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 60000)

        return () => clearInterval(interval)
    }, [])

    const [historico, setHistorico] = useState({
        temperaturas: [] as number[],
        humedades: [] as number[],
        lluvias: [] as number[],
        sol: [] as number[],
        timestamps: [] as string[],
    })

    const lineChartData = {
        labels: historico.timestamps.slice().reverse(), // Invertimos los timestamps
        datasets: [
            {
                label: "Temperatura (°C)",
                data: historico.temperaturas.slice().reverse(), // Invertimos los valores
                borderColor: "#FF6347",
                backgroundColor: "rgba(255, 99, 71, 0.2)",
                fill: true,
            },
            {
                label: "Humedad (%)",
                data: historico.humedades.slice().reverse(), // Invertimos los valores
                borderColor: "#1E90FF",
                backgroundColor: "rgba(30, 144, 255, 0.2)",
                fill: true,
            },
        ],
    }

    const barChartData = {
        labels: historico.timestamps.slice().reverse(),
        datasets: [
            {
                label: "Lluvia (mm)",
                data: historico.lluvias.slice().reverse(),
                backgroundColor: "#8A2BE2",
            },
            {
                label: "Intensidad del sol (%)",
                data: historico.sol.slice().reverse(),
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
        labels: ["Temperatura (°C)", "Humedad (%)", "Lluvia (mm)", "Intensidad del sol (%)"],
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
        <div className="p-4">
            {/* Gráficos */}
            <div className="flex flex-col bg-[#151321]">
                <h1 className="text-3xl font-bold text-white pb-4">Gráficos historicos de los terrenos</h1>
                <p className="text-white pb-4">Historico de los ultimos 50 registros de los sensores</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full justify-between">
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
                        <p className="mt-30 text-gray-400 place-self-center">Promedio de los registros de cada sensor</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Graficos