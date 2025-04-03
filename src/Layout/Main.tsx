import { useEffect, useState } from "react"
import MapBox from "../components/MapBox"
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat"
import CloudIcon from "@mui/icons-material/Cloud"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import axios from "axios"
import { obtenerHistoricoSensores } from "../data/ObtenerHistoricoSensores"
import { guardarDatosAPI } from "../data/GuardarDatosAPI"
import CircularProgress from "@mui/material/CircularProgress"



function Main() {
    const [loading, setLoading] = useState(true)
    const [sensores, setSensores] = useState({
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
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



    if (loading) {
        return (
            <div className="flex mt-50 justify-center items-center text-white">
                <CircularProgress size={80} color="inherit" />
                <p className="ml-4 text-xl">Cargando datos de sensores...</p>
            </div>
        )
    }

    return (
        <>
            <h1 className=" text-white m-4 text-4xl font-bold">Dashboard</h1>
            <div className="h-full flex flex-wrap gap-10 p-4 overflow-auto">
                {/* Mapa de Mapbox */}
                <div className="w-[500px] h-[400px] flex flex-col bg-[#D9D9D9] p-4 rounded-md">
                    <h1 className="text-2xl font-bold mb-2">Mapa de ubicaciones de las parcelas</h1>
                    <MapBox />
                </div>

                {/* Métricas de sensores */}
                <div className="grid grid-cols-2 gap-6 w-auto h-fit scroll-hide">
                    <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[270px] h-[120px] rounded-md shadow-md text-1xl">
                        <div className="flex">
                            <h1 className="font-bold text-[20px]">Temperatura</h1>
                            <DeviceThermostatIcon sx={{ fontSize: 28 }} />
                        </div>
                        <p className="text-gray-700">{sensores.temperatura}°C</p>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[270px] h-[120px] rounded-md shadow-md text-1xl">
                        <div className="flex gap-2">
                            <h1 className="font-bold text-[20px]">Humedad</h1>
                            <WaterDropIcon />
                        </div>
                        <p className="text-gray-700 text-[16px]">{sensores.humedad}%</p>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[270px] h-[120px] rounded-md shadow-md text-1xl">
                        <div className="flex gap-2">
                            <h1 className="font-bold text-[20px]">Clima</h1>
                            <CloudIcon />
                        </div>
                        <p className="text-gray-700 text-[16px]">{sensores.lluvia === 0 ? "Soleado" : "Lluvia"}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-[#D9D9D9] w-[270px] h-[120px] rounded-md shadow-md text-1xl">
                        <div className="flex gap-2">
                            <h1 className="font-bold text-[20px]">Intensidad del sol</h1>
                            <WarningAmberIcon />
                        </div>
                        <p className="text-gray-700 text-[16px]">{sensores.sol}%</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main