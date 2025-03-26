function Header() {
    return (
        <div className="w-screen text-black">
            <header className="flex justify-between">
                <div className="flex gap-2 justify-center items-center">
                    <img src="https://unavatar.io/x/starlink" alt="Logo de compania" className="w-10 h-10 rounded-3xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" />
                </div>
                <div className="flex gap-2 justify-center items-center" onClick={()=>alert("Redireccionando al login")}>
                    <button className="flex gap-2 justify-center items-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                        <p className="text-2xl">Perfil</p>
                        <img src="https://unavatar.io/x/minecraft" alt="Logo de perfil" className="w-10 h-10 rounded-3xl" />
                    </button>
                </div>
            </header>
        </div>
    )
}

export default Header