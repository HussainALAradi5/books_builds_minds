import "../styles/header.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const adminFlag = localStorage.getItem("is_admin") === "true";
      setIsLoggedIn(!!token && !!userId);
      setIsAdmin(adminFlag);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <div className="header-container">
      <Button
        text="Homepage"
        onClick={() => navigate("/")}
        className="header-button"
      />

      {isLoggedIn ? (
        <>
          <Button
            text="Profile"
            onClick={() => navigate("/profile")}
            className="header-button"
          />
          {isAdmin && (
            <Button
              text="Admin Panel"
              onClick={() => navigate("/admin")}
              className="header-button"
            />
          )}
          <Button
            text="Logout"
            onClick={handleLogout}
            className="header-button"
          />
        </>
      ) : (
        <>
          <Button
            text="Login"
            onClick={() => navigate("/login")}
            className="header-button"
          />
          <Button
            text="Register"
            onClick={() => navigate("/register")}
            className="header-button"
          />
        </>
      )}
    </div>
  );
};

export default Header;
