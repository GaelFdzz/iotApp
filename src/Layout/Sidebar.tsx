import { Link, useLocation } from "react-router-dom"
import { supabase } from "../data/supabaseConfig"

function Sidebar() {
    const location = useLocation() // Obtiene la ruta actual

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = "/login"
    }

    // Función para asignar clases activas
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path
        return `w-full p-4 rounded-md transition duration-300 ease-in-out ${isActive
            ? "bg-[#090B52] text-white shadow-lg border border-[#161CC3] hover:-translate-y-1 hover:scale-110"
            : "text-[#C1C9D4] border border-transparent hover:bg-[#090B52] hover:text-white hover:shadow-lg hover:border-[#161CC3] hover:-translate-y-1 hover:scale-110"
            }`
    }

    return (
        <div className="w-full h-full rounded-md content-center bg-[#151321] flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-[#C1C9D4]">Dashboard</h1>
            </div>
            <nav className="flex flex-col flex-grow">
                <ul className="flex flex-col w-full h-full p-4 justify-start items-center flex-grow">
                    <div className="flex flex-col w-full gap-4">
                        <Link to="/dashboard" className={getLinkClass("/dashboard")}>Inicio</Link>
                        <Link to="/dashboard/graficos" className={getLinkClass("/dashboard/graficos")}>Gráficos</Link>
                        <Link to="/dashboard/parcelas" className={getLinkClass("/dashboard/parcelas")}>Parcelas</Link>
                    </div>
                    <button onClick={handleLogout} className="w-full flex p-4 text-[#C1C9D4] rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-[#090B52] hover:text-white hover:shadow-lg border border-transparent hover:border-[#161CC3] hover:-translate-y-1 hover:scale-110 mt-auto">
                        Cerrar Sesión
                    </button>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar