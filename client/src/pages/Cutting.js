import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import { getCuttingFoods } from "../utils/API";
import Header from "../components/Header";

export default function Cutting() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male"); // default to male
  const [foods, setFoods] = useState([]);
  const [proteinGoal, setProteinGoal] = useState(0);
  const [kcal, setKcal] = useState(0);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loggedIn = Auth.loggedIn();

  const handleWeightChange = (event) => {
    const { value } = event.target;
    if (isNaN(value) || value <= 0) {
      setWeight("");
      setErrorMessage("Please enter a valid weight");
    } else {
      setWeight(parseFloat(value));
      setErrorMessage("");
    }
  };

  const handleHeightChange = (event) => {
    const { value } = event.target;
    setHeight(parseFloat(value));
  };

  const handleAgeChange = (event) => {
    const { value } = event.target;
    setAge(parseFloat(value));
  };

  const handleGenderChange = (event) => {
    const { value } = event.target;
    setGender(value);
  };

  const handleCuttingSubmit = async (event) => {
    event.preventDefault();

    const token = loggedIn ? Auth.getToken() : null;
    if (!token) return false;

    try {
      const weightInKg = weight; // The weight entered by the user
      const heightInCm = height; // The height entered by the user
      const ageInYears = age; // The age entered by the user

      const response = await getCuttingFoods(
        weightInKg,
        heightInCm,
        ageInYears,
        gender,
        token
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      setFoods(response.data.foods);
      setProteinGoal(response.data.proteinGoal);
      setKcal(response.data.calorieNeeds);
      setMessage("Food suggestions for cutting loaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error loading food suggestions!");
    }
  };

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="cutting">
      <Header />
      <div className="d-flex flex-column align-items-center">
        <h2 className="title text-center">Cutting</h2>
        <form
          className="cutting-form d-flex flex-column"
          onSubmit={handleCuttingSubmit}
        >
          {errorMessage && <p className="error">{errorMessage}</p>}

          <label>Weight (kg):</label>
          <input
            type="number"
            name="weight"
            id="weight"
            placeholder="70"
            value={weight}
            onChange={handleWeightChange}
          />

          <label>Height (cm):</label>
          <input
            type="number"
            name="height"
            id="height"
            placeholder="170"
            value={height}
            onChange={handleHeightChange}
          />

          <label>Age:</label>
          <input
            type="number"
            name="age"
            id="age"
            placeholder="30"
            value={age}
            onChange={handleAgeChange}
          />

          <label>Gender:</label>
          <select
            name="gender"
            id="gender"
            value={gender}
            onChange={handleGenderChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button
            className="submit-btn cutting-submit-btn"
            type="submit"
            disabled={!weight || !height || !age}
          >
            Get Food Suggestions
          </button>
        </form>
        <p className="message">{message}</p>
        <div className="food-list">
          <h3>Top Foods for Cutting:</h3>
          <p>
            <strong>Protein Goal:</strong> {proteinGoal} g
          </p>
          <p>
            <strong>Calories:</strong> {kcal} kCal
          </p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Protein (g)</th>
                <th>Fat (g)</th>
                <th>Carbs (g)</th>
                <th>Calories (kCal)</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={food.recipe}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{food.name}</b>
                    </Link>
                  </td>
                  <td>{food.protein} g</td>
                  <td>{food.fat} g</td>
                  <td>{food.carbs} g</td>
                  <td>{food.calories} kCal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}