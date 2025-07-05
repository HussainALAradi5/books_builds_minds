import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../service/auth";
import UserDetails from "./UserDetails";
import BookDetails from "./BookDetails";
import "../styles/card.css";

const Card = ({ type, data }) => {
  const [userData, setUserData] = useState(data || null);

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
      {type === "user" && <UserDetails user={userData} />}
      {type === "book" && <BookDetails book={data} />}
    </div>
  );
};

export default Card;
