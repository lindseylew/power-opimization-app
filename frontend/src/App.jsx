import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import OptimizationForm from "./pages/OptimizationForm";
import OptimizationResults from "./pages/OptimizationResults";
import ProtectedRoute from "./components/ProtectedRoute";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  const [results, setResults] = useState(null);

  const handleSubmit = (data) => {
    console.log("Form submitted with data", data);
    setResults(data);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="energy-asset/create/"
          element={
        <ProtectedRoute>
          <OptimizationForm onSubmit={handleSubmit}/>
          {results && <OptimizationResults results={results} />}
        </ProtectedRoute>
          }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App