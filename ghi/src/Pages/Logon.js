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
      const result = await login(username, password); // Try logging in
      console.log("Login result:", result);

      // Check for token in localStorage as an indicator of successful login
      if (localStorage.getItem('token')) {
        e.target.reset();
        navigate("/accomplist_items");  // Navigate only if login is successful
      } else {
        // Handle unsuccessful login (e.g., wrong credentials)
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
          <h6 className="text-center mt-2">
            Need to <Link to="/signup"> Create An Account</ Link> ?
          </h6>
          <div className="form-group mt-3">
            <label className="label">Username:</label>
            <input
              name="username"
              type="text"
              placeholder="username"
              className="form-control mt-1"
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
              className="form-control mt-1"
              required
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-4">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input className="btn btn-outline-dark" type="submit" value="Login" />
          </div>
          <p className="text-center mt-2">
            Forgot <Link to="/whoops">Password</Link> ?
          </p>
      </div>
      </form>
    </div>
  );
};

export default LoginForm;
