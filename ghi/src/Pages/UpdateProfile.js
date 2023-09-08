import { useAuthContext } from '@galvanize-inc/jwtdown-for-react';
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile({ user }) {
  const params = useParams();
  const userId = params.user_id || user?.id;  // Use passed user id as a fallback
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    bio: '',
    photo: '',
  });

  // Background configuration
  const mainBg = useMemo(() => ({
    backgroundImage: 'url("https://images.pexels.com/photos/4553164/pexels-photo-4553164.jpeg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  }), []);

  // Fetching user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const profileUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${userId}`;
          const response = await fetch(profileUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const userData = await response.json();

          // Set fetched user data to formData
          setFormData({
            bio: userData.bio || '',
            photo: userData.photo || '',
          });

        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token, userId]);

  // Setting background styling
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token) {
      try {
        const updateProfileUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${userId}`;
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
        navigate('/profile');

        setFormData((prevData) => ({
          ...prevData,
          bio: updatedUserData.bio,
          photo: updatedUserData.photo
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
            <h5 className="Auth-form-title">Update Profile</h5>
            <div className="form-group">
            <label className="label">Update profile photo:</label>
            <input
              className="form-control"
              type="text"
              name="photo"
              placeholder="update photo URL"
              value={formData.photo}
              onChange={handleChange}
            /></div>
            <div className="form-group mt-1">
            <label className="label">Tell us about yourself:</label>
            <textarea
              className="form-control"
              name="bio"
              placeholder="update bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
            </div>
            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-outline-dark">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <h1>You must be logged in to Update your profile.</h1>
    );
  }
}
