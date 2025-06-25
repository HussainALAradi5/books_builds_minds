const API_URL = import.meta.env.VITE_API_URL;

const parseJSON = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }
  return data;
};

const registerUser = async ({ user_name, email, password }) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, email, password }),
  });

  return await parseJSON(response);
};

const loginUser = async ({ user_name_or_email, password }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name_or_email, password }),
  });

  const data = await parseJSON(response);
  const profile = await fetchUserProfile(data.user_id, data.token);

  return { ...data, profile };
};

const fetchUserProfile = async (user_id, token) => {
  const response = await fetch(`${API_URL}/profile/${user_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseJSON(response);
};

const editUser = async ({ user_id, token, updatedData }) => {
  const response = await fetch(`${API_URL}/profile/${user_id}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  return await parseJSON(response);
};

const addBook = async (bookData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });

  return await parseJSON(response);
};

const fetchAllBooks = async () => {
  const response = await fetch(`${API_URL}/book`, {
    method: "GET",
  });

  return await parseJSON(response);
};

const fetchBookById = async (book_id) => {
  const response = await fetch(`${API_URL}/book/${book_id}`, {
    method: "GET",
  });

  return await parseJSON(response);
};

const purchaseBook = async (book_id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/book/${book_id}/purchase`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseJSON(response);
};

const fetchPurchasedBooks = async (user_id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/profile/${user_id}/books`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseJSON(response);
};

export {
  registerUser,
  loginUser,
  fetchUserProfile,
  editUser,
  addBook,
  fetchAllBooks,
  fetchBookById,
  purchaseBook,
  fetchPurchasedBooks,
};
