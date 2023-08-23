import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./index.css"

export default function Header() {
  const [isScroll, setIsScroll] = useState(false);
  const hanndleScroll = () => {
    if (window.scrollY >= 100) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  };
  window.addEventListener("scroll", hanndleScroll);

  function handleClick(event) {
    // event.preventDefault();
    // console.log("clicked.");
  }

  return (
    <header>
      <Navbar
        className={isScroll ? "navbar colorChange" : "navbar"}
        collapseOnSelect
        expand="md"
        variant={isScroll ? "dark" : "light"}
        fixed="top"
      >
        <Container >
          <Navbar.Brand href="/">
            Accomplist
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link href="#" onClick={handleClick}>
                Items
              </Nav.Link>
              <Nav.Link href="#" onClick={handleClick}>
                Events
              </Nav.Link>
              <Nav.Link href="#" onClick={handleClick}>
                Accounts
              </Nav.Link>
              <Nav.Link href="#" onClick={handleClick}>
                ???
              </Nav.Link>
              <Nav.Link href="#skill" onClick={handleClick}>
                Skills
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
