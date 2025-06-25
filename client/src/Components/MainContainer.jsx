import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import Header from "./Header";
import Footer from "./Footer";
import ProfilePage from "../Pages/ProfilePage";

const MainContainer = () => {
  return (
    <Router>
      <div className="mainContainer">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default MainContainer;
