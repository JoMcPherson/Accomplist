import React, { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { Container, Row, Form, Button, Table } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function MyEventCreate({ user }) {

  const { token, fetchWithToken } = useToken();
  const [eventObject, setEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [my_events, setMyEvents] = useState([]);

  // Call Events Function Upon Token
  useEffect(() => {
    if (token && user.id) {
      async function fetchData() {
        if (token) {
          try {
            const eventUrl = `${process.env.REACT_APP_API_HOST}/events`;
            const eventData = await fetchWithToken(eventUrl);
            setEvents(eventData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          console.log("fetch events failed");
        }
      }

      fetchData();
      getMyEvents();
    } // eslint-disable-next-line
  }, [token, user.id]);

  // Set My Events
  const getMyEvents= async () => {
    if (token) {
      const myEventUrl = `${process.env.REACT_APP_API_HOST}/api/my_events/account/${user.id}`;
      const response = await fetchWithToken(myEventUrl);
      setMyEvents(response);
    } else {
      console.log("fetch my events failed");
    }
  };



  const customBackgroundStyle = {
  backgroundImage: 'url("https://i.imgur.com/afK9tLx.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: '100vh',
};

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      event_id: eventObject,
      attendee_id: user.id,
    };
    const myEventUrl = `${process.env.REACT_APP_API_HOST}/api/my_events`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(myEventUrl, fetchConfig);
    if (response.ok) {
      setEvent('');
      getMyEvents();
      window.location.href = `${process.env.PUBLIC_URL}/my_events/new`;
    }
  }

   async function handleDelete(event) {
    event.preventDefault();
    const myEvent = my_events.find(my_event => my_event.event_id === parseInt(event.target.value))
    const myEventId = myEvent.id
    const myEventUrl = `${process.env.REACT_APP_API_HOST}/api/my_events/${myEventId}`;
    const fetchConfig = {
      method: "delete",
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(myEventUrl, fetchConfig);
    if (response.ok) {
      getMyEvents();
      window.location.href = `${process.env.PUBLIC_URL}/my_events/new`;
    }
  }

  function handleChangeEvent(eventthing) {
    setEvent(eventthing[0].event_id)
  }


  if (token && my_events) {
  const today = new Date();
  const myEventIds = my_events.map(event => event.event_id);
  const upcomingEvents = events.filter(event => myEventIds.includes(event.event_id) && new Date(event.date) > today )
  const pastEvents = events.filter(event => myEventIds.includes(event.event_id) && new Date(event.date) < today )
  ;

    // Filter the events array to include only events not in my_events
    const filteredEvents = events.filter(event => !myEventIds.includes(event.event_id));


    return (
    <div style={customBackgroundStyle}>
        <div style={{ paddingTop: '200px' }}>
            <Container>
                <h1 className="whitey-shadow">Save an Event!</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group >
            <h5 className="whitey-shadow" htmlFor="events">Choose Event</h5>
            <Typeahead
              id="events"
              labelKey="name"
              options={filteredEvents}
              onChange={handleChangeEvent}
              placeholder="Choose Event From Dropdown Below!"
            />
          </Form.Group>

          <Button
            disabled={events.length === 0}
            type="submit"
            variant="primary"
          >
            Submit
          </Button>
        </Form>

        <Container className="mt-5">
          <h1 className="whitey-shadow">{user.username}'s events!</h1>
           <h2 className="whitey-shadow">upcoming events!</h2>
          <Row>
               <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '75%' }}>Event</th>
                  <th style={{ width: '15%' }}>Date</th>
                  <th style={{ width: '5%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>{upcomingEvents.map(my_event => (
                  <tr key={my_event.event_id}>
                    <td>{my_event.name}</td>
                    <td>{my_event.date}</td>
                    <td><Button className="btn btn-sm custom-button" onClick={handleDelete} value={my_event.event_id}>Delete</Button></td>
                  </tr>
                     ))}
                  </tbody>
            </Table>
          </Row>
          <h2 className="whitey-shadow">past events!</h2>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '75%' }}>Event</th>
                  <th style={{ width: '15%' }}>Date</th>
                  <th style={{ width: '5%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>{pastEvents.map(my_event => (
                  <tr key={my_event.event_id}>
                    <td>{my_event.name}</td>
                    <td>{my_event.date}</td>
                    <td><Button className="btn btn-sm custom-button" onClick={handleDelete} value={my_event.event_id}>Delete</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>

      </Container>
      </div>
      </div>

    );
  } else {
    return (
      <div className="mt-5">You must be logged in to add to your Events</div>
    );
  }
}
