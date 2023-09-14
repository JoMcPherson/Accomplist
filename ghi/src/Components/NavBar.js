import React, { useRef, useEffect, useState } from "react";
import { Navbar, Nav, NavItem, Form, FormControl, NavDropdown, Container, NavLink } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import logo from "../assets/logolarge.png";

const CustomNavbar = () => {
  const { logout, token } = useToken();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [navbarClass, setNavbarClass] = useState("");
  const navbarRef = useRef(null);
  const handleLogout = () => {
    logout();
    navigate("/accomplist_items");
  };

  const handleSearchChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
  event.preventDefault();
  if (inputValue.trim()) {
    navigate(`/search?query=${inputValue}`);
  }
};

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        setNavbarClass("compressed");
      } else {
        setNavbarClass("");
      }
    };

  const handleDocumentClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        const navbarToggler = document.querySelector(".navbar-toggler");
        if (navbarToggler && !navbarToggler.classList.contains("collapsed")) {
          navbarToggler.click();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <Navbar ref={navbarRef} className={`navbar ${navbarClass}`} expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/accomplist_items">
          <img src={logo} alt="Logo" className="logo" style={{ height: '22px', marginRight: '2px', marginTop: '-8px' }} />
          Accomplist
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="exampleNavComponents" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Accomplist Items" id="basic-navbar-nav">
              <NavDropdown.Item as={Link} to="/accomplist_items">View all Accomplist items</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/accomplist_items/new">Create an Accomplist item</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/my_accomplist_items/new">Add to my Accomplist items</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Events" id="basic-navbar-nav">
              <NavDropdown.Item as={Link} to="/events">View all events</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/events">Create an event</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/my_events/new">Add to my events</NavDropdown.Item>
            </NavDropdown>
            { token ? (<>
              <NavItem><NavLink as={Link} to="/profile">My Profile</NavLink></NavItem>
              <NavItem><NavLink onClick={handleLogout}>Logout</NavLink></NavItem>
              </>) : (
              <NavItem><NavLink as={Link} to="/login">Login</NavLink></NavItem>)}
          </Nav>
        <Form className="navbar-form navbar-right" onSubmit={handleSearchSubmit}>
        <FormControl type="text" placeholder="Search" name="accomplistsearch" id="search" value={inputValue} onChange={handleSearchChange}/>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
