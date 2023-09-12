import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Search = () => {
    const [items, setItems] = useState([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('query');

    useEffect(() => {
        async function fetchData() {
            try {
                let url = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;

                if (searchTerm) {
                    url += `?title=${searchTerm}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (data.message) {
                    console.error(data.message);
                } else {
                    setItems(data);
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
                    <Row xs={1} md={2} lg={3} className="g-4 mt-1">
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
                    </Row>
                </Container>
        </div>
    );
}

export default Search;
