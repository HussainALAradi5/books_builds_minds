import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../service/auth";
import AuthForm from "./AuthForm";
import "../styles/form.css";

const Form = ({ mode = "login", onSubmit }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, username, email, password } = formData;

    try {
      if (isLogin) {
        if (!identifier || !password) {
          setErrorMessage("Please enter your username/email and password.");
          return;
        }

        const result = await loginUser({
          user_name_or_email: identifier,
          password,
        });

        localStorage.setItem("token", result.token);
        localStorage.setItem("user_id", result.user_id);
        onSubmit?.(result.profile);
        setSuccessMessage(result.message || "Login successful");

        setTimeout(() => {
          navigate("/profile");
          window.location.reload();
        }, 1000);
      } else {
        if (!username || !email || !password) {
          setErrorMessage("Please fill in all required fields.");
          return;
        }

        const result = await registerUser({
          user_name: username,
          email,
          password,
        });

        setSuccessMessage(result.message || "Registration successful");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthForm
          isLogin={isLogin}
          formData={formData}
          handleChange={handleChange}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </form>
    </div>
  );
};

export default Form;
