const UserDetails = ({ user }) => {
  if (!user) return null;

  return (
    <>
      {user.avatar && (
        <img className="avatar" src={user.avatar} alt={user.user_name} />
      )}
      <h3>{user.user_name}</h3>
      <p>Email: {user.email}</p>
      <p>Status: {user.is_active ? "Active" : "Inactive"}</p>
    </>
  );
};

export default UserDetails;
