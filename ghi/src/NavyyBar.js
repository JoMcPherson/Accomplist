import EventsList from "./Pages/EventsListPage.js";
import EventCreate from "./Pages/EventCreatePage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import MyAccomplistItemCreate from "./Pages/MyAccomplistItemsList.js";
import MyAccomplistItemsList from "./Pages/MyAccomplistItemsList.js";
import { BrowserRouter, Link, Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom";
import React, {useEffect,useState} from "react";


export default function NavvyBar() {

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
    getMyItems();
  }, []);



    return(
    <BrowserRouter>
      <nav
        style={{
          borderBottom: "dash 1px",
          paddingBottom: "1rem",
        }}>
        Navvy Bar:

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
        </nav>
    </BrowserRouter>
    )};
