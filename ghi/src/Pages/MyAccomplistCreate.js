import React, { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { Container, Row, Form, Button, Table } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function MyAccomplistItemCreate({ user, items, my_accomplist_items, getMyItems }) {
  const { token } = useToken();
  const [item, setItem] = useState('');
  const [completed, setCompleted] = useState(false);

  const userId = user.id;


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
        <div style={{ marginTop: '180px' }}>
      <Container>
        <h1 className="mt-5">Add An Accomplist Item To Your Bucketlist!</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="items">Choose Accomplist Item</Form.Label>
            <Typeahead
              id="items"
              labelKey="title"
              options={filteredItems}
              onChange={handleChangeItem}
              placeholder="Choose Item From Dropdown Below!"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="completed">Have You Done It?</Form.Label>
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
          <h1>{user.username}'s Accomplist items.</h1>

          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '80%' }}>Accomplist Item</th>
                  <th style={{ width: '20%' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {completedItems.map(my_item => (
                  <tr key={my_item.id}>
                    <td>{my_item.item_title}</td>
                    <td>Done</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>

          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '80%' }}>Accomplist Item</th>
                  <th style={{ width: '20%' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingItems.map(my_item => (
                  <tr key={my_item.id}>
                    <td>{my_item.item_title}</td>
                    <td>Will Do!</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>

      </Container>
       </div>
    );
  } else {
    return (
      <div className="mt-5">You must be logged in to add to your Accomplist Items</div>
    );
  }
}
