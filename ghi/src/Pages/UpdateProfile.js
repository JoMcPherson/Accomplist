import { useAuthContext } from '@galvanize-inc/jwtdown-for-react';
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";

export default function UpdateProfile({ user }) {
  const params = useParams();
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    bio: '',
  });

  const mainBg = useMemo(() => ({
    backgroundImage: 'url("https://i.imgur.com/BdE1wpj.jpg")',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token) {
      try {
        const updateProfileUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${params.user_id}`;
        console.log(updateProfileUrl);
        console.log('API Call Successful');

        const response = await fetch(updateProfileUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          console.error('HTTP error! Status:', response.status);
          const errorResponse = await response.json();
          console.error('Error Response:', errorResponse);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedUserData = await response.json();
        console.log('Updated User Data:', updatedUserData);

        setFormData((prevData) => ({
          ...prevData,
          bio: updatedUserData.bio
        }));
        console.log('Updated formData:', formData);

        console.log('Updated account:', updatedUserData);
      } catch (error) {
        console.error('API Call Error:', error);
      }
    } else {
      console.log("fetch failed");
    }
  };

  if (token) {
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
            onChange={handleChange}
          />
          <div className="d-grid gap-2 mt-3">
            <input className="btn btn-info" type="submit" value="Update" />
          </div>
        </div>
      </form>
    </div>
  );
  }
    else {
        return (
        <h1>You must be logged in to Update your profile.</h1>
        )
    }
}
