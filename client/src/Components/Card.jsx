import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../service/auth"; // adjust path if needed
import "../styles/card.css";

const Card = ({ type, data }) => {
  const [userData, setUserData] = useState(data || null);
   const fakeBook = {
    title: "The Lost Code",
    author: "A. I. Narrator",
    publisher: "Copilot Press",
    image: "https://covers.openlibrary.org/b/id/10523399-L.jpg",
  };

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
          <h3>{(data || fakeBook).title}</h3>
          {(data || fakeBook).image && (
            <img className="cover" src={(data || fakeBook).image} alt={(data || fakeBook).title} />
          )}
          <p>Author: {(data || fakeBook).author}</p>
          <p>Publisher: {(data || fakeBook).publisher}</p>
        </>
      )}

    </div>
  );
};

export default Card;