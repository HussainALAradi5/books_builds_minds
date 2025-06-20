import Card from "../Components/Card";

const userData = {
  username: "HussainDev",
  email: "hussain@example.com",
  password: "********",
  status: "Active",
  avatar: "https://i.pravatar.cc/150?u=hussain", 
};

const ProfilePage = () => {
  return (
    <div className="profile-page" style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card type="user" data={userData} />
    </div>
  );
};

export default ProfilePage;