import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./App.css";
import { BrowserRouter, Link, Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar.js";
import EventCreate from "./Pages/EventCreatePage.js";
import EventsList from "./Pages/EventsListPage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";

function App() {


  const [launchInfo, setLaunchInfo] = useState([]);
  const [error, setError] = useState(null);

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
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      <BrowserRouter>
      <div className="container">
          <Routes>
            <Route path="events/new" element={<EventCreate />} />
            <Route path="events/" element={<EventsList />} />
            <Route path="events/{event_id}" element={<EventDetailDisplay />} />
            <Route path="*" element={
                                        <main style={{ padding: "1rem" }}>
                                          <p>There's nothing here!</p>
                                        </main> }/>
          </Routes>
        </div>




      <ErrorNotification error={error} />
      <Construct info={launchInfo} />
      </BrowserRouter>
    </div>
  );
}

export default App;
