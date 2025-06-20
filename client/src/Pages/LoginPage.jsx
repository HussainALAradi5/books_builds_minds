import Form from "../Components/Form";
const LoginPage = () => {
  const handleLogin = (data) => {

    console.log("Login request:", data);
     // You can add your login API call or logic here
  };

  return (
    <div>
      <Form mode="login" onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;