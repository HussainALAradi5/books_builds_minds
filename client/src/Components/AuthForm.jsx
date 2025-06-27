const AuthForm = ({ isLogin, formData, handleChange }) => {
  return (
    <>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      {!isLogin && (
        <>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </>
      )}

      {isLogin && (
        <input
          type="text"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          placeholder="Username or Email"
        />
      )}

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
    </>
  );
};
export default AuthForm;
