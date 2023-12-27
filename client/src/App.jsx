import { Route, Routes, useNavigate } from "react-router-dom"
import Login from "./components/Form/Login"
import Signup from "./components/Form/Signup"
import Home from "./components/Home"
import ActivateUser from "./components/Form/ActivateUser"
import { useEffect } from "react"


const App = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/")
    }
  }, [])
  return (
    <div className="text-red-700">
      {/* <Login/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<Signup />} />
        <Route path="activate-user" element={<ActivateUser />} />
      </Routes>
    </div>
  )
}

export default App