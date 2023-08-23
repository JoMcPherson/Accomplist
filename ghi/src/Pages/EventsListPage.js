import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import EventDetailDisplay from './EventDetailsPage';

export default function EventsList({eventList}) {

    const navigate = useNavigate();

    const handleNewEventCreationPlace = (event) => {
        navigate('/events/new');
    };


    // useEffect(() => {
    //     getAllEvents()
    //     console.log("priiint")
    // })

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
                    {eventList.map(event => {
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
