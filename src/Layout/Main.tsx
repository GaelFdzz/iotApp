import { useEffect, useState } from "react"
import MapBox from "../components/MapBox"
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat"
import CloudIcon from "@mui/icons-material/Cloud"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import axios from "axios"
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

            try {
                // Obtener datos de la API
                const { data } = await axios.get("/api/updated/")
                console.log("📡 Datos de la API recibidos:", data)

                if (data) {
                    setSensores(data.sensores)
                    console.log("🌡 Sensores actualizados:", data.sensores)
                } else {
                    console.warn("⚠️ No se recibieron datos válidos de la API.")
                }

                // Guardar datos en la base de datos
                await guardarDatosAPI()
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

    if (loading) {
        return (
            <div className="flex mt-50 justify-center items-center text-white">
                <CircularProgress size={80} color="inherit" />
                <p className="ml-4 text-xl">Cargando datos de sensores...</p>
            </div>
        )
    }

    return (
        <div className="contain-content">
            <h1 className="text-3xl font-bold text-white m-4 mb-0">Datos generales de las parcelas</h1>
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
        </div>
    )
}

export default Main
