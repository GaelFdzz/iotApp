import { useState } from "react"
import { supabase } from "../../data/supabaseConfig"
import { Link } from "react-router-dom"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else window.location.href = "/dashboard"
    }

    return (
        <div className="bg-indigo-700 min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/campoLogin.jpg')"}}>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
                <h1 className="flex justify-center text-3xl font-bold mb-4">Iniciar sesión</h1>
                <p className="text-2xl mb-1">Bienvenido! 🌳</p>
                <label>Correo electronico</label>
                <input
                    className="w-full mb-2 p-2 border rounded"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Contraseña</label>
                <input
                    className="w-full mb-4 p-2 border rounded"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Iniciar sesión
                    </button>

                    <span className="flex gap-1">
                        <p>¿No tienes una cuenta? </p>
                        <Link to="/register" className="text-blue-500 underline">
                            Registrate
                        </Link>
                    </span>
                </div>

                {error && <p className="flex justify-center text-red-500 mt-2">{error}</p>}
            </div>
        </div>

    )
}