import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./index.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar.js";
import EventCreateForm from "./Pages/EventCreatePage.js";
import EventsList from "./Pages/EventsListPage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import MyAccomplistItemCreate from "./Pages/MyAccomplistCreate.js";
import MyAccomplistItemsList from "./Pages/MyAccomplistItemsList.js";
import LoginForm from "./Pages/Login.js";
import Register from "./Pages/Register.js";
// import Profile from "./Pages/profile.js";
// import getAllEvents from "./Pages/EventsListPage.js";

function App() {

const [launchInfo, setLaunchInfo] = useState([]);
const [error, setError] = useState(null);

const [eventList, setEventList] = useState([])
    async function getAllEvents() {
        const eventsUrl = 'http://localhost:8000/events'
        const theFetchedList = await fetch(eventsUrl)
        if (theFetchedList.ok) {
            const theJsonifiedList = await theFetchedList.json();
            setEventList(theJsonifiedList)
        }
    }

  useEffect(() => {
    async function getData() {
      let url = `${process.env.REACT_APP_API_HOST}/api/launch-details`;
      let response = await fetch(url);
      let data = await response.json();

      if (response.ok) {
        console.log("got launch data!");
        setLaunchInfo(data.launch_details);
      } else {
        console.log("drat! something happened");
        setError(data.message);
      }
    }
    getData();
    getAllEvents();
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login/" element={<LoginForm />} />
          {/* <Route path="profile/" element={<Profile />} /> */}
          <Route path="register/" element={<Register />} />
          <Route path="events/new" element={<EventCreateForm />} />
          <Route path="events/" element={<EventsList eventList={eventList} />} />
          <Route path="events/events" element={<EventsList eventList={eventList} />} />
          <Route path="events/{event_id}" element={<EventDetailDisplay />} />
          <Route path="my_accomplist_items/new" element={<MyAccomplistItemCreate />} />
          <Route path="my_accomplist_items/" element={<MyAccomplistItemsList />} />
        </Routes>
      </div>
      <ErrorNotification error={error} />
      <Construct info={launchInfo} />
      </BrowserRouter>
    </div>
  );
}

function Home() {
  return (
    <div>
      hello.
    </div>
  )
}

export default App;
