import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"
import { useNavigate, useParams } from 'react-router-dom';

export default function EventEditor(id){

    id = useParams();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [cost, setCost] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState('');
    const { token } = useAuthContext();
    const [eventDetailData, setEventDetail] = useState([]);
    const navigate = useNavigate()


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
        let data = {
        id: parseInt(id.event_id),
        name: name,
        date: date,
        time: time,
        cost: cost,
        location: location,
        description: description,
        organizer: organizer,
        }
        let newdata = {}
        for (let [key, value] of Object.entries(data)){
            if (value){
                newdata[key]=value };
            };
        const eventsPutUrl = `${process.env.REACT_APP_API_HOST}/events/${id.event_id}`;
        const fetchConfig = {
            method: 'PUT',
            body: JSON.stringify(newdata),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,},
            };
        const response = await fetch(eventsPutUrl, fetchConfig);
        if (response.ok) {
        console.log("response ok:")
        window.location.href = `${process.env.PUBLIC_URL}/events`
        }}

    const getDatEventDetailData1 = useCallback(async function getDatEventDetailData() {
        if (token){
            let dataUrl = `${process.env.REACT_APP_API_HOST}/events/${id.event_id}`;
            let fetchConfig = {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,},
             };
            let fetchedFromUrl = await fetch(dataUrl, fetchConfig)
            if(fetchedFromUrl.ok) {
                let jsonifiedFetchedStuff = await fetchedFromUrl.json()
                setEventDetail(jsonifiedFetchedStuff)
            }
            else {
                console.log ("fetch didn't work")
            }}
            },   [token, id]);

    useEffect(() => {
                getDatEventDetailData1()
            },
            [token, getDatEventDetailData1]);


    return(
        <div>
        <div className="row">
			<div className="offset-3 col-6">
                <button onClick={()=>{navigate(`/events`)}}>Cancel</button>
				<div className="shadow p-4 mt-4">
					<h1>Edit Event</h1>
					<form onSubmit={handleSubmit} id="create-customer-form">
						<div className="form-floating mb-3">
							<input value={name} onChange={handleNameChange} placeholder="Name" type="text" name="name" id="name" className="form-control" />
							<label htmlFor="name">name:  {eventDetailData.name}</label>
						</div>
						<div className="form-floating mb-3">
							<input value={date} onChange={handleDateChange} placeholder="Date" type="date" id="date" name="date" className="form-control" />
							<label htmlFor="date">date:  {eventDetailData.date}</label>
						</div>
						<div className="form-floating mb-3">
							<input value={time} onChange={handleTimeChange} placeholder="Time" type="time" id="time" name="time" className="form-control" />
							<label htmlFor="time">time:  {eventDetailData.time}</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={cost} onChange={handleCostChange} placeholder="DatCost" type="cost" id="cost" name="cost" className="form-control" />
							<label htmlFor="cost">cost:  {eventDetailData.cost}</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={location} onChange={handleLocationChange} placeholder="Location" type="location" id="location" name="location" className="form-control" />
							<label htmlFor="location">location:  {eventDetailData.location}</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={description} onChange={handleDescriptionChange} placeholder="Description" type="description" id="description" name="description" className="form-control" />
							<label htmlFor="description">description:  {eventDetailData.description}</label>
						</div>
                        <div className="form-floating mb-3">
							<input value={organizer} onChange={handleOrganizerChange} placeholder="Organizer" type="organizer" id="organizer" name="organizer" className="form-control" />
							<label htmlFor="organizer">organizer:  {eventDetailData.organizer}</label>
						</div>
						<button className="btn btn-primary" >Behold, Genesis!</button>
					</form>
				</div>
			</div>
		</div>
        </div>
    )
}
