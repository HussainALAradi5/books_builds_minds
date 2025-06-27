import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../service/auth";
import "../styles/card.css";

const Card = ({ type, data }) => {
  const [userData, setUserData] = useState(data || null);

  const book = data;
  const bookImage = book.image || book.book_image;

  useEffect(() => {
    if (type === "user" && !data) {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (userId && token) {
        fetchUserProfile(userId, token)
          .then(setUserData)
          .catch((err) => console.error("Failed to fetch user profile:", err));
      }
    }
  }, [type, data]);

  return (
    <div className="card">
      {type === "user" && userData && (
        <>
          {userData.avatar && (
            <img
              className="avatar"
              src={userData.avatar}
              alt={userData.user_name}
            />
          )}
          <h3>{userData.user_name}</h3>
          <p>Email: {userData.email}</p>
          <p>Status: {userData.is_active ? "Active" : "Inactive"}</p>
        </>
      )}

      {type === "book" && (
        <>
          <h3>{book.title}</h3>
          {bookImage && (
            <img className="cover" src={bookImage} alt={book.title} />
          )}
          <p>Author: {book.author}</p>
          <p>Publisher: {book.publisher}</p>
          <p>Price: {book.price} BD</p>
        </>
      )}
    </div>
  );
};

export default Card;
