import { Route, Routes } from "react-router-dom"
import DashboardLayout from "./Layout/DashboardLayout"
import Main from "./Layout/Main"
import Parcelas from "./components/Parcelas"

function App() {

  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Main />} />
          <Route path="parcelas" element={<Parcelas />} />
        </Route>
      </Routes>
    </>
  )
}

export default App