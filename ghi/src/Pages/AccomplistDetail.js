import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '@galvanize-inc/jwtdown-for-react';
import { Card, Image, Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginForm from './Logon';

export default function AccomplistDetail({ user, my_accomplist_items }) {
  const { token } = useAuthContext();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [itemDetailData, setItemDetail] = useState({ photo: '', resources: '', things_to_do: '' });
  const [newResource, setNewResource] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [thingToDo, setThingToDo] = useState('');
  const [height, setHeight] = useState(400);

  // for the parallax scroll
  useEffect(() => {
      const handleScroll = () => {
          let scrolled = window.scrollY;

          let newHeight = 400 - (scrolled * 1);
          if (newHeight < 170) newHeight = 170;
          setHeight(newHeight);

          let bgPosition = scrolled * 0.5;
          document.querySelector('.hero-image-description').style.backgroundPosition = `center -${bgPosition}px`;
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  // data stuffs
  useEffect(() => {
    if (!token) return;

    const getItemDetailData = async () => {
      const dataUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/${id}`;
      const fetchConfig = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const fetchedResponse = await fetch(dataUrl, fetchConfig);
        if (fetchedResponse.ok) {
          const data = await fetchedResponse.json();
          setItemDetail(data);
        } else {
          console.log('Fetch failed:', fetchedResponse);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // submission field
    getItemDetailData();
  }, [token, id, my_accomplist_items]);

  const handleUpdate = async (key, newValue) => {
    if (!token || !newValue.trim()) return;

    const updatedDataUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/${itemDetailData.id}`;
    const newConcatenatedValue = itemDetailData[key] + (itemDetailData[key] ? ';' : '') + newValue;

    const updated_data = {
      ...itemDetailData,
      [key]: newConcatenatedValue
    };

    const fetchConfig = {
      method: "PUT",
      body: JSON.stringify(updated_data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };

    try {
      const fetchedResponse = await fetch(updatedDataUrl, fetchConfig);
      if (fetchedResponse.ok) {
        const updatedItem = await fetchedResponse.json();
        setItemDetail(updatedItem);
        clearForm();
      } else {
        console.log('Fetch failed:', fetchedResponse);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // following three are for the submission fields
  const handlePhotoSubmit = event => {
    event.preventDefault();
    handleUpdate('photo', newPhoto);
  };

  const handleResourceSubmit = event => {
    event.preventDefault();
    handleUpdate('resources', newResource);
  };

  const handleThingsToDoSubmit = event => {
    event.preventDefault();
    handleUpdate('things_to_do', user.username.concat(":",thingToDo));
  };

  // modal code possibly redundant because of bootstrap but it works and i dont to want to faafo
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  // clears forms on submit
  const clearForm = () => {
    setNewResource('');
    setNewPhoto('');
    setThingToDo('');
  };

  if (token) {

  return (
    <div>
      <div className="hero-image-description" style={{ height: `${height}px` }}>
        <div className="hero-text-description">
          <h1>{itemDetailData.title}</h1>
          <p className="fst-italic fw-light">{itemDetailData.details}</p>
          </div>
      </div>
              <div style={{ marginTop: '450px' }}>


    <div className="container">
      <h3 className="mt-3">Accomplished:</h3>
      <p># have on their Accomplist list. | # have completed this item!</p>
      <h3>Upcoming events: </h3>
      <p>There are no events.</p>
        {/* {itemDetailData.events && itemDetailData.events.length === 0 ? (
            <p>There are no events.</p>
        ) : (
            itemDetailData.events && itemDetailData.events.map((event, index) => (
                <p key={index}><a href={event.link} target="_blank" rel="noreferrer">{event.title}</a></p>
            ))
        )} */}
      <h3 className='mt-3'>Photos:</h3>
      <Row className="mx-auto">
        {itemDetailData.photo && itemDetailData.photo.split(";").map((photo, index) => (
          photo && (
            <Col xs={6} md={4} lg={3} key={index}>
              <div className="thumbnail-container mt-3 d-flex justify-content-center" onClick={() => handleImageClick(photo)}>
                <Image className="thumbnail-image" alt="" src={photo} style={{ height: '200px' }} />
              </div>
            </Col>
          )
        ))}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)} size='lg'>
        <Modal.Body>
          <img src={selectedImage} alt="Selected Item" className="modal-image" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-outline-dark" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Form onSubmit={handlePhotoSubmit}>
        <Form.Group className="mt-3" controlId="addPhoto">
          <Form.Label>Add a photo:</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control placeholder="add a photo url" className="me-2" type="text" required value={newPhoto} onChange={(e) => setNewPhoto(e.target.value)} />
            <Button variant="btn btn-outline-dark" type="submit">Submit</Button>
          </div>
        </Form.Group>
      </Form>
      <h3 className='mt-3'>Resources:</h3>
      <div>
        <ul>
          {itemDetailData.resources && itemDetailData.resources.split(";").map((url, index) => (
            <li key={index}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </li>
          ))}
        </ul>
      </div>
      <Form onSubmit={handleResourceSubmit}>
        <Form.Group className="mb-3" controlId="addResource">
          <Form.Label>Share a link:</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control placeholder="add a url" className="me-2" type="text" required value={newResource} onChange={(e) => setNewResource(e.target.value)} />
            <Button variant="btn btn-outline-dark" type="submit">Submit</Button>
          </div>
        </Form.Group>
      </Form>
      <h3 className='mt-3'>Suggestions: </h3>
      <Form onSubmit={handleThingsToDoSubmit}>
        <Form.Group className="mb-3" controlId="thingToDoInput">
          <Form.Label>Have a suggestion to add? A story to share? Some advice on what to avoid?</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={thingToDo}
            onChange={(e) => setThingToDo(e.target.value)}
          />
          <Button variant="btn btn-outline-dark" type="submit" className="mt-2">Submit</Button>
        </Form.Group>
      </Form>
      <div className="suggestions-container">
        {itemDetailData && itemDetailData.things_to_do && itemDetailData.things_to_do.split(";").map((thing, index) => (
          <Card className="suggestion-card mb-3" key={index}>
            <Card.Body className="custom-card-body d-flex">
              <div className="profile-pic-container">
                <Link to={`/user/${user.id}`}>
                  <Image src={user.photo} />
                </Link>
              </div>
              <div className="comment-content">
                <div className="comment-header d-flex justify-content-between">
                  <strong className="comment-author">{user.username}</strong>
                  <span className="comment-datetime">2023-09-05 14:30</span>
                </div>
                <p>{thing}</p>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
}

return <LoginForm />;

}