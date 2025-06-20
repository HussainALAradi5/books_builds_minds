import "../styles/header.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header-container">
      <Button text="Homepage" onClick={() => navigate("/")} />
      <Button text="Profile" onClick={() => navigate("/profile")} />
      <Button text="Login" onClick={() => navigate("/login")} />
      <Button text="Register" onClick={() => navigate("/register")} />
    </div>
  );
};

export default Header;