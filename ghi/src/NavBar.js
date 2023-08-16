import EventsList from "./Pages/EventsListPage.js";
import EventCreate from "./Pages/EventCreatePage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import { BrowserRouter, Link, Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom"
import { Nav, Navbar } from 'react-bootstrap'
import logo from "./logo.svg";

export default function NavBar() {

  return(


      <Navbar bg="dark" sticky="top" expand="sm" collapseOnSelect data-bs-theme="dark">
        <Navbar.Brand href="#">
          <img src={logo} width="30px" height="30px" />{' '} .
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>


        <Nav className="justify-content-center">
          <Nav.Link href="#">Items</Nav.Link>
          <Nav.Link href="#">Add</Nav.Link>
          <Nav.Link href="events">Events</Nav.Link>
          <Nav.Link href="#">Account</Nav.Link>
        </Nav>
        </Navbar.Collapse>


      </Navbar>


  )
};
