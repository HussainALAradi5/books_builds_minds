import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../service/auth";
import { addBook } from "../../service/auth";
import AuthForm from "./AuthForm";
import BookForm from "./BookForm";
import Button from "./Button";
import "../styles/form.css";

const Form = ({ mode = "login", onSubmit }) => {
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isAddBook = mode === "add-book";
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    isAddBook
      ? {
          isbn: "",
          book_image: "",
          title: "",
          author: "",
          publisher: "",
          published_at: "",
          price: "",
        }
      : {
          identifier: "",
          username: "",
          email: "",
          password: "",
        }
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];

    if (isAddBook) {
      const required = [
        "isbn",
        "title",
        "author",
        "publisher",
        "published_at",
        "price",
      ];
      required.forEach((key) => {
        if (!formData[key]) missingFields.push(key.replace(/_/g, " "));
      });
    } else if (isLogin) {
      if (!formData.identifier) missingFields.push("username or email");
      if (!formData.password) missingFields.push("password");
    } else if (isRegister) {
      if (!formData.username) missingFields.push("username");
      if (!formData.email) missingFields.push("email");
      if (!formData.password) missingFields.push("password");
    }

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    try {
      if (isLogin) {
        const result = await loginUser({
          user_name_or_email: formData.identifier,
          password: formData.password,
        });
        localStorage.setItem("token", result.token);
        localStorage.setItem("user_id", result.user_id);
        onSubmit?.(result.profile);
        setSuccessMessage(result.message || "Login successful");

        setTimeout(() => {
          navigate("/profile");
          window.location.reload();
        }, 1000);
      } else if (isRegister) {
        const result = await registerUser({
          user_name: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setSuccessMessage(result.message || "Registration successful");
        setTimeout(() => navigate("/login"), 1000);
      } else if (isAddBook) {
        const user_id = localStorage.getItem("user_id");
        const result = await addBook({
          ...formData,
          added_by_user_id: user_id,
        });
        setSuccessMessage(result.message || "Book added successfully");
        setFormData({
          isbn: "",
          book_image: "",
          title: "",
          author: "",
          publisher: "",
          published_at: "",
          price: "",
        });
        onSubmit?.(result);
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        {isAddBook ? (
          <BookForm formData={formData} handleChange={handleChange} />
        ) : (
          <AuthForm
            isLogin={isLogin}
            formData={formData}
            handleChange={handleChange}
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <Button
          text={isLogin ? "Login" : isRegister ? "Register" : "Add Book"}
          className="form-button"
        />
      </form>
    </div>
  );
};

export default Form;
