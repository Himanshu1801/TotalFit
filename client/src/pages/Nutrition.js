import React from "react";
import Header from "../components/Header";
import bulk from "../assets/images/bulk.jpg";
import cut from "../assets/images/cut.jpg";
import { Link } from "react-router-dom";
import "../index.css";

const Nutrition = () => {
  return (
    <>
      <Header />
      <div className="container">
        <h1 className="title">Nutrition</h1>
        <div className="linkContainer">
          <Link to="/nutrition/bulking" className="link">
            <img src={bulk} alt="bulking" className="image" />
            <p className="text">Bulking</p>
          </Link>
          <Link to="/nutrition/cutting" className="link">
            <img src={cut} alt="Cutting" className="image" />
            <p className="text">Cutting</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Nutrition;
