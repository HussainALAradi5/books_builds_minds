import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../service/auth"; // adjust path if needed
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
      {type === "user" && userData && (
        <>
          {userData.avatar && (
            <img className="avatar" src={userData.avatar} alt={userData.user_name} />
          )}
          <h3>{userData.user_name}</h3>
          <p>Email: {userData.email}</p>
          <p>Status: {userData.is_active ? "Active" : "Inactive"}</p>
        </>
      )}

      {type === "book" && (
        <>
          <h3>{data.title}</h3>
          {data.image && (
            <img className="cover" src={data.image} alt={data.title} />
          )}
          <p>Author: {data.author}</p>
          <p>Publisher: {data.publisher}</p>
        </>
      )}
    </div>
  );
};

export default Card;