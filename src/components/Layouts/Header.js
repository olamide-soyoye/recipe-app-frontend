import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Header.css";

export default function Header() {
  return (
    <Navbar bg="light" expand="lg" className="nav-height">
      <Container>
        <Navbar.Brand href="#">
          <h2 className="">
            <span className="text-success">Crockpot</span>
            <span className="text-info">Recipe~</span>
            {/* <span> Receipe</span> */}
          </h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#" className="active">
              Home
            </Nav.Link>
            {/* <Nav.Link href="#">Common Food</Nav.Link>
            <Nav.Link href="#">Foreign</Nav.Link>
            <Nav.Link href="#">tofu</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
