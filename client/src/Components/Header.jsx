import "../styles/header.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      setIsLoggedIn(!!token && !!userId);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="header-container">
      <Button text="Homepage" onClick={() => navigate("/")} />
      {isLoggedIn ? (
        <>
          <Button text="Profile" onClick={() => navigate("/profile")} />
          <Button text="Logout" onClick={handleLogout} />
        </>
      ) : (
        <>
          <Button text="Login" onClick={() => navigate("/login")} />
          <Button text="Register" onClick={() => navigate("/register")} />
        </>
      )}
    </div>
  );
};

export default Header;