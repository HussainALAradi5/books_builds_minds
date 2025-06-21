import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../service/auth";
import Card from "../Components/Card";
import "../styles/profile.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (userId && token) {
      fetchUserProfile(userId, token)
        .then(setUserData)
        .catch((err) => {
          console.error("Failed to fetch user details:", err.message);
        });
    }
  }, []);

  if (!userData) return <p>Loading user profile...</p>;

  return (
    <div className="profile-page">
      <Card type="user" data={userData} />
    </div>
  );
};

export default ProfilePage;