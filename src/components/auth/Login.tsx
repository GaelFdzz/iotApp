import { useState } from "react"
import { supabase } from "../../data/supabaseConfig"
import { Link } from "react-router-dom"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)

        if (error) setError(error.message)
        else window.location.href = "/dashboard"
    }

    return (
        <div className="bg-[#031C8C] min-h-screen flex items-center justify-center">
            <div className="max-w-md mx-auto mt-10 p-6 bg-[#151321] rounded-2xl shadow">
                <h1 className="flex justify-center text-3xl text-[#C1C9D4] font-bold mb-4">Iniciar sesión</h1>
                <p className="text-2xl mb-4 text-[#C1C9D4] justify-self-center">Bienvenido! 🌳</p>

                <label className="text-[#C1C9D4]">Correo electrónico</label>
                <input
                    className="w-full mb-2 p-2 border rounded bg-[#C1C9D4]"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="text-[#C1C9D4]">Contraseña</label>
                <input
                    className="w-full mb-4 p-2 border rounded bg-[#C1C9D4]"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 bg-[#031C8C] text-[#C1C9D4] font-bold px-4 py-2 rounded transition duration-300 ease-in-out border border-transparent ${loading ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1 hover:scale-110 hover:bg-[#090B52] hover:text-white hover:shadow-lg hover:border-[#161CC3]"
                            }`}
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        )}
                        {loading ? "Iniciando..." : "Iniciar sesión"}
                    </button>

                    <span className="flex gap-1">
                        <p className="text-[#C1C9D4]">¿No tienes una cuenta?</p>
                        <Link
                            to="/register"
                            className="text-blue-500 underline transition delay-50 duration-300 ease-in-out hover:text-white"
                        >
                            Regístrate
                        </Link>
                    </span>
                </div>

                {error && <p className="flex justify-center text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    )
}