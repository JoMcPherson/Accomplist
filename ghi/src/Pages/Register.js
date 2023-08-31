import { useState } from "react";
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
    console.log(accountData);
    register(accountData, `${process.env.REACT_APP_API_HOST}/api/accounts`);
    e.target.reset();
    navigate("/");
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
          <h5 className="Auth-form-title">Signup</h5>
          <div className="form-group mt-3">
            <label className="form-label">Username:</label>
            <input
              name="username"
              type="text"
              className="form-control mt-1"
              placeholder="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Password:</label>
            <input
              name="password"
              type="password"
              className="form-control mt-1"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">First Name:</label>
            <input
              name="first"
              type="text"
              className="form-control mt-1"
              placeholder="First Name"
              onChange={(e) => {
                setFirst(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Last Name:</label>
            <input
              name="last"
              type="text"
              className="form-control mt-1"
              placeholder="Last Name"
              onChange={(e) => {
                setLast(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Email:</label>
            <input
              name="email"
              type="text"
              className="form-control mt-1"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Photo:</label>
            <input
              name="photo"
              type="text"
              className="form-control mt-1"
              placeholder="Photo URL"
              onChange={(e) => {
                setPhoto(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Bio:</label>
            <input
              name="bio"
              type="text"
              className="form-control mt-1"
              placeholder="Tell us about yourself!"
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <input className="btn btn-info" type="submit" value="SignUp" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
