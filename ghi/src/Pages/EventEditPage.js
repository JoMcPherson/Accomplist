import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function EventEditor({id, items, user}){

    id = useParams();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [cost, setCost] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const { token } = useAuthContext();
    const [eventDetailData, setEventDetail] = useState([]);
    const navigate = useNavigate()
    const [goalID, setGoalID] = useState ('');

    const customBackgroundStyle = {
        backgroundImage: `url(https://i.imgur.com/WFCPRp8.jpeg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        minHeight: '100vh',
    };


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
     const handleGoalIDChange = (event) => {
        const value = event.target.value;
        setGoalID(value)
    }

    const organizerID = user.organizerID

    const organizerUsername = user.organizerUsername


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
        organizer_id: organizerID,
        organizer_username: organizerUsername,
        goal_id: goalID,
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
        // window.location.href = `${process.env.PUBLIC_URL}/events`
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
    <div style={customBackgroundStyle}>
    <Container >
    <div style={{paddingTop: '20%'}}>
    <div className="row">
    <div className="offset-3 col-6">

        <div className="shadow p-4 mt-4">
            <div className='Event-Create-form-container'>
            <h1 className="event-edit-header1">Flip the Script</h1>
            <form onSubmit={handleSubmit} id="create-customer-form">
                <div className="outerforminputcb1">
                    <input className='forminputcb1' value={name} onChange={handleNameChange} placeholder="Name" type="text" name="name" id="name" />
                    <label className='event-label' htmlFor="name">name:  {eventDetailData.name}</label>
                </div>
                <div className="outerforminputcb1">
                    <input className="forminputcb1datetime" value={date} onChange={handleDateChange} placeholder="Date" type="date" id="date" name="date"  />
                    <label className="event-label" htmlFor="date">date:  {eventDetailData.date}</label>
                </div>
                <div className="outerforminputcb1">
                    <input className="forminputcb1datetime" value={time} onChange={handleTimeChange} placeholder="Time" type="time" id="time" name="time" />
                    <label className='event-label' htmlFor="time">time:  {eventDetailData.time}</label>
                </div>
                <div className="outerforminputcb1">
                    <select onChange={handleGoalIDChange} id="items" className="forminputcb1select" >
                        <option value="" color='pink' >Choose Accomplist Item From Dropdown Below!</option>
                        {items.map(item =><option value={item.id} key={item.id}>{item.title}</option>)}
                    </select>
                    <label htmlFor="eventID" className="event-label">Accomplistment:</label>
                </div>
                <div className="outerforminputcb1">
                    <input className="forminputcb1" value={cost} onChange={handleCostChange} placeholder="DatCost" type="cost" id="cost" name="cost" />
                    <label className='event-label' htmlFor="cost">cost:  {eventDetailData.cost}</label>
                </div>
                <div className="outerforminputcb1">
                    <input className="forminputcb1" value={location} onChange={handleLocationChange} placeholder="Location" type="location" id="location" name="location"  />
                    <label className='event-label' htmlFor="location">location:  {eventDetailData.location}</label>
                </div>
                <div className="outerforminputcb1">
                    <input className="forminputcb1" value={description} onChange={handleDescriptionChange} placeholder="Description" type="description" id="description" name="description"  />
                    <label className='event-label' htmlFor="description">description:  {eventDetailData.description}</label>
                </div>
                <button type="submit" className="btn btn-sm event-edit-custom-button"  >Behold, Genesis!</button>
                <button className="btn btn-sm event-edit-custom2-button" onClick={()=>{navigate(`/events`)}}>Cancel</button>
            </form>
            </div>
        </div>
    </div>
    </div>
    </div>
    </Container>
    </div>
)
};
