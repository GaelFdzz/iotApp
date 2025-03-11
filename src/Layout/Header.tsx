function Header() {
    return (
        <div className="w-screen">
            <header className="flex justify-between">
                <p>Logo</p>
                <p>Profile logo</p>
            </header>
            <div className="flex">
                <p>Dashboard</p>
                <p className="">Cultivos del sur</p>
                <p>|</p>
                <p>Mapa de ubicaciones</p>
            </div>
        </div>
    )
}

export default Header