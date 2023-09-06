import { useEffect, useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AccountProfilePage({
  user,
  // get_user_data,
  my_accomplist_items,
  items,
}) {
  const { token } = useToken();
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && user.id !== undefined) {
        try {
          const profileUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${user.id}`;
          const response = await fetch(profileUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const userData = await response.json();

          // Set fetched user data to formData
          setUserInfo({
            bio: userData.bio || "",
            photo: userData.photo || "",
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, [token, user.id]);

  function joinName(first_name, last_name) {
    return `${first_name} ${last_name}`;
  }
  const fullName = joinName(user.first_name, user.last_name);

  const handleCompleteChange = async (
    event,
    myItemID,
    itemID,
    myItemUserID
  ) => {
    event.preventDefault();
    if (token) {
      try {
        const updateMyAccomplistUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items/${myItemID}`;
        const data = {
          item_id: itemID,
          user_id: myItemUserID,
          completed: event.target.value,
        };
        await fetch(updateMyAccomplistUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Call Error:", error);
      }
    }
  };

  function formatDate(dateStr) {
    const months = [
      "Jan.",
      "Feb.",
      "Mar.",
      "Apr.",
      "May",
      "Jun.",
      "Jul.",
      "Aug.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dec.",
    ];
    const dateObj = new Date(dateStr);
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${month} ${year}`;
  }
  const formattedDate = formatDate(user.date_created);

  const [showCompleted, setShowCompleted] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);

  const incompleteItems = my_accomplist_items.filter((item) => !item.completed);
  const completedItems = my_accomplist_items.filter((item) => item.completed);

  const displayedIncompleteItems = showIncomplete
    ? incompleteItems
    : incompleteItems.slice(0, 4);

  const displayedCompletedItems = showCompleted
    ? completedItems
    : completedItems.slice(0, 4);

  if (!token) {
    return <div> Please log in to access your profile! </div>;
  }

  return (
    <div className="container" style={{ marginTop: "150px" }}>
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {user.photo && (
            <img
              src={userInfo.photo}
              alt="User's Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          )}
          <Link to="/updateprofile" className="btn btn-outline-dark mt-3">
            Update Profile
          </Link>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <h1>
            <strong>{user.username}</strong>
          </h1>
          <div>
            <strong>{fullName}</strong>
          </div>
          <div>
            <b>Member Since: </b>
            {formattedDate}
          </div>
          <strong>Bio</strong>
          <div>{userInfo.bio}</div>
        </div>
      </div>
      {completedItems.length > 0 && (
        <Container className="mt-4">
          <Row className="mb-4">
            <Col xs="auto">
              <h3>My Completed Items:</h3>
            </Col>
            <Col xs="auto">
              <Button
                className="btn btn-light"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? <span>&#9660;</span> : <span>&#9654;</span>}
              </Button>
            </Col>
          </Row>
          <Row>
            {displayedCompletedItems.map((my_item) => {
              const accomplist_item = items.find(
                (item) => item.id === my_item.item_id
              );
              return (
                <Col md={3} key={my_item.id}>
                  <Card className="item-card-b">
                    <div className="shine-wrapper">
                      {accomplist_item?.photo && (
                        <Link to={`/accomplist_items/${accomplist_item.id}`}>
                          <Card.Img
                            variant="top"
                            src={accomplist_item.photo}
                            className="card-img-top"
                            alt=""
                          />
                        </Link>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title
                        className="truncate"
                        style={{ fontSize: "1rem", color: "darkgreen" }}
                      >
                        {my_item.item_title}
                      </Card.Title>
                      <Card.Text className="truncate-description">
                        {accomplist_item?.details}
                      </Card.Text>
                      <FormControl
                        as="select"
                        defaultValue={my_item.completed ? true : false}
                        onChange={(event) =>
                          handleCompleteChange(
                            event,
                            my_item.id,
                            my_item.item_id,
                            my_item.user_id
                          )
                        }
                        style={{ textAlign: "center", textAlignLast: "center" }}
                      >
                        <option value={true}>Done!</option>
                        <option value={false}>Will Do!</option>
                      </FormControl>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
      {incompleteItems.length > 0 && (
        <Container className="mt-4">
          <Row className="mb-4">
            <Col xs="auto">
              <h3>My To Do Items:</h3>
            </Col>
            <Col xs="auto">
              <Button
                className="btn btn-light"
                onClick={() => setShowIncomplete(!showIncomplete)}
              >
                {showIncomplete ? <span>&#9660;</span> : <span>&#9654;</span>}
              </Button>
            </Col>
          </Row>
          <Row>
            {displayedIncompleteItems.map((my_item) => {
              const accomplist_item = items.find(
                (item) => item.id === my_item.item_id
              );
              return (
                <Col md={3} key={my_item.id}>
                  <Card className="item-card-b">
                    {accomplist_item?.photo && (
                      <Link to={`/accomplist_items/${accomplist_item.id}`}>
                        <div className="blackandwhite">
                          <Card.Img
                            variant="top"
                            src={accomplist_item.photo}
                            className="card-img-top"
                            alt=""
                          />
                        </div>
                      </Link>
                    )}
                    <Card.Body>
                      <Card.Title
                        className="truncate"
                        style={{ fontSize: "1rem" }}
                      >
                        {my_item.item_title}
                      </Card.Title>
                      <Card.Text className="truncate-description">
                        {accomplist_item?.details}
                      </Card.Text>
                      <FormControl
                        as="select"
                        defaultValue={my_item.completed ? true : false}
                        onChange={(event) =>
                          handleCompleteChange(
                            event,
                            my_item.id,
                            my_item.item_id,
                            my_item.user_id
                          )
                        }
                        style={{
                          textAlign: "center",
                          textAlignLast: "center",
                          appearance: "auto",
                        }}
                      >
                        <option value={true}>Done!</option>
                        <option value={false}>Will Do!</option>
                      </FormControl>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
    </div>
  );
}
