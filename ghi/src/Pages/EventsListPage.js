import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"

export default function EventsList() {

    const { token } = useAuthContext();
    const [eventListData, setEventList] = useState([]);
    const navigate = useNavigate();
    const handleNewEventCreationPlace = (event) => {
        navigate('/events/new');
    };

    useEffect(() => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
            }


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

        <div>
            <h1>Event list!</h1>
            <table>
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
                                <td><button onClick={()=>navigate(`/events/${event.id}`)}>edit event</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>

        <div>
            <button>Event details!</button>
        </div>

        <div>
            <button className="btn btn-primary" onClick={handleNewEventCreationPlace}>Create new event type beat</button>
        </div>

        </div>
    )
}
