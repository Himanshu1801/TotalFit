import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Auth from "../utils/auth"
// import logo from "../assets/images/logotransparent.png"
import logo from "../assets/images/logo.jpg"

export default function Header() {

  const loggedIn = Auth.loggedIn();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';


  return (

    <Navbar collapseOnSelect expand="sm" variant="dark" bg={loggedIn && !isHomePage ? "dark" : null}>
      {loggedIn ? (
        <>
          <Navbar.Brand as={Link} to="/" className="brand brand-logged d-flex align-items-center">
            <img alt="logo" style={{ display: "inline" }} src={logo} className="logo" />
            TotalFit
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav >
              {/* use eventKey to show navbar style from react bootstrap */}
              <Nav.Link as={Link} to="/exercise" eventKey="1" >Exercise</Nav.Link>
              <Nav.Link as={Link} to="/history" eventKey="2">History</Nav.Link>
              <Nav.Link as={Link} to="/posture_checker" eventKey="3">Posture Checker</Nav.Link>
              <Nav.Link as={Link} to="/nutrition" eventKey="4">Nutrition</Nav.Link>
              <Nav.Link as={Link} to="/gallery" eventKey="5">Photos</Nav.Link>
              <Nav.Link onClick={Auth.logout} >Logout </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>) :
        (<Navbar.Brand as={Link} to="/" className={`brand brand-new mx-auto d-flex align-items-center
          ${isLoginPage || isSignupPage ? "brand-text" : null}`}>
          <img alt="logo" style={{ display: "inline" }} src={logo} className="logo" />
          TotalFit
        </Navbar.Brand>)}
    </Navbar >
  );
}
