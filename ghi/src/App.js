import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./index.css";
import { BrowserRouter, Link, Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar.js";
import EventCreateForm from "./Pages/EventCreatePage.js";
import EventsList from "./Pages/EventsListPage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import MyAccomplistItemCreate from "./Pages/MyAccomplistCreate.js";
import MyAccomplistItemsList from "./Pages/MyAccomplistItemsList.js";
<<<<<<< HEAD
=======
import getAllEvents from "./Pages/EventsListPage.js";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import LoginForm from "./Pages/login.js";
import SignupForm from "./Pages/Register.js";
// import Profile from "./Pages/profile.js";

>>>>>>> main

function App() {

const [launchInfo, setLaunchInfo] = useState([]);
const [error, setError] = useState(null);
 const [my_accomplist_items,setMyItems] = useState([])
  async function getMyItems() {
    const myItemUrl = 'http://localhost:8000/my_accomplist_items'
    const response = await fetch(myItemUrl)
    if (response.ok) {
      const data = await response.json();
      setMyItems(data)
    }

  }
<<<<<<< HEAD
=======

const [eventList, setEventList] = useState([])
    async function getAllEvents() {
        const eventsUrl = 'http://localhost:8000/events'
        const theFetchedList = await fetch(eventsUrl)
        if (theFetchedList.ok) {
            const theJsonifiedList = await theFetchedList.json();
            setEventList(theJsonifiedList)
        }
    }
>>>>>>> main

  useEffect(() => {
    async function getData() {
      let url = `${process.env.REACT_APP_API_HOST}/api/launch-details`;
      console.log("fastapi url: ", url);
      let response = await fetch(url);
      console.log("------- hello? -------");
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
    getMyItems();
<<<<<<< HEAD
=======
    getAllEvents();
    console.log("app prinnttt")
>>>>>>> main
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      <BrowserRouter>
      <AuthProvider baseUrl={process.env.REACT_APP_API_HOST}>
      <div className="container">
          <Routes>
            <Route path="login/" element={<LoginForm />} />
            {/* <Route path="profile/" element={<Profile />} /> */}
            <Route path="signup/" element={<SignupForm />} />
            <Route path="events/new" element={<EventCreateForm />} />
            <Route path="events/" element={<EventsList eventList={eventList} />} />
            <Route path="events/events" element={<EventsList eventList={eventList} />} />
            <Route path="events/{event_id}" element={<EventDetailDisplay />} />
            <Route path="my_accomplist_items/new" element={<MyAccomplistItemCreate />} />
            <Route path="my_accomplist_items/" element={<MyAccomplistItemsList my_accomplist_items={my_accomplist_items} />} />
            <Route path="*" element={
                                        <main style={{ padding: "1rem" }}>
                                          <p>There's nothing here!</p>
                                        </main> }/>
          </Routes>
        </div>

      <ErrorNotification error={error} />
      <Construct info={launchInfo} />
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
