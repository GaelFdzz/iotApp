import { useState } from "react"
import { supabase } from "../../data/supabaseConfig"
import { Link } from "react-router-dom"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleRegister = async () => {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setError(error.message)
        else setMessage("Registro exitoso. Revisa tu correo para confirmar.")
    }

    return (
        <div className="bg-indigo-700 min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('../../public/campo.jpg')"}}>

            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-4">Registro</h2>
                <input
                    className="w-full mb-2 p-2 border rounded"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full mb-4 p-2 border rounded"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div>
                    <button
                        onClick={handleRegister}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Registrarse
                    </button>

                    <span className="flex gap-1">
                        <p>¿Ya tienes una cuenta? </p>
                        <Link to="/login" className="text-blue-500 underline">
                            Iniciar sesión
                        </Link>
                    </span>
                </div>
                <div className="flex justify-center">
                    {message && <p className="text-green-500 mt-2">{message}</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

            </div>
        </div>
    )
}