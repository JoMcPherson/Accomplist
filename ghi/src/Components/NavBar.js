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
  NavLink
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate, Link } from "react-router-dom";


const CustomNavbar = () => {
  const [navbarClass, setNavbarClass] = useState("");
  const { logout, token } = useToken();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    window.location.href = `${process.env.PUBLIC_URL}/accomplist_items`;
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
        <NavbarBrand as={Link} to="/accomplist_items">Accomplist</NavbarBrand>
        <Navbar.Toggle aria-controls="exampleNavComponents" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="ml-auto">
            <NavItem className="px-2">
              <NavLink onClick={()=>{navigate('/accomplist_items')}}>Bucket List</NavLink>
            </NavItem>
            <NavItem className="px-2">
              <NavLink as={Link} to="/events">Events</NavLink>
            </NavItem>
            {token ? (
              <NavItem className="px-2">
                <Nav.Link as={Link} to="/profile">My Profile</Nav.Link>
              </NavItem>
            ) : null}
            {token ? (
              <NavItem className="px-2">
                <NavLink onClick={handleLogout}>Logout</NavLink>
              </NavItem>
            ) : (
              <NavItem className="px-3">
                <NavLink as={Link} to="/Login">Login</NavLink>
              </NavItem>
            )}
            <NavDropdown
              title="temp.drop"
              id="basic-nav-dropdown"
              className="custom-dropdown"
            >
              <NavDropdown.Item as={Link} to="/accomplist_items/new">
                Create Accomplist Item
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/my_accomplist_items/new">
                Add Accomplist Items
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/my_accomplist_items">
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
