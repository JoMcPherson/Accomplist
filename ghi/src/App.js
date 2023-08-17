import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./App.css";
import { BrowserRouter, Link, Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar.js";
import EventCreate from "./Pages/EventCreatePage.js";
import EventsList from "./Pages/EventsListPage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import MyAccomplistItemCreate from "./Pages/MyAccomplistCreate.js";
import MyAccomplistItemsList from "./Pages/MyAccomplistItemsList.js";

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
      </BrowserRouter>
    </div>
  );
}

export default App;
