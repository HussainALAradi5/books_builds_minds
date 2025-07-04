import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../service/auth";
import AdminPanel from "../Components/AdminPanel";
import "../styles/admin.css";

const AdminPanelPage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/"); 
      return;
    }

    fetchUserProfile(userId, token)
      .then((data) => {
        if (!data.is_admin) {
          navigate("/");
        } else {
          setUserData(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err.message);
        navigate("/");
      });
  }, [navigate]);

  if (!userData) return <p>Checking admin access...</p>;

  return (
    <div>
      <AdminPanel />
    </div>
  );
};

export default AdminPanelPage;
