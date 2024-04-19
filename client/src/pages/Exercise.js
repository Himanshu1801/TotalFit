import React from "react";
import { Link, Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import Header from "../components/Header";
import cardio from "../assets/images/blackrunning.jpg";
import resistance from "../assets/images/blackdumbell.png";
export default function Exercise() {
  const loggedIn = Auth.loggedIn();

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="title">Exercise</h1>
        <div className="linkContainer">
          <Link to="/exercise/cardio" className="link">
            <img src={cardio} alt="cardio" className="image" />
            <p className="text">Cardio</p>
          </Link>
          <Link to="/exercise/resistance" className="link">
            <img src={resistance} alt="Resistance" className="image" />
            <p className="text">Resistance</p>
          </Link>
        </div>
      </div>
    </>
  );
}
