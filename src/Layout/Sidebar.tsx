import { Link } from "react-router-dom"
import { supabase } from "../data/supabaseConfig"

function Sidebar() {
    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = "/login"
    }

    return (
        <>
            <div className="w-full h-full rounded-md content-center bg-white flex flex-col ">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard 🚀</h1>
                </div>
                <div>
                    <nav className="">
                        <ul className="flex flex-col w-full h-full text-black p-4 justify-center items-center">
                            <Link to="/dashboard" className="w-full p-4 rounded-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-700 hover:text-white hover:shadow-lg">Inicio</Link>
                            <Link to="/dashboard/parcelas" className="w-full p-4 rounded-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-700 hover:text-white hover:shadow-lg">Parcelas</Link>
                            <button onClick={() => handleLogout()} className="w-full flex p-4 rounded-md cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-700 hover:text-white hover:shadow-lg">Cerrar Sesión</button>
                        </ul>
                    </nav>
                </div>

            </div>
        </>
    )
}

export default Sidebar