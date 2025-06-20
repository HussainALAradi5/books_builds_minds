import { useState } from "react";
import "../styles/form.css";
const Form = ({ mode = "login" }) => {
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (isLogin) {
      if (!username && !email) {
        alert("Please enter either a username or an email.");
        return;
      }
      if (!password) {
        alert("Password is required.");
        return;
      }
      console.log("Logging in with", username || email, password);
    } else {
      if (!username || !email || !password) {
        alert("Please fill in all required fields.");
        return;
      }
      console.log("Registering with", formData);
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
            name="username"
            value={formData.username}
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