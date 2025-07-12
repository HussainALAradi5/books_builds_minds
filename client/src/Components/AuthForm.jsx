const AuthForm = ({ isLogin, formData, handleChange, onSubmit }) => {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
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

      <div className="form-actions">
        <button type="submit" className="form-button">
          {isLogin ? "Login" : "Register"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
