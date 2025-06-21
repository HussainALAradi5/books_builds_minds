import Form from "../Components/Form";

const LoginPage = () => {
  const handleLogin = (userProfile) => {
    console.log("Logged in user:", userProfile);
    localStorage.setItem("user_name", userProfile.user_name);
    localStorage.setItem("email", userProfile.email);
  };

  return (
    <div>
      <Form mode="login" onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;