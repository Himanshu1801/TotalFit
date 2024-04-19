import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import { createCardio } from '../utils/API';
import Header from "./Header";
import cardioIcon from "../assets/images/cardio-w.png";
import cardioExercisesData from '../assets/cardio.json'; // Import JSON data

export default function Cardio() {
    const [cardioForm, setCardioForm] = useState({
        name: "",
        distance: "",
        duration: "",
        date: ""
    });
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const loggedIn = Auth.loggedIn();
    const [cardioExercises, setCardioExercises] = useState([]); // State for cardio exercises

    useEffect(() => {
        // Set cardio exercises state with JSON data
        setCardioExercises(cardioExercisesData);
    }, []);

    const handleCardioChange = (event) => {
        const { name, value } = event.target;
        setCardioForm({ ...cardioForm, [name]: value });
    };

    const handleDateChange = date => {
        setStartDate(date);
        handleCardioChange({
            target: { name: "date", value: date }
        });
    };

    const validateForm = (form) => {
        return form.name && form.distance && form.duration && form.date;
    };

    const handleCardioSubmit = async (event) => {
        event.preventDefault();

        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        const userId = Auth.getUserId();

        if (validateForm(cardioForm)) {
            try {
                cardioForm.userId = userId;

                const response = await createCardio(cardioForm, token);

                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                setMessage("Cardio successfully added!");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } catch (err) {
                console.error(err);
            }
        }

        setCardioForm({
            name: "",
            distance: "",
            duration: "",
            date: ""
        });
    };

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='cardio'>
            <Header />
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Exercise</h2>
                <form className='cardio-form d-flex flex-column' onSubmit={handleCardioSubmit}>
                    <div className='d-flex justify-content-center'><img alt="cardio" src={cardioIcon} className="exercise-form-icon" /></div>
                    <label>Select or Type Exercise:</label>
                    <input 
                        type="text" 
                        list="cardioExercisesList" 
                        name="name" 
                        id="name" 
                        placeholder="Type or select an exercise" 
                        value={cardioForm.name} 
                        onChange={handleCardioChange} 
                    />
                    <datalist id="cardioExercisesList">
                        {cardioExercises.map((exercise) => (
                            <option key={exercise.id} value={exercise.name} />
                        ))}
                    </datalist>
                    <label >Distance (miles):</label>
                    <input type="number" name="distance" id="distance" placeholder="0"
                        value={cardioForm.distance} onChange={handleCardioChange} />
                    <label >Duration (minutes):</label>
                    <input type="number" name="duration" id="duration" placeholder="0"
                        value={cardioForm.duration} onChange={handleCardioChange} />
                    <label>Date:</label>
                    <DatePicker selected={startDate} value={cardioForm.date} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                    <button className='submit-btn cardio-submit-btn' type="submit" disabled={!validateForm(cardioForm)}>Add</button>
                </form>
                <p className='message'>{message}</p>
            </div>
        </div>
    );
}
