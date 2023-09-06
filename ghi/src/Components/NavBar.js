import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  NavItem,
  Form,
  FormControl,
  NavbarBrand,
  NavDropdown,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import useToken from "@galvanize-inc/jwtdown-for-react";

const CustomNavbar = () => {
  const [navbarClass, setNavbarClass] = useState("");
  const { logout, token } = useToken();
  const handleLogout = () => {
    logout();
    window.location.href = "/accomplist_items";
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        setNavbarClass("compressed");
      } else {
        setNavbarClass("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar className={`navbar ${navbarClass}`} expand="lg" fixed="top">
      <Container>
        <NavbarBrand href="/accomplist_items">Accomplist</NavbarBrand>
        <Navbar.Toggle aria-controls="exampleNavComponents" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="ml-auto">
            <NavItem className="px-1">
              <Nav.Link href="/accomplist_items">Accomplist List</Nav.Link>
            </NavItem>
            <NavItem className="px-1">
              <Nav.Link href="/events">Events</Nav.Link>
            </NavItem>
            {token ? (
              <NavItem className="px-2">
                <Nav.Link href="/profile">My Profile</Nav.Link>
              </NavItem>
            ) : null}
            {token ? (
              <NavItem className="px-2">
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </NavItem>
            ) : (
              <NavItem className="px-2">
                <Nav.Link href="/Login">Login</Nav.Link>
              </NavItem>
            )}
            <NavDropdown
              title="temp.drop"
              id="basic-nav-dropdown"
              className="custom-dropdown"
            >
              <NavDropdown.Item href="/accomplist_items/new">
                Create A Public Accomplist Item
              </NavDropdown.Item>
              <NavDropdown.Item href="/my_accomplist_items/new">
                Add To My Accomplist Items
              </NavDropdown.Item>
              <NavDropdown.Item href="/my_accomplist_items">
                View My Accomplist Items
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="navbar-form navbar-right px-2">
            <FormControl type="text" placeholder="Search" />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
