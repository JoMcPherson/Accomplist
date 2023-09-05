import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useToken();
  const navigate = useNavigate();

// custom background
  const mainBg = useMemo(() => ({
    backgroundImage: 'url("https://i.imgur.com/kNQZqfa.jpg)',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
    e.target.reset();
    navigate("/accomplist_items");
  };

  return (
    <div className="Auth-form-container">
    <form className="Auth-form" onSubmit={(e) => handleSubmit(e)}>
      <div className="Auth-form-content">
          <h5 className="Auth-form-title">Login</h5>
          <h6 className="text-center mt-2">
            Need to <a href="/signup">Signup</a>?
          </h6>
          <div className="form-group mt-3">
            <label className="label">Username:</label>
            <input
              name="username"
              type="text"
              placeholder="username"
              className="form-control mt-1"
              required
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-4">
            <input className="btn btn-outline-dark" type="submit" value="Login" />
          </div>
          <p className="text-center mt-2">
            Forgot <a href="/">password?</a>
          </p>
      </div>
      </form>
    </div>
  );
};

export default LoginForm;
