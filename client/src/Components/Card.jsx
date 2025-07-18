import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../service/auth";
import "../styles/card.css";
import BookDetails from "./Book/BookDetails";
import UserDetails from "./User/Profile/UserDetails";

const Card = ({ type, data }) => {
  const [userData, setUserData] = useState(data || null);
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (type === "book" && data?.slug) {
      navigate(`/book/${data.slug}`);
    }
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      style={{ cursor: type === "book" ? "pointer" : "default" }}
    >
      {type === "user" && <UserDetails user={userData} />}
      {type === "book" && (
        <BookDetails book={data} hasPurchased={data.hasPurchased} />
      )}
    </div>
  );
};

export default Card;
