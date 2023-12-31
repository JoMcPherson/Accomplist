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
import Logen from "../Components/Logen";

export default function AccountProfilePage({
  user,
  getMyItems,
  my_accomplist_items,
  items,
}) {
  const { token } = useToken();
  const [userInfo, setUserInfo] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [showAllHostedEvents, setShowAllHostedEvents] = useState(false);

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
            throw new Error(
              `HTTP profile url error! Status: ${response.status}`
            );
          }

          const userData = await response.json();

          setUserInfo({
            bio: userData.bio || "",
            photo: userData.photo || "",
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    const fetchHostedEvents = async () => {
      if (token && user.id !== undefined) {
        try {
          const hostedEventsUrl = `${process.env.REACT_APP_API_HOST}/events/account/${user.id}`;
          const response = await fetch(hostedEventsUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(
              `HTTP hosted events error! Status: ${response.status}`
            );
          }

          let events = await response.json();

          const now = new Date();
          events.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA < now && dateB < now) return dateA - dateB;
            if (dateA > now && dateB > now) return dateA - dateB;
            if (dateA < now) return 1;
            if (dateB < now) return -1;

            return 0;
          });

          setHostedEvents(events);
        } catch (error) {
          console.error("Failed to fetch events data:", error);
        }
      }
    };

    fetchUserData();
    fetchHostedEvents();
  }, [token, user.id]);

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
        const response = await fetch(updateMyAccomplistUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          getMyItems();
        }
      } catch (error) {
        console.error("Call Error:", error);
      }
    }
  };

  function joinName(first_name, last_name) {
    return `${first_name} ${last_name}`;
  }
  const fullName = joinName(user.first_name, user.last_name);

  function formatUserInfoDate(dateStr) {
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
  const formattedUserInfoDate = formatUserInfoDate(user.date_created);

  function formatEventCardsDate(dateStr) {
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
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  function formatEventTime(timeStr) {
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minuteStr} ${suffix}`;
  }

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

  const displayedHostedEvents = showAllHostedEvents
    ? hostedEvents
    : hostedEvents.slice(0, 4);

  if (!token) {
    return <Logen />;
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="hero-image-profile"></div>
      <div className="container container--profile">
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
                className="user-profile-image"
              />
            )}
            <Link to="/updateprofile" className="btn btn-outline-dark mt-3">
              Update Profile
            </Link>
          </div>
          <div style={{ marginLeft: "20px", marginTop: "21px" }}>
            <h1>
              <strong className="whitey">{user.username}</strong>
            </h1>
            <div>
              <strong>{fullName}</strong>
            </div>
            <div>
              <b>Member Since: </b>
              {formattedUserInfoDate}
            </div>
            <strong>Bio:</strong>
            <div>{userInfo.bio}</div>
          </div>
        </div>
        {completedItems.length > 0 && (
          <Container className="mt-4">
            <Row className="mb-4">
              <Col xs="auto">
                <h3>My Accomplistments:</h3>
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
                          style={{
                            textAlign: "center",
                            textAlignLast: "center",
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
        {incompleteItems.length > 0 && (
          <Container className="mt-4">
            <Row className="mb-4">
              <Col xs="auto">
                <h3>My Bucket List:</h3>
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
              {hostedEvents.length > 0 && (
                <Container className="mt-4">
                  <Row className="mb-4">
                    <Col xs="auto">
                      <h3>My Hosted Events:</h3>
                    </Col>
                    <Col xs="auto">
                      <Button
                        className="btn btn-light"
                        onClick={() =>
                          setShowAllHostedEvents(!showAllHostedEvents)
                        }
                      >
                        {showAllHostedEvents ? (
                          <span>&#9660;</span>
                        ) : (
                          <span>&#9654;</span>
                        )}
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    {displayedHostedEvents.map((userEvent) => (
                      <Col md={3} key={userEvent.event_id}>
                        <Card className="item-card-b">
                          <Card.Body>
                            <Link
                              to={`/events/${userEvent.event_id}`}
                              style={{ color: "black" }}
                            >
                              <Card.Title className="mb-3">
                                {userEvent.name || "Card title"}
                              </Card.Title>
                            </Link>
                            <Card.Subtitle className="mb-3 text-muted">
                              <strong>{"Location: "}</strong>
                              {userEvent.location || "Card location"}
                            </Card.Subtitle>
                            <Card.Text className="mb-3">
                              <strong>{"Time: "}</strong>
                              {formatEventTime(userEvent.time)}
                            </Card.Text>
                            <Card.Text className="mb-3">
                              <strong>{"Date: "}</strong>
                              {formatEventCardsDate(userEvent.date)}
                            </Card.Text>
                            <Card.Text className="mb-3">
                              {userEvent.description ||
                                "card description of the event"}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Container>
              )}
            </Row>
          </Container>
        )}
      </div>
    </div>
  );
}
