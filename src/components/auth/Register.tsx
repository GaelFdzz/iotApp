import { useState } from "react"
import { supabase } from "../../data/supabaseConfig"
import { Link } from "react-router-dom"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
        setLoading(true)
        setError(null)
        setMessage(null)
    
        const { data: existingUser, error: fetchError } = await supabase.rpc("check_email_exists", { email_input: email })
    
        if (fetchError) {
            console.error("Error al verificar usuario:", fetchError)
            setError("Error al verificar el usuario.")
            setLoading(false)
            return
        }
    
        if (existingUser) {
            setError("Este correo ya está registrado. Intenta iniciar sesión.")
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: "http://localhost:5173/login" }
        })
    
        setLoading(false)
    
        if (error) {
            setError(error.message)
        } else {
            setMessage("Registro exitoso. Revisa tu correo para confirmar.")
        }
    }
    
    return (
        <div className="bg-[#151321] min-h-screen flex items-center justify-center">
            <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl">
                <h2 className="flex justify-center text-3xl text-[#C1C9D4] font-bold mb-4">Registro de nuevos usuarios</h2>

                <label className="text-[#C1C9D4]">Correo electrónico</label>
                <input
                    className="w-full mb-2 p-2 border rounded bg-[#C1C9D4]"
                    type="email"
                    placeholder="correo@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="text-[#C1C9D4]">Contraseña</label>
                <input
                    className="w-full mb-4 p-2 border rounded bg-[#C1C9D4]"
                    type="password"
                    placeholder="Longitud mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 bg-[#031C8C] text-[#C1C9D4] font-bold px-4 py-2 rounded transition duration-300 ease-in-out border border-transparent ${loading ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1 hover:scale-110 hover:bg-[#090B52] hover:text-white hover:shadow-lg hover:border-[#161CC3]"}`
                        }
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
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>

                    <span className="flex gap-1">
                        <p className="text-[#C1C9D4]">¿Ya tienes una cuenta?</p>
                        <Link
                            to="/login"
                            className="text-blue-500 underline transition delay-50 duration-300 ease-in-out hover:text-white"
                        >
                            Iniciar sesión
                        </Link>
                    </span>
                </div>

                <div className="flex justify-center flex-col items-center">
                    {message && <p className="text-green-500 mt-2">{message}</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </div>
        </div>
    )
}