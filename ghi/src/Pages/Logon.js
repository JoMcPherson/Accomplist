import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useToken();
  const navigate = useNavigate();

// custom background
  const mainBg = useMemo(() => ({
    backgroundImage: 'url("https://images.pexels.com/photos/1536437/pexels-photo-1536437.jpeg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    }),
  []);

  useEffect(() => {
    Object.keys(mainBg).forEach((styleProp) => {
      document.body.style[styleProp] = mainBg[styleProp];
  });

  return () => {
    Object.keys(mainBg).forEach((styleProp) => {
      document.body.style[styleProp] = '';
      });
    };
  }, [mainBg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(username, password);
      console.log("Login result:", result);

      if (localStorage.getItem('token')) {
        console.log("howdy")
        setError(null)
        e.target.reset();
        navigate("/accomplist_items");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err); // Log the error for clarity
      // Adjust this based on the actual error messages you've encountered
      if (err.message.includes("Account not found")) {
        setError("Account not found! Please check your credentials or sign up.");
      } else if (err.message.includes("Failed to get token after login")) {
        setError("Failed to authenticate. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="Auth-form-container">
    <form className="Auth-form" onSubmit={(e) => handleSubmit(e)}>
      <div className="Auth-form-content">
          <h1 className="Auth-form-title">Login</h1>
          <div className="form-group mt-3">
            <label className="label">Username:</label>
            <input
              name="username"
              type="text"
              placeholder="username"
              className="form-control"
              required
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label className="label">Password:</label>
            <input
              name="password"
              type="password"
              placeholder="password"
              className="form-control"
              required
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="auth-options mt-1">
            <div className="remember-me">
                <input type="checkbox" className="checkbox" />
                <span className="check-label">Remember Me</span>
            </div>
            <span className="forgot pinklink">
              Forgot <Link to="/whoops">Password</Link>?
            </span>
          </div>
          <div className="d-grid gap-2 mt-4">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input className="btn btn-outline-dark" type="submit" value="Login" />
          </div>
          <h6 className="text-center mt-4 pinklink">
          Don't have an account? <Link to="/signup">Sign up here.</ Link>
          </h6>
      </div>
      </form>
    </div>
  );
};

export default LoginForm;
