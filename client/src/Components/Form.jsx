import { useState } from "react";
import "../styles/form.css";
import Button from "./Button";
import { registerUser, loginUser } from "../../service/auth";
import { useNavigate } from "react-router-dom";

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
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
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
        setTimeout(() => navigate("/profile"), 1000);
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
        <h2>{isLogin ? "Login" : "Register"}</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {!isLogin && (
          <>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </>
        )}

        {isLogin && (
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Username or Email"
            required
          />
        )}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <Button text={isLogin ? "Login" : "Register"} className="form-button" />
      </form>
    </div>
  );
};

export default Form;
