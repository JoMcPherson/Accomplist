import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
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
                    <p>Or better yet... <Link to="/events/new">Start your own</Link></p>
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


        <div className="flex h-screen w-screen flex-col justify-start overflow-hidden">
      <div className="mt-16 mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-center text-2xl font-bold sm:text-3xl gradient-text">
            Neighborhoods
          </h1>
        </div>
        <div className="mx-auto max-w-lg">
          <div className="relative bg-white px-6 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 mt-4">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Neighborhood
                  </th>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Postal Codes
                  </th>
                  {token && <th className="px-6 py-3 bg-gray-50"></th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {eventListData.map(event => {
                    return (
                      <tr key={event.event_id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            {event.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            {event.location}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <div className="flex justify-around">

        </div>
      </div>
    </div>



        </div>


    )
}
