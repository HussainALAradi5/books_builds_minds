import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import ProfilePage from "../Pages/ProfilePage";
import AdminPanelPage from "../Pages/AdminPanelPage";
import BookPage from "../Pages/BookPage";
import ReviewPage from "../Pages/ReviewPage";
import Header from "./Header";
import Footer from "./Footer";

const MainContainer = () => {
  return (
    <Router>
      <div className="mainContainer">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/book/:slug" element={<BookPage />} />
            <Route path="/book/:slug/reviews" element={<ReviewPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default MainContainer;
