import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../../../service/auth";

const ProfileDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (user_id && token) {
      fetchUserProfile(user_id, token)
        .then(setUser)
        .catch((err) => console.error("Failed to load profile:", err));
    }
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Welcome, {user.user_name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default ProfileDetails;
