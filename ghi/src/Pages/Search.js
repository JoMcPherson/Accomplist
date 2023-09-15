import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faList, faCalendar, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function formatDateParts(isoDate) {
    const date = new Date(isoDate);
    return {
        day: new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date),
        month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
        year: new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)
    };
}

const Search = () => {
    const [items, setItems] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('query');

    useEffect(() => {
        async function fetchData() {
            try {
                let itemsUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;
                if (searchTerm) {
                    itemsUrl += `?title=${searchTerm}`;
                }
                const itemsResponse = await fetch(itemsUrl);
                const itemsData = await itemsResponse.json();

                let accountsUrl = `${process.env.REACT_APP_API_HOST}/api/accounts`;
                if (searchTerm) {
                    accountsUrl += `?query=${searchTerm}`;
                }
                const accountsResponse = await fetch(accountsUrl);
                const accountsData = await accountsResponse.json();

                let eventsUrl = `${process.env.REACT_APP_API_HOST}/events`;
                if (searchTerm) {
                    eventsUrl += `?query=${searchTerm}`;
                }
                const eventsResponse = await fetch(eventsUrl);
                const eventsData = await eventsResponse.json();

                if (eventsData.message) {
                    console.error(eventsData.message);
                } else {
                    setEvents(eventsData);
                }

                if (itemsData.message) {
                    console.error(itemsData.message);
                } else {
                    setItems(itemsData);
                }

                if (accountsData.message) {
                    console.error(accountsData.message);
                } else {
                    setAccounts(accountsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        if (searchTerm) {
            fetchData();
        }

    }, [searchTerm]);

    return (
    <div>
        <div className="hero-image-search">
            <div className="hero-text">
                <h1>{searchTerm ? `Search results for: ${searchTerm}` : 'Come and join the party.'}</h1>
                <p>Hope you found what you're looking for.</p>
            </div>
        </div>
        <Container fluid className='px-4 my-4'>
            <h3>Accomplist Items:</h3>
            <Row xs={1} md={2} lg={3} xxl={4} className="g-4 mt-1">
                {items.map(item => (
                    <Col key={item.id} className="text-center">
                        <div className="item-card">
                            <Link to={`/accomplist_items/${item.id}`}>
                                <img src={item.photo} className="card-img-top" alt={item.title}></img>
                            </Link>
                            <div className="profile-content">
                                <h2 className="profile-name">{item.title}</h2>
                            </div>
                            <div className="profile-description">{item.details}</div><br/>
                        </div>
                    </Col>
                ))}
                {items.length === 0 && <Col><h3>No items found.</h3></Col>}
            </Row>
        </Container>
        <Container fluid className='px-4 my-4'>
            <h3>Profiles:</h3>
            <Row xs={1} md={2} lg={3} xxl={4} className="g-4 mt-1">
                {accounts.map(account => {
                const accountDateParts = formatDateParts(account.date_created);
                return (
                    <Col key={account.id}>
                        <div className="profile-card" style={{ backgroundColor: getRandomColor() }}>
                            <div className="img-container">
                            <Link to={`/profile/${account.username}`}>
                                <img src={account.photo} alt={account.username} />
                            </Link>
                                <div className="username">{account.username}</div>
                                <div className="subtext">{account.first_name} {account.last_name}</div>
                            </div>
                            <div className="profile-info">
                                <p>{account.bio}</p>
                                <p>Member since: {accountDateParts.month} {accountDateParts.year}</p>
                            </div>
                            <ul className="follow-list">
                                <li title="Completed Items">0 <FontAwesomeIcon icon={faSquareCheck} /></li>
                                <li title="Wanted Items">0 <FontAwesomeIcon icon={faList} /></li>
                                <li title="Past Events">0 <FontAwesomeIcon icon={faCalendarCheck} /></li>
                                <li title="Upcoming Events">0 <FontAwesomeIcon icon={faCalendar} /></li>
                            </ul>
                        </div>
                    </Col>
                );})}
                {accounts.length === 0 && <Col><h3>No accounts found.</h3></Col>}
            </Row>
        </Container>
        <Container fluid className='px-4 my-4'>
            <h3>Events:</h3>
            <Row xs={1} md={2} lg={3} xxl={4} className="g-4 mt-1">
                {events.map(event => {
                return (
                    <Col key={event.event_id}>
                        <div className="event">
                            <div className="event-title-wrapper">
                                <div className="event-date-primary" style={{ backgroundColor: getRandomColor() }}>
                                    <span className="event-date-day">{formatDateParts(event.date).day}</span>
                                    <span className="event-date-month">{formatDateParts(event.date).month}</span>
                                </div>
                                <div className="event-meeting-info">
                                    <span className="event-pro-title">{event.location}</span>
                                    <span className="event-meeting-time">{event.time}</span>
                                    <span className="event-meeting-cost">{event.cost}</span>
                                </div>
                            </div>
                            <div className="event-header">
                                <Link to={`/events/${event.event_id}`} className="event-title-link">{event.name}</Link>
                                <span className="event-description">{event.description}</span>
                            </div>
                        </div>
                    </Col>
                );})}
                {events.length === 0 && <Col><h3>No Events found.</h3></Col>}
            </Row>
        </Container>
        </div>
    );
}

export default Search;
