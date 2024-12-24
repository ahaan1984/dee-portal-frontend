import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateEmployee from "./components/CreateEmployee";
import LoginPage from "./components/LoginPage";
import UpdateEmployee from "./components/UpdateEmployees";
import DistrictData from "./components/DistrictData";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DistrictData />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/update-employee/:employee_id" element={<UpdateEmployee />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
