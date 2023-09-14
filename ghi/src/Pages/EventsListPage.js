import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"
import { Button, Container, Table } from 'react-bootstrap';
import Calendeesi from '../Components/BigCalendar';

export default function EventsList() {

    const { token } = useAuthContext();
    const [eventListData, setEventList] = useState([]);
    const navigate = useNavigate();
    // const handleNewEventCreationPlace = (event) => {
    //     navigate('/events/new');
    // };

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
                    <p className='eventlistpage-top-text'>Or better yet... <Link to="/events/new">Start your own</Link></p>
                </div>
            </div>
        <Container >
          <h1 className="text-center text-2xl font-bold sm:text-3xl gradient-text">
            Events
          </h1>
        <div className="flex h-screen w-screen flex-col justify-start overflow-x-auto">
      <div >
        <div>

        </div>
        <div className="mx-auto max-w-lg">
          <div style={{"backgroundColor": 'darkGrey', 'paddingTop': 1, 'paddingLeft': .5, 'paddingRight': .5}}>
            <Table striped bordered hover size="sm" >
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Events
                  </th>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Accomplist Goal
                  </th>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Location
                  </th>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Time
                  </th>
                  {token && <th className="px-6 py-3 bg-gray-50"></th>}
                  <th></th>
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
                            {event.event_id}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            {event.date}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            {event.location}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            {event.time}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <Button className="btn btn-sm custom-button" onClick={()=>navigate(`/events/${event.event_id}`)}>Details</Button>
                          {/* <button className={eventstyles.button49} onClick={()=>navigate(`/events/${event.event_id}`)}>
                            Details
                          </button> */}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <Button className="btn btn-sm custom-button" onClick={()=>navigate(`/events/edit/${event.event_id}`)}>Edit Details</Button>
                          {/* <button className={eventstyles.button49} onClick={()=>navigate(`/events/edit/${event.event_id}`)}>
                            Edit Details
                          </button> */}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
            <div>
                  <Calendeesi events={eventListData} />

                  {/* <Button className="btn btn-sm custom-button" onClick={handleNewEventCreationPlace}>New</Button> */}

            </div>

          </div>
          {/* <button className={eventstyles.button49} onClick={handleNewEventCreationPlace}>Create Event</button> */}
        </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
            <div className="flex justify-around">
            </div>
          </div>
        </div>
        </Container>

            <div className="simple-link">
            {/* <p className='eventlistpage-bottom-text'><Link to="/events/new">Start your own</Link></p> */}
            </div>
        </div>


    )
}
