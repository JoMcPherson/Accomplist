import EventsList from "./Pages/EventsListPage.js";
import EventCreate from "./Pages/EventCreatePage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import { BrowserRouter, Link, Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom"


export default function NavvyBar() {

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
            <Route path="*" element={
                                        <main style={{ padding: "1rem" }}>
                                          <p>There's nothing here!</p>
                                        </main> }/>
          </Routes>
        </div>
        </nav>
    </BrowserRouter>
    )};
