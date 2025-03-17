import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import Sidebar from "./Sidebar";

function DashboardLayout() {
    return (
        <>
            <div className="w-screen h-screen">
                <div
                    className="grid grid-cols-5 gap-4 bg-blue-400/50 w-full h-full"
                    style={{ gridTemplateRows: "auto 1fr 1fr 1fr auto" }}
                >
                    {/* Header */}
                    <div className="col-span-5 p-4 flex bg-white">
                        <Header />
                    </div>

                    {/* Sidebar */}
                    <div className="row-span-3 row-start-2 p-4 h-full w-full overflow-auto">
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <div className="col-span-4 row-span-3 row-start-2 p-4 h-full w-full overflow-auto">
                        <Outlet />
                    </div>

                    {/* Footer */}
                    <div className="col-span-5 row-start-5 p-4 h-full w-full bg-white">
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardLayout;