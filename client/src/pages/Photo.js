import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import { createPhoto, getPhotos, deletePhoto } from "../utils/API";
import Header from "../components/Header";

export default function Photo() {
  const [photoForm, setPhotoForm] = useState({
    userId: "",
    notes: "",
    image: null,
  });
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loggedIn = Auth.loggedIn();

  const fetchPhotos = async () => {
    try {
      const token = loggedIn ? Auth.getToken() : null;
      const response = await getPhotos(token);

      if (response && response.length > 0) {
        setPhotos(response);
      } else {
        console.log("No photos found");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = loggedIn ? Auth.getToken() : null;
        const response = await getPhotos(token);

        if (response && response.length > 0) {
          setPhotos(response);
        } else {
          console.log("No photos found");
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
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
    return form.image !== null && form.image !== undefined && form.image !== "";
  };

  const handlePhotoSubmit = async (event) => {
    event.preventDefault();

    const token = loggedIn ? Auth.getToken() : null;
    if (!token) return false;

    const userId = Auth.getUserId();

    if (validateForm(photoForm)) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("notes", photoForm.notes);
        formData.append("image", photoForm.image);

        const response = await createPhoto(formData, token);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        setMessage("Photo successfully added!");
        setTimeout(() => {
          setMessage("");
        }, 3000);

        await fetchPhotos();

        setPhotoForm({
          userId: "",
          notes: "",
          image: null,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
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
      setPhotos([]);
      await fetchPhotos();
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
      <div className="content-container">
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
              disabled={!validateForm(photoForm) || isSubmitting}
            >
              Add
            </button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {photos?.length === 0 ? (
            <p className="no-photos-message">No photos available.</p>
          ) : (
            <div className="photos-container">
              {photos?.map((photo) => (
                <div key={photo._id} className="photo-item">
                  <img
                    src={`data:${photo.contentType};base64,${photo.image}`}
                    alt={photo.notes}
                    className="photo-image"
                  />
                  <div className="photo-overlay">
                    <p className="photo-date">
                      {new Date(photo.date).toLocaleDateString()}
                    </p>
                    <p className="photo-notes">{photo.notes}</p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePhoto(photo._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
