import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function formatMonthAndYear(isoDate) {
    const date = new Date(isoDate);
    const options = { month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

const Search = () => {
    const [items, setItems] = useState([]);
    const [accounts, setAccounts] = useState([]);
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
                <h2>Accomplist Items:</h2>
                <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-4 mt-1">
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
                <h2>Profiles:</h2>
                <Row xs={1} md={2} lg={3} xl={5} className="g-4 mt-1">
                    {accounts.map(account => (
                      <Col key={account.id}>
                             <div className="profile-card" style={{ backgroundColor: getRandomColor() }}>
                                <div className="img-container">
                                <Link to={`/profile/${account.username}`}>
                                    <img src={account.photo} alt="account" />
                                </Link>
                                    <div className="username">{account.username}</div>
                                    <div className="subtext">{account.first_name} {account.last_name}</div>
                                </div>
                                <div className="profile-info">
                                    <p>{account.bio}</p>
                                    <p>Member since: {formatMonthAndYear(account.date_created)}</p>
                                </div>
                                <ul className="follow-list">
                                    <li>0 <FontAwesomeIcon icon={faSquareCheck} /></li>
                                    <li>0 <FontAwesomeIcon icon={faList} /></li>
                                    <li>0 <FontAwesomeIcon icon={faCalendar} /></li>
                                    <li>0 <FontAwesomeIcon icon={faCalendarCheck} /></li>
                                </ul>
                            </div>
                        </Col>
                    ))}
                    {accounts.length === 0 && <Col><h3>No accounts found.</h3></Col>}
                </Row>
            </Container>
            <Container fluid className='px-4 my-4'>
                <h2>Events:</h2>
                <Row xs={1} md={2} lg={3} xl={5} className="g-4 mt-1">
                    {accounts.map(account => (
                    <Col key={account.id}>
                    </Col>
                    ))}
                    {accounts.length === 0 && <Col><h3>No Events found.</h3></Col>}
                </Row>
            </Container>
        </div>
    );
}

export default Search;
