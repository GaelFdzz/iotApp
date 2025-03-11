import Header from "./Header";

function DashboardLayout() {
    return (
        <>
            <div className="w-screen h-screen">
                <div
                    className="grid grid-cols-5 gap-4 bg-blue-800 w-full h-full"
                    style={{ gridTemplateRows: "auto 1fr 1fr 1fr auto" }} // Ajusta el tamaño de las filas
                >
                    {/* Header */}
                    <div className="col-span-5 h-16 flex"> {/* Header más pequeño */}
                        <Header />
                    </div>

                    {/* Sidebar */}
                    <div className="row-span-3 row-start-2 bg-gray-200 p-4 h-full w-full overflow-auto">
                        Sidebar
                    </div>

                    {/* Main Content */}
                    <div className="col-span-4 row-span-3 row-start-2 bg-white p-4 h-full w-full overflow-auto">
                        Main Content
                    </div>

                    {/* Footer */}
                    <div className="col-span-5 row-start-5 bg-gray-300 p-4 h-full w-full">
                        Footer
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardLayout;