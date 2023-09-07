import React, { useEffect } from 'react';
import disappointed from '../assets/uarrr-disappointed.gif';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

export default function Logen() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = 'white';

    // Set the timed redirect
    const timer = setTimeout(() => {
      navigate('/login');
    }, 8000);

    return () => {
      document.body.style.backgroundColor = '';
      clearTimeout(timer);
    };
  }, [navigate]);

    return (
        <div className="full-width-container" style={{ backgroundColor: 'white' }}>
        <div className="row vh-100">
            <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                <div className="spacer d-block d-md-none"></div>
                <h1 className="display-1" style={{ fontSize: '6rem' }}>Go Log in.</h1>
                <p className="lead mb-4 pinklink">Please don't tell me you still need to <Link to="/signup">make an account</Link>.</p>
                <Link to="/login" className="btn btn-lg custom-button">Alright, I'll Login.</Link>
            </div>
            <div className="col-md-6 d-flex align-items-end">
                <img src={disappointed} alt="Confused John Travolta" className="img-fluid" />
            </div>
        </div>
        </div>
  );
}
