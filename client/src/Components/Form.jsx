import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  addBook,
  addReview,
  editReview,
} from "../../service/auth";

import AuthForm from "./User/Auth/AuthForm";
import "../styles/form.css";
import BookForm from "./Book/BookForm";
import ReviewForm from "./Book/Review/ReviewForm";

const Form = ({
  mode = "login",
  onSubmit,
  isEditing = false,
  initialData = null,
}) => {
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isAddBook = mode === "add-book";
  const isAddReview = mode === "add-review";

  const [formData, setFormData] = useState(
    initialData && isAddReview
      ? { ...initialData }
      : isAddBook
      ? {
          isbn: "",
          book_image: "",
          title: "",
          author: "",
          publisher: "",
          published_at: "",
          price: "",
        }
      : isAddReview
      ? { rating: 0, comment: "" }
      : { identifier: "", username: "", email: "", password: "" }
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
      const requiredFields = [
        "isbn",
        "title",
        "author",
        "publisher",
        "published_at",
        "price",
      ];
      requiredFields.forEach((key) => {
        if (!formData[key]) missingFields.push(key.replace(/_/g, " "));
      });
      if (formData.price && parseFloat(formData.price) < 1) {
        missingFields.push("invalid price!");
      }
    } else if (isLogin) {
      if (!formData.identifier) missingFields.push("username or email");
      if (!formData.password) missingFields.push("password");
    } else if (isRegister) {
      if (!formData.username) missingFields.push("username");
      if (!formData.email) missingFields.push("email");
      if (!formData.password) missingFields.push("password");
    } else if (isAddReview) {
      if (
        formData.rating === null ||
        !(0 <= formData.rating && formData.rating <= 5)
      ) {
        missingFields.push("valid rating (0–5)");
      }
      if (!formData.comment || formData.comment.trim().length < 10) {
        missingFields.push("valid comment (min 10 characters)");
      }
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
        localStorage.setItem("is_admin", result.profile.is_admin);
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
      } else if (isAddReview) {
        const slug = localStorage.getItem("review_slug");

        let result;
        if (isEditing && initialData?.review_id) {
          result = await editReview(slug, initialData.review_id, formData);
          setSuccessMessage(result.message || "Review updated successfully");
        } else {
          result = await addReview(slug, formData);
          setSuccessMessage(result.message || "Review submitted successfully");
        }

        setFormData({ rating: 0, comment: "" });
        onSubmit?.(result);
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {isAddBook ? (
        <BookForm
          formData={formData}
          handleChange={handleChange}
          onSubmit={handleSubmit}
        />
      ) : isAddReview ? (
        <ReviewForm
          formData={formData}
          handleChange={handleChange}
          isEditing={isEditing}
          onSubmit={handleSubmit}
        />
      ) : (
        <AuthForm
          isLogin={isLogin}
          formData={formData}
          handleChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Form;
