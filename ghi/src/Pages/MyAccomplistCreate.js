import React, { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { Container, Row, Form, Button, Table } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function MyAccomplistItemCreate({ user, items, my_accomplist_items, getMyItems }) {
  const { token } = useToken();
  const [item, setItem] = useState('');
  const [completed, setCompleted] = useState(false);
  const userId = user.id;

  const customBackgroundStyle = {
  backgroundImage: `url(https://i.imgur.com/WFCPRp8.jpeg)`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: '100vh',
};

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      user_id: userId,
      item_id: item,
      completed: completed,
    };


    const myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(myItemUrl, fetchConfig);
    if (response.ok) {
      setItem('');
      setCompleted(false);
      getMyItems();
      window.location.href = `${process.env.PUBLIC_URL}/my_accomplist_items/new`;
    }
  }

   async function handleDelete(event) {
    event.preventDefault();
    const myAccomplistItemId = event.target.value

    const myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items/${myAccomplistItemId}`;
    const fetchConfig = {
      method: "delete",
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(myItemUrl, fetchConfig);
    if (response.ok) {
      getMyItems();
      window.location.href = `${process.env.PUBLIC_URL}/my_accomplist_items/new`;
    }
  }

  function handleChangeItem(event) {
    setItem(event[0].id);
  }

  function handleChangeCompleted(event) {
    const { value } = event.target;
    setCompleted(value);
  }

  if (token && my_accomplist_items) {
    const completedItems = my_accomplist_items.filter(item => item.completed);
    const pendingItems = my_accomplist_items.filter(item => !item.completed);
    //   get an array of all my accomplist item item ids
    const myAccomplistItemIds = my_accomplist_items.map(item => item.item_id);
    // Filter the items array to include only items not in my_accomplist_items
    const filteredItems = items.filter(item => !myAccomplistItemIds.includes(item.id));

    return (
    <div style={customBackgroundStyle}>
        <div style={{ paddingTop: '200px' }}>
            <Container>
                <h1 className="whitey-shadow">Add An Accomplist Item To Your Bucketlist!</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group >
            <h5 className="whitey-shadow" htmlFor="items">Choose Accomplist Item</h5>
            <Typeahead
              id="items"
              labelKey="title"
              options={filteredItems}
              onChange={handleChangeItem}
              placeholder="Choose Item From Dropdown Below!"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <h5 className="whitey-shadow" htmlFor="completed">Have You Done It?</h5>
            <Form.Control
              as="select"
              onChange={handleChangeCompleted}
              id="completed"
            >
              <option value={false}>Will Do</option>
              <option value={true}>Done It!</option>
            </Form.Control>
          </Form.Group>

          <Button
            disabled={items.length === 0}
            type="submit"
            variant="primary"
          >
            Submit
          </Button>
        </Form>

        <Container className="mt-5">
          <h1 className="whitey-shadow">{user.username}'s accomplistments and bucket list!</h1>

          <Row>
               <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '75%' }}>Accomplist Item</th>
                  <th style={{ width: '20%' }}>Status</th>
                  <th style={{ width: '5%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>{completedItems.map(my_item => (
                  <tr key={my_item.id}>
                    <td>{my_item.item_title}</td>
                    <td>Done</td>
                    <td><Button className="btn btn-sm custom-button" onClick={handleDelete} value={my_item.id}>Delete</Button></td>
                  </tr>
                     ))}
                  </tbody>
            </Table>
          </Row>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '75%' }}>Accomplist Item</th>
                  <th style={{ width: '20%' }}>Status</th>
                  <th style={{ width: '5%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>{pendingItems.map(my_item => (
                  <tr key={my_item.id}>
                    <td>{my_item.item_title}</td>
                    <td>Will Do!</td>
                    <td><Button className="btn btn-sm custom-button" onClick={handleDelete} value={my_item.id}>Delete</Button></td>
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
      <div className="mt-5">You must be logged in to add to your Accomplist Items</div>
    );
  }
}
