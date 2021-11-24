import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("qrcode");
  };

  return (
    <div className="register">
      <h1>Register Page</h1>
      <div>
        <label htmlFor="username">Name</label>
        <input type="text" id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
      </div>
      <button type="submit" id="registerButton" onClick={handleClick}>
        Register
      </button>
    </div>
  );
};

export default Register;
