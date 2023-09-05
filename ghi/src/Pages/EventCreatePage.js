import React, { useState, useEffect, useMemo } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import LoginForm from './Logon';

export default function EventCreateForm() {
    const { token } = useAuthContext();
    const [name, setName] = useState('');
    const [date, setDate] = useState('')
    const [time, setTime] = useState('');
    const [cost, setCost] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState('');

// custom background
  const mainBg = useMemo(() => ({
    backgroundImage: 'url("https://i.imgur.com/afK9tLx.jpg")',
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


    const handleNameChange = (event) => {
        const value = event.target.value;
        setName(value)
    }

    const handleDateChange = (event) => {
        const value = event.target.value;
        setDate(value)
    }

    const handleTimeChange = (event) => {
        const value = event.target.value;
        setTime(value)
    }

    const handleCostChange = (event) => {
        const value = event.target.value;
        setCost(value)
    }

    const handleLocationChange = (event) => {
        const value = event.target.value;
        setLocation(value)
    }

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value)
    }

    const handleOrganizerChange = (event) => {
        const value = event.target.value;
        setOrganizer(value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()


        const data = {
        name: name,
        date: date,
        time: time,
        cost: cost,
        location: location,
        description: description,
        organizer: organizer,
        }
        const eventsUrl = `${process.env.REACT_APP_API_HOST}/events`;
        const fetchConfig = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
        };
        const response = await fetch(eventsUrl, fetchConfig);
        if (response.ok) {
            setName('');
            setDate('');
            setTime('');
            setCost('');
            setLocation('');
            setDescription('');
            setOrganizer('');

            window.location.href = `${process.env.PUBLIC_URL}/events`
            };
        };

    if (token) {
    return(
        <div className="Auth-form-container">
            <form onSubmit={handleSubmit} id="create-customer-form" className="Auth-form">
                <div className="Auth-form-content">
                <h1 className="Auth-form-title">Create an Event:</h1>
                <div className="form-group mt-3">
                    <label htmlFor="name"className="label">Event Name:</label>
                    <input value={name} onChange={handleNameChange} placeholder="Name" required type="text" name="name" id="name" className="form-control mt-1" />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="date" className="label">Date:</label>
                    <input value={date} onChange={handleDateChange} placeholder="Date" required type="date" id="date" name="date" className="form-control mt-1" />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="time" className="label">Time:</label>
                    <input value={time} onChange={handleTimeChange} placeholder="Time" required type="time" id="time" name="time" className="form-control mt-1" />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="cost" className="label">Event cost:</label>
                    <input value={cost} onChange={handleCostChange} placeholder="Total cost" required type="cost" id="cost" name="cost" className="form-control mt-1" />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="location" className="label">Location:</label>
                    <input value={location} onChange={handleLocationChange} placeholder="Location" required type="location" id="location" name="location" className="form-control mt-1" />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="description" className="label">Description:</label>
                    <input value={description} onChange={handleDescriptionChange} placeholder="Description" required type="description" id="description" name="description" className="form-control mt-1" />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="organizer" className="label">Organizer:</label>
                    <input value={organizer} onChange={handleOrganizerChange} placeholder="Organizer" required type="organizer" id="organizer" name="organizer" className="form-control mt-1" />
                </div>
                <div className="d-grid gap-2 mt-4">
                    <input className="btn btn-outline-dark" type="submit" value="submit" />
                </div>
                </div>
            </form>
        </div>
    )
    }
    else {
        return <LoginForm />;
    }
}
