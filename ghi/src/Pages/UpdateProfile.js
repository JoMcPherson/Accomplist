import useToken from "@galvanize-inc/jwtdown-for-react";
import { useParams } from "react-router-dom";
import React, { useState } from "react";

export default function UpdateProfile() {
  const params = useParams();
  const {token, fetchWithToken} = useToken();
  const [formData, setFormData] = useState({
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (token) {
    e.preventDefault();
    try {
        const updateProfileUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${params.user_id}`;
        console.log(updateProfileUrl)
        const response = await fetchWithToken(updateProfileUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Updated account:', data);

    } catch (error) {
      console.error('Error updating account:', error);
    }
  } else {
    console.log("fetch failed");
    } };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
            <div className="Auth-form-content">
            <h5 className="Auth-form-title">Update Account</h5>
            <input
            className="form-control mt-1"
            type="text"
            name="bio"
            placeholder="update bio"
            value={formData.bio}
            onChange={handleChange} />
            <div className="d-grid gap-2 mt-3">
                <input className="btn btn-info" type="submit" value="Update" />
            </div>
        </div>
      </form>
    </div>
  );
}


// <input
// type="photo"
// name="photo"
// placeholder="photo"
// value={formData.photo}
// onChange={handleChange}
// />

// username: '',
// first_name: '',
// last_name: '',
// email: '',
// date_created: '',
// photo: '',
