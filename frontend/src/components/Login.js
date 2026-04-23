import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // simple validation
    if (email && password) {
      // fake auth (real me API call karna)
      localStorage.setItem("user", email);
      navigate("/dashboard");
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p> 
       <div className="container">
      <h2>Login</h2>
    </div>
    </div>
  );
}

export default Login;