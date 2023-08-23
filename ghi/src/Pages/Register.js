import { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";


const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [date_created, setDate] = useState("");
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
    console.log(accountData)
    register(
      accountData,
      `${process.env.REACT_APP_API_HOST}/api/accounts`
    );
    e.target.reset();
    navigate("/");
  };

  return (
    <div className="card text-bg-light mb-3">
      <h5 className="card-header">Signup</h5>
      <div className="card-body">
        <form onSubmit={(e) => handleRegistration(e)}>
          <div className="mb-3">
            <label className="form-label">username</label>
            <input
              name="username"
              type="text"
              className="form-control"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">first</label>
            <input
              name="first"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFirst(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">last</label>
            <input
              name="last"
              type="text"
              className="form-control"
              onChange={(e) => {
                setLast(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">email</label>
            <input
              name="email"
              type="text"
              className="form-control"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">photo</label>
            <input
              name="photo"
              type="text"
              className="form-control"
              onChange={(e) => {
                setPhoto(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">bio</label>
            <input
              name="bio"
              type="text"
              className="form-control"
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">date</label>
            <input
              name="date"
              type="text"
              className="form-control"
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
          <div>
            <input className="btn btn-primary" type="submit" value="Register" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
