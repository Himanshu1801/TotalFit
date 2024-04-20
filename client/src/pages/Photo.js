import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import {
  createPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
} from "../utils/API";
import Header from "../components/Header";

export default function Photo() {
  const [photoForm, setPhotoForm] = useState({
    userId: "",
    notes: "",
    image: null,
  });
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    // Fetch photos for the logged-in user
    const token = loggedIn ? Auth.getToken() : null;
    // console.log(token);
    // const userId = Auth.getUserId();

    const fetchPhotos = async () => {
      try {
        const response = await getPhotos(token);
        if (!response.ok) {
          throw new Error("Unable to fetch photos");
        }
        setPhotos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPhotos();
  }, [loggedIn]);

  const handlePhotoChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image" && files.length > 0) {
      setPhotoForm({ ...photoForm, [name]: files[0] });
    } else {
      setPhotoForm({ ...photoForm, [name]: value });
    }
  };

  const validateForm = (form) => {
    return form.image !== null;
  };

  const handlePhotoSubmit = async (event) => {
    event.preventDefault();

    const token = loggedIn ? Auth.getToken() : null;
    if (!token) return false;

    const userId = Auth.getUserId();

    if (validateForm(photoForm)) {
      try {
        console.log(photoForm);
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("notes", photoForm.notes);
        formData.append("image", photoForm.image);
        for (let [name, value] of formData) {
          console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
        }
        const response = await createPhoto(formData, token);
        console.log(response);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        setMessage("Photo successfully added!");
        setTimeout(() => {
          setMessage("");
        }, 3000);

        // Refresh photos
        // const fetchPhotos = async () => {
        //   try {
        //     const response = await getPhotoById(userId, token);
        //     if (!response.ok) {
        //       throw new Error("Unable to fetch photos");
        //     }
        //     setPhotos(response.data);
        //   } catch (error) {
        //     console.error(error);
        //   }
        // };

        // fetchPhotos();

        setPhotoForm({
          userId: "",
          notes: "",
          image: null,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeletePhoto = async (photoId) => {
    const token = Auth.getToken();

    try {
      const response = await deletePhoto(photoId, token);
      if (!response.ok) {
        throw new Error("Unable to delete photo");
      }

      setMessage("Photo successfully deleted!");
      setTimeout(() => {
        setMessage("");
      }, 3000);

      // Refresh photos
      const userId = Auth.getUserId();
      const fetchPhotos = async () => {
        try {
          const response = await getPhotoById(userId, token);
          if (!response.ok) {
            throw new Error("Unable to fetch photos");
          }
          setPhotos(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchPhotos();
    } catch (error) {
      console.error(error);
    }
  };

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="progress-photos">
      <Header />
      <div className="d-flex flex-column align-items-center">
        <h2 className="title text-center">Add Progress Photo</h2>
        <form
          className="photo-form d-flex flex-column"
          onSubmit={handlePhotoSubmit}
        >
          <label>Notes:</label>
          <input
            type="text"
            name="notes"
            id="notes"
            placeholder="Enter notes"
            value={photoForm.notes}
            onChange={handlePhotoChange}
          />
          <label>Upload Photo:</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handlePhotoChange}
          />
          <button
            className="submit-btn photo-submit-btn"
            type="submit"
            disabled={!validateForm(photoForm)}
          >
            Add
          </button>
        </form>
        <p className="message">{message}</p>
        <div className="photos-container">
          {photos?.map((photo) => (
            <div key={photo._id} className="photo-item">
              <img
                src={`data:${photo.contentType};base64,${Buffer.from(
                  photo.image.data
                ).toString("base64")}`}
                alt={photo.notes}
              />
              <button onClick={() => handleDeletePhoto(photo._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
