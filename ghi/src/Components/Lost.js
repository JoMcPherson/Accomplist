import React, { useEffect } from 'react';
import confusedTravolta from '../assets/confused-john-travolta.gif';
import { Link } from 'react-router-dom';
import '../index.css';

export default function Lost() {

  useEffect(() => {
    document.body.style.backgroundColor = 'white';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

    return (
        <div className="container" style={{ backgroundColor: 'white' }}>
        <div className="row vh-100">
            <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                <div className="spacer d-block d-md-none"></div>
                <h1 className="display-1" style={{ fontSize: '6rem' }}>You're lost.</h1>
                <p className="lead mb-4">So much so that now Travolta is lost. Nice one.</p>
                <Link to="/accomplist_items" className="btn btn-lg custom-button">Just Go Home</Link>
            </div>
            <div className="col-md-6 d-flex align-items-end">
                <img src={confusedTravolta} alt="Confused John Travolta" className="img-fluid" />
            </div>
        </div>
        </div>
  );
}
