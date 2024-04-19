import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import squat from "../assets/images/squat.jpeg";
import pushup from "../assets/images/push_up.png";
import bicepCurl from "../assets/images/bicep_curl.jpg";
import Header from "../components/Header";

export default function PostureSelector() {
  return (
    <>
      <Header />
      <div className="container">
        <h1 className="title">Posture</h1>
        <div className="image-container">
          <Link to="/posture_checker/squat" className="image-link">
            <img src={squat} alt="Squats" className="exercise-image" />
            <p className="image-title">Squats</p>
          </Link>
          <Link to="/posture_checker/pushup" className="image-link">
            <img src={pushup} alt="Pushups" className="exercise-image" />
            <p className="image-title">Pushups</p>
          </Link>
          <Link to="/posture_checker/bicep_curl" className="image-link">
            <img src={bicepCurl} alt="Bicep Curls" className="exercise-image" />
            <p className="image-title">Bicep Curls</p>
          </Link>
        </div>
      </div>
    </>
  );
}
