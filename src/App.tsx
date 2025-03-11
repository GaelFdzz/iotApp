import { Route, Routes } from "react-router-dom"
import DashboardLayout from "./Layout/DashboardLayout"

function App() {

  return (
    <>
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />} />
    </Routes>
    </>
  )
}

export default App