import { Route, Routes } from "react-router-dom"
import DashboardLayout from "./Layout/DashboardLayout"
import Main from "./Layout/Main"
import Parcelas from "./components/Parcelas"
import Login from "./components/auth/Login"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Register from "./components/auth/Register"
import Graficos from "./components/Graficos"

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Main />} />
          <Route path="graficos" element={<Graficos />} />
          <Route path="parcelas" element={<Parcelas />} />
        </Route>
      </Routes>
    </>
  )
}

export default App