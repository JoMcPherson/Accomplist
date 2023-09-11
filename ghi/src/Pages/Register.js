import React, { useState, useEffect, useMemo } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [date_created] = useState(getTodayDate());
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const { register } = useToken();
  const navigate = useNavigate();

// custom background
  const mainBg = useMemo(() => ({
    backgroundImage: 'url("https://i.imgur.com/4ECpu8i.jpg")',
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
  //end background

  const handleRegistration = (e) => {
    e.preventDefault();
    const accountData = {
      username: username,
      password: password,
      first_name: first,
      last_name: last,
      date_created: date_created,
      photo: photo,
      bio: bio,
      email: email,
    };
    register(accountData, `${process.env.REACT_APP_API_HOST}/api/accounts`);
    e.target.reset();
    navigate("/accomplist_items");
  };

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return `${year}-${month}-${day}`;
  }

  return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={(e) => handleRegistration(e)}>
          <div className="Auth-form-content">
            <h1 className="Auth-form-title">Create an account:</h1>
              <div className="form-group mt-2">
                <label className="label">Username:</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div className="form-group mt-2">
                <label className="label">Password:</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            <div className="form-group mt-2">
              <label className="label">First Name:</label>
              <input
                name="first"
                type="text"
                className="form-control"
                placeholder="First Name"
                onChange={(e) => {
                  setFirst(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-2">
              <label className="label">Last Name:</label>
              <input
                name="last"
                type="text"
                className="form-control"
                placeholder="Last Name"
                onChange={(e) => {
                  setLast(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-2">
              <label className="label">Email:</label>
              <input
                name="email"
                type="text"
                className="form-control"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-2">
              <label className="label">Photo:</label>
              <input
                name="photo"
                type="text"
                className="form-control"
                placeholder="Photo URL"
                onChange={(e) => {
                  setPhoto(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-2">
              <label className="label">Bio:</label>
              <input
                name="bio"
                type="text"
                className="form-control"
                placeholder="Tell us about yourself!"
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              />
            </div>
            <div className="d-grid gap-2 mt-5">
              <input className="btn btn-outline-dark" type="submit" value="Signup" />
            </div>
          </div>
        </form>
      </div>
  );
};

export default SignUp;
