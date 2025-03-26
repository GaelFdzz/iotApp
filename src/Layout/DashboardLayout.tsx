import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import Header from "./Header"
import Sidebar from "./Sidebar"

function DashboardLayout() {
    return (
        <>
            <div className="w-screen h-screen">
                <div
                    className="grid grid-cols-5 gap-4 bg-indigo-600 w-full h-full"
                    style={{ gridTemplateRows: "auto 1fr 1fr 1fr auto" }}
                >
                    <div className="col-span-5 p-4 flex bg-white">
                        <Header />
                    </div>

                    <div className="row-span-3 row-start-2 p-4 h-full w-full overflow-auto">
                        <Sidebar />
                    </div>

                    <div className="col-span-4 row-span-3 row-start-2 p-4 h-full w-full overflow-auto">
                        <Outlet />
                    </div>

                    <div className="col-span-5 row-start-5 p-4 h-full w-full bg-white">
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout