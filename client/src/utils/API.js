// get logged in user's info

export const getMe = (token) => {
  return fetch("/api/user/me", {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  return fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return fetch("/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const createCardio = (cardioData, token) => {
  return fetch("/api/exercise/cardio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cardioData),
  });
};

export const createResistance = (resistanceData, token) => {
  return fetch("/api/exercise/resistance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resistanceData),
  });
};

export const getCardioById = (cardioId, token) => {
  return fetch(`/api/exercise/cardio/${cardioId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const getResistanceById = (resistanceId, token) => {
  return fetch(`/api/exercise/resistance/${resistanceId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCardio = (cardioId, token) => {
  return fetch(`/api/exercise/cardio/${cardioId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const deleteResistance = (resistanceId, token) => {
  return fetch(`/api/exercise/resistance/${resistanceId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const getBulkingFoods = (weight, height, age, gender, token) => {
  return fetch(
    `/api/nutrition/bulking-foods?weight=${weight}&height=${height}&age=${age}&gender=${gender}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return { ok: true, data };
    })
    .catch((error) => {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
      return { ok: false, message: error.message };
    });
};

export const getCuttingFoods = (weight, height, age, gender, token) => {
  return fetch(
    `/api/nutrition/cutting-foods?weight=${weight}&height=${height}&age=${age}&gender=${gender}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return { ok: true, data };
    })
    .catch((error) => {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
      return { ok: false, message: error.message };
    });
};

export const createPhoto = (photoData, token) => {
  const formData = new FormData();
  formData.append("userId", photoData.userId);
  formData.append("notes", photoData.notes);
  formData.append("image", photoData.image);

  return fetch("/api/gallery/photo", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const getPhotoById = (photoId, token) => {
  return fetch(`/api/gallery/photo/${photoId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const deletePhoto = (photoId, token) => {
  return fetch(`/api/gallery/photo/${photoId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
