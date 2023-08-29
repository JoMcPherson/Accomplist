import React, { useEffect, useState } from 'react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = getCookie('fastapi_token');

    if (token) {
      fetchUserData(token);
    }
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2){
    const token = parts.pop().split(';').shift();
    console.log('Retrieved token:', token);
    return token;
  }
};

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/getCurrentUser', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div>
      Stuff goes here.
      {currentUser ? (
        <p>Welcome, {currentUser.username}!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
}
