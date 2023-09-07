import React, { useState, useEffect, useMemo } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import LoginForm from './Logon';

export default function EventCreateForm({user, items}) {
    const { token } = useAuthContext();
    const [name, setName] = useState('');
    const [date, setDate] = useState('')
    const [time, setTime] = useState('');
    const [cost, setCost] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const organizerID = `${user.id}`;
    const organizerUsername = `${user.username}`;
    const [goalID, setGoalID] = useState ('');

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

    // const handleOrganizerIDChange = (event) => {
    //     const value = event.target.value;
    //     setOrganizerID(value)
    // }

    // const handleOrganizerNameChange = (event) => {
    //     const value = event.target.value;
    //     setOrganizerUsername(value)
    // }

    const handleGoalIDChange = (event) => {
        const value = event.target.value;
        setGoalID(value)
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
        organizer_id: organizerID,
        organizer_username: organizerUsername,
        goal_id: goalID,
        }
        console.log('data:', data)
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

            window.location.href = `${process.env.PUBLIC_URL}/events`
            };
        };

    if (token) {
    return(
        <div className="Event-Create-form-container">
            <form onSubmit={handleSubmit} >
                {/* <div className="Auth-form-content"> */}
                <h1 className="event-form-title">Create an Event:</h1>
                {/* <div className="form-group mt-3"> */}
                <div className='outerforminputcb1'>
                    <input value={name} onChange={handleNameChange} placeholder="Name" required type="text" name="name" id="name" className="forminputcb1" />
                    <label className="event-label">Event Name:</label>
                </div>
                {/* </div> */}
                <div className="outerforminputcb1">
                    <input value={date} onChange={handleDateChange} placeholder="Date" required type="date" id="date" name="date" className="forminputcb1" />
                    <label htmlFor="date" className="event-label">Date:</label>
                </div>
                <div className="outerforminputcb1">
                    <input value={time} onChange={handleTimeChange} placeholder="Time" required type="time" id="time" name="time" className="forminputcb1" />
                    <label htmlFor="time" className="event-label">Time:</label>
                </div>
                <div className="outerforminputcb1">
                    {/* <input className="btn btn-outline-dark" type="submit" value="submit" /> */}
                    <label htmlFor="eventID" className="event-label">Accomplistment:</label>
                    <select onChange={handleGoalIDChange} id="items" className="forminputcb1" >
                        <option value="" >Choose Accomplist Item From Dropdown Below!</option>
                        {items.map(item =><option value={item.id} key={item.id}>{item.title}</option>)}
                    </select>
                </div>
                <div className="outerforminputcb1">
                    <input value={cost} onChange={handleCostChange} placeholder="Total cost" id="cost" name="cost" className="forminputcb1" />
                    <label htmlFor="cost" className="event-label">Event Cost:</label>
                </div>
                <div className="outerforminputcb1">
                    <input value={location} onChange={handleLocationChange} placeholder="Location" id="location" name="location" className="forminputcb1" />
                    <label htmlFor="location" className="event-label">Location:</label>
                </div>
                <div className="outerforminputcb1">
                    <input value={description} onChange={handleDescriptionChange} placeholder="Description" id="description" name="description" className="forminputcb1" />
                    <label htmlFor="description" className="event-label">Description:</label>
                </div>
                {/* <div className="outerforminputcb1">
                    <input value={organizerID} onChange={handleOrganizerIDChange} placeholder={user.id} id="organizerID" name="organizerID" className="forminputcb1" />
                    <label htmlFor="organizerID" className="event-label">Organizer ID:</label>
                </div> */}

                {/* </div> */}
                <button disabled={items.length === 0} type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
    }
    else {
        return <LoginForm />;
    }
}
