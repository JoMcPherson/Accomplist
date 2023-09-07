import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"
import eventstyles from "./eventstyles.module.css";

export default function EventsList() {

    const { token } = useAuthContext();
    const [eventListData, setEventList] = useState([]);
    const navigate = useNavigate();
    const handleNewEventCreationPlace = (event) => {
        navigate('/events/new');
    };

    useEffect(() => {
        async function getAllEvents() {
            if (token){
        const eventsUrl = `${process.env.REACT_APP_API_HOST}/events`
        const fetchConfig = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,
                    },
                }
        const theFetchedList = await fetch(eventsUrl, fetchConfig)
        if (theFetchedList.ok) {
            const theJsonifiedList = await theFetchedList.json();
            setEventList(theJsonifiedList)
        }
        }};
    async function demo() {
            getAllEvents()
    }


    demo()}, [token]);

    return(
            <div>
                <div className="hero-image-events">
                <div className="hero-text">
                    <h1>Come and join the party.</h1>
                </div>
            </div>
            <script src="sorttable.js"></script>
        <div>
            <h1>Event list!</h1>
            <table className="sortable">
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Location
                        </th>
                        <th>
                            Cost
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {eventListData.map(event => {
                        return (
                            <tr key={event.event_id} >
                                <td>{event.name}</td>
                                <td>{event.location}</td>
                                <td>{event.cost}</td>
                                <td><button className={eventstyles.button49} onClick={()=>navigate(`/events/${event.event_id}`)}>Details</button></td>
                                <td><button className={eventstyles.button49} onClick={()=>navigate(`/events/edit/${event.event_id}`)}>Edit Details</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>

        <div>

        </div>

        <div>
            <button className={eventstyles.button49} onClick={handleNewEventCreationPlace}>Create Event</button>
        </div>

        </div>
    )
}
