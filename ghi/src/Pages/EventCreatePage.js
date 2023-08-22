import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function EventCreateForm() {

            const [name, setName] = useState('');
            const [date, setDate] = useState('')
            const [time, setTime] = useState('');
            const [cost, setCost] = useState('');
            const [location, setLocation] = useState('');
            const [description, setDescription] = useState('');
            const [organizer, setOrganizer] = useState('');
            const navigate = useNavigate();


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

                const eventsUrl = 'http://localhost:8000/events';
		        const fetchConfig = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
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
                };
            };



    return(

        <div className="row">
			<div className="offset-3 col-6">
				<div className="shadow p-4 mt-4">
					<h1>Create an Event</h1>
					<form onSubmit={handleSubmit} id="create-customer-form">
						<div className="form-floating mb-3">
							<input value={name} onChange={handleNameChange} placeholder="Name" required type="text" name="name" id="name" className="form-control" />
							<label htmlFor="name">Name dawg</label>
						</div>
						<div className="form-floating mb-3">
							<input value={date} onChange={handleDateChange} placeholder="Date" required type="date" id="date" name="date" className="form-control" />
							<label htmlFor="date">Date</label>
						</div>
						<div className="form-floating mb-3">
							<input value={time} onChange={handleTimeChange} placeholder="Time" required type="time" id="time" name="time" className="form-control" />
							<label htmlFor="time">Time</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={cost} onChange={handleCostChange} placeholder="DatCost" required type="cost" id="cost" name="cost" className="form-control" />
							<label htmlFor="cost">cost schmost</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={location} onChange={handleLocationChange} placeholder="Location" required type="location" id="location" name="location" className="form-control" />
							<label htmlFor="location">Location</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={description} onChange={handleDescriptionChange} placeholder="Description" required type="description" id="description" name="description" className="form-control" />
							<label htmlFor="description">descript</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={organizer} onChange={handleOrganizerChange} placeholder="Organizer" required type="organizer" id="organizer" name="organizer" className="form-control" />
							<label htmlFor="organizer">Organizer</label>
						</div>
						<button className="btn btn-primary" >Behold, Genesis!</button>
					</form>
				</div>
			</div>
		</div>
	)
};
