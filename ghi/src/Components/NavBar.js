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
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="ml-auto">
          <NavDropdown title="Accomplist Items" id="basic-nav-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={Link} to="/accomplist_items/new">Create an Accomplist Item</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/accomplist_items">View all Accomplist Items</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/my_accomplist_items/new">Add to my Accomplist Items</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Events" id="basic-nav-dropdown" className="custom-dropdown">
          <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/my_events/new">Add to My Events</NavDropdown.Item>
        </NavDropdown>
        {token ? ( <NavItem className="px-2"><Nav.Link as={Link} to="/profile">My Profile</Nav.Link></NavItem>) : null}
        {token ? (
          <NavItem className="px-2"><NavLink onClick={handleLogout}>Logout</NavLink></NavItem>
            ) : (
          <NavItem className="px-3"><NavLink as={Link} to="/Login">Login</NavLink></NavItem>
            )}
        </Nav>
        <Form className="navbar-form navbar-right px-2" onSubmit={handleSearchSubmit}>
        <FormControl type="text" placeholder="Search" value={inputValue} onChange={handleSearchChange}/>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default CustomNavbar;
