import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import { createResistance } from '../utils/API';
import Header from "./Header";
import resistanceIcon from "../assets/images/resistance-w.png";
import exercisesData from '../assets/exercises.json';

export default function Resistance() {
    const [resistanceForm, setResistanceForm] = useState({
        name: "",
        weight: "",
        sets: "",
        reps: "",
        date: ""
    });
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const loggedIn = Auth.loggedIn();
    const [exercises, setExercises] = useState([]); // State for exercises

    useEffect(() => {
        // Set exercises state with JSON data
        setExercises(exercisesData);
    }, []);

    const handleDateChange = date => {
        setStartDate(date);
        handleResistanceChange({
            target: { name: "date", value: date }
        });
    };

    const handleResistanceChange = (event) => {
        const { name, value } = event.target;
        setResistanceForm({ ...resistanceForm, [name]: value });
    };

    const validateForm = (form) => {
        return form.name && form.weight && form.sets && form.reps && form.date;
    };

    const handleResistanceSubmit = async (event) => {
        event.preventDefault();

        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        const userId = Auth.getUserId();

        if (validateForm(resistanceForm)) {
            try {
                resistanceForm.userId = userId;

                const response = await createResistance(resistanceForm, token);

                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                setMessage("Resistance successfully created!");
                setTimeout(() => {
                    setMessage("");
                }, 3000);

            } catch (err) {
                console.error(err);
            }
        }

        setResistanceForm({
            name: "",
            weight: "",
            sets: "",
            reps: "",
            date: ""
        });
    };

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='resistance'>
            <Header />
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Exercise</h2>
                <form className='resistance-form d-flex flex-column' onSubmit={handleResistanceSubmit}>
                    <div className='d-flex justify-content-center'><img alt="resistance" src={resistanceIcon} className="exercise-form-icon" /></div>
                    <label>Select or Type Exercise:</label>
                    <input 
                        type="text" 
                        list="exercisesList" 
                        name="name" 
                        id="name" 
                        placeholder="Type or select an exercise" 
                        value={resistanceForm.name} 
                        onChange={handleResistanceChange} 
                    />
                    <datalist id="exercisesList">
                        {exercises.map((exercise) => (
                            <option key={exercise.id} value={exercise.name} />
                        ))}
                    </datalist>
                    <label>Weight (lbs):</label>
                    <input type="number" name="weight" id="weight" placeholder="0"
                        value={resistanceForm.weight} onChange={handleResistanceChange} />
                    <label>Sets:</label>
                    <input type="number" name="sets" id="sets" placeholder="0"
                        value={resistanceForm.sets} onChange={handleResistanceChange} />
                    <label>Reps:</label>
                    <input type="number" name="reps" id="reps" placeholder="0"
                        value={resistanceForm.reps} onChange={handleResistanceChange} />
                    <label>Date:</label>
                    <DatePicker selected={startDate} value={resistanceForm.date} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                    <button className='submit-btn' type="submit" disabled={!validateForm(resistanceForm)}>Add</button>
                </form>
                <p className='message'>{message}</p>
            </div>
        </div>
    );
}
