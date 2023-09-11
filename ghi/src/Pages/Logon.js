import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useToken();
  const navigate = useNavigate();

  // custom background
  const mainBg = useMemo(
    () => ({
      backgroundImage:
        'url("https://images.pexels.com/photos/1536437/pexels-photo-1536437.jpeg")',
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
    }),
    []
  );

  useEffect(() => {
      Object.keys(mainBg).forEach((styleProp) => {
        document.body.style[styleProp] = mainBg[styleProp];
      });

      if (localStorage.getItem('rememberMe') === 'true') {
          const rememberedUsername = localStorage.getItem('username');
          setUsername(rememberedUsername || '');
          setRememberMe(true);
      }

      return () => {
        Object.keys(mainBg).forEach((styleProp) => {
          document.body.style[styleProp] = '';
        });
      };
  }, [mainBg]);

  const handleSubmit = (e) => {
      e.preventDefault();

      if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('username', username);
      } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('username');
      }

      login(username, password);
      e.target.reset();
      navigate("/accomplist_items");
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
                <input
                type="checkbox"
                className="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="check-label">Remember Me</span>
            </div>
            <span className="forgot pinklink">
              Forgot <Link to="/whoops">Password</Link>?
            </span>
          </div>
          <div className="d-grid gap-2 mt-4">
            <input
              className="btn btn-outline-dark"
              type="submit"
              value="Login"
            />
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
