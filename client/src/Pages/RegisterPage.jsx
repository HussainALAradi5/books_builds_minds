import Form from "../Components/Form";
const RegisterPage = () => {
  const handleRegister = (data) => {
    console.log("Register request:", data);
    // You can add your registration API call or logic here
  };

  return (
    <div>
      <Form mode="register" onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;