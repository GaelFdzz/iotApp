import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../../data/supabaseConfig"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setIsAuthenticated(!!data.session)
        })
    }, [])

    if (isAuthenticated === null) return <div>Cargando...</div>
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}
