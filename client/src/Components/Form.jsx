import { useState } from "react";
import "../styles/form.css";
import { registerUser, loginUser } from "../../service/auth";
import { useNavigate } from "react-router-dom";

const Form = ({ mode = "login" }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "", 
    username: "",   
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, username, email, password } = formData;

    try {
      if (isLogin) {
        if (!identifier || !password) {
          alert("Please enter your username/email and password.");
          return;
        }

        const result = await loginUser({
          user_name_or_email: identifier,
          password,
        });

        localStorage.setItem("token", result.token);
        localStorage.setItem("user_id", result.user_id); // if returned from backend
        alert(result.message || "Login successful");
        navigate("/profile");
      } else {
        if (!username || !email || !password) {
          alert("Please fill in all required fields.");
          return;
        }

        const result = await registerUser({
          user_name: username,
          email,
          password,
        });

        alert(result.message || "Registration successful");
        navigate("/login");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

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

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
  );
};

export default Form;