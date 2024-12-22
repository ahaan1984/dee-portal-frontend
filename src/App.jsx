import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Button from "./components/Button";
import Navbar from "./components/Navbar";
import HeaderTop from "./components/Header";
import ImageSlider from "./components/ImageSlider";
import InfoLinks from "./components/InfoLinks";
import CardSection from "./components/CardSection";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import DistrictData from "./components/DistrictData";

function App() {
  return (
    <Router>
      <div>
        <HeaderTop />
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <ImageSlider />
              <h2 className="text-xl font-bold text-center mt-6">Do you want to know more about?</h2>
              <InfoLinks />
              <div className="mt-6 text-center">
                <Button
                  to="/login"
                  label="Login"
                  className="bg-blue-500 text-white"
                />
              </div>
              <h2 className="text-xl font-bold text-center mt-6">Featured Sections</h2>
              <CardSection />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DistrictData />} />
        </Routes>
        {/* <DistrictData /> */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
