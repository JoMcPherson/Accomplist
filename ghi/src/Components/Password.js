import React, { useEffect } from 'react';
import rickroll from '../assets/rickroll.gif';
import '../index.css';

export default function ForgotPassword() {

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
                <h1 className="display-1" style={{ fontSize: '6rem' }}>That Sucks.</h1>
                <p className="lead mb-4">Maybe write it down somewhere, unless you forgot that too.</p>
                <a href="https://www.wikihow.com/Remember-a-Forgotten-Password" className="btn btn-lg custom-button" target="_blank" rel="noopener noreferrer">Do better</a>
            </div>
            <div className="col-md-6 d-flex align-items-end">
                <img src={rickroll} alt="Confused John Travolta" className="img-fluid" />
            </div>
        </div>
        </div>
  );
}
