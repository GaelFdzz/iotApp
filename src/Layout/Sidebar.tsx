import { Link } from "react-router-dom"

function Sidebar() {
    return (
        <>
            <div className="w-full h-full rounded-md content-center bg-white flex flex-col ">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                </div>
                <div>
                    <nav className="">
                        <ul className="flex flex-col w-full h-full text-black p-4 justify-center items-center">
                            <Link to="/dashboard/parcelas" className="w-full p-4 rounded-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-500 hover:shadow-lg">Parcelas</Link>
                            <Link to="/dashboard" className="w-full p-4 rounded-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-500 hover:shadow-lg">Salir</Link>
                        </ul>
                    </nav>
                </div>

            </div>
        </>
    )
}

export default Sidebar