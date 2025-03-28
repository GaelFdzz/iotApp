import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import Header from "./Header"
import Sidebar from "./Sidebar"

function DashboardLayout() {
    return (
        <>
            <div className="w-screen h-screen">
                <div
                    className="grid grid-cols-5 gap-4 bg-[#031C8C] w-full h-full"
                    style={{ gridTemplateRows: "auto 1fr 1fr 1fr auto" }}
                >
                    <div className="col-span-5 p-4 flex bg-[#151321]">
                        <Header />
                    </div>

                    <div className="row-span-3 row-start-2 ml-2 p-4 h-full w-full overflow-auto bg-[#151321] rounded-2xl">
                        <Sidebar />
                    </div>

                    <div className="col-span-4 row-span-3 row-start-2 p-4 h-full w-auto overflow-auto mr-4 bg-[#151321] rounded-2xl">
                        <Outlet  />
                    </div>

                    <div className="col-span-5 row-start-5 p-4 h-full w-full bg-[#151321]">
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout