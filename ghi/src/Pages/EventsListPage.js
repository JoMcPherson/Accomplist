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

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));}

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
            await sleep(50);
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
            <div className='container'>
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
                                <tr key={event.id} >
                                    <td>{event.name}</td>
                                    <td>{event.location}</td>
                                    <td>{event.cost}</td>
                                    <td><button className={eventstyles.button49} onClick={()=>navigate(`/events/${event.id}`)}>Details</button></td>
                                    <td><button className={eventstyles.button49} onClick={()=>navigate(`/events/edit/${event.id}`)}>Edit Details</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div>
                <button className={eventstyles.button49} onClick={handleNewEventCreationPlace}>Create Event</button>
                </div>
            </div>
        </div>
    )
}
