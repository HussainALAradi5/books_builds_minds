const API_URL = import.meta.env.VITE_API_URL;

const parseJSON = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }
  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const fetchWithAuth = async (url, method = "GET", body = null) => {
  const options = {
    method,
    headers: getAuthHeaders(),
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  return parseJSON(response);
};

const isUserLoggedIn = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  return Boolean(token && userId);
};

const registerUser = async ({ user_name, email, password }) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, email, password }),
  });
  return parseJSON(response);
};

const loginUser = async ({ user_name_or_email, password }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name_or_email, password }),
  });

  const data = await parseJSON(response);
  const profile = await fetchUserProfile(data.user_id, data.token);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("is_admin", profile.is_admin);
  localStorage.setItem("username", profile.user_name);

  return { ...data, profile };
};

const fetchUserProfile = async (user_id, token) => {
  const response = await fetch(`${API_URL}/profile/${user_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return parseJSON(response);
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
  return parseJSON(response);
};

const addBook = async (bookData) =>
  fetchWithAuth(`${API_URL}/book`, "POST", bookData);

const fetchAllBooks = async () => {
  const response = await fetch(`${API_URL}/`);
  return parseJSON(response);
};

const fetchBookSlug = async (slug) => {
  const response = await fetch(`${API_URL}/book/${slug}`, {
    method: "GET",
  });
  return parseJSON(response);
};

const purchaseBook = async (slug) =>
  fetchWithAuth(`${API_URL}/book/${slug}/purchase`, "POST");

const fetchPurchasedBooks = async (user_id) => {
  const response = await fetch(`${API_URL}/profile/${user_id}/books`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return parseJSON(response);
};

// 📝 Reviews
const fetchBookReviews = async (slug) => {
  const response = await fetch(`${API_URL}/book/${slug}/review/`, {
    method: "GET",
  });
  return parseJSON(response);
};

const addReview = async (slug, reviewData) =>
  fetchWithAuth(`${API_URL}/book/${slug}/review`, "POST", reviewData);

const editReview = async (slug, review_id, updatedData) =>
  fetchWithAuth(
    `${API_URL}/book/${slug}/review/${review_id}`,
    "PUT",
    updatedData
  );

const deleteReview = async (slug, review_id) =>
  fetchWithAuth(`${API_URL}/book/${slug}/review/${review_id}`, "DELETE");

export {
  registerUser,
  loginUser,
  fetchUserProfile,
  editUser,
  addBook,
  fetchAllBooks,
  fetchBookSlug,
  purchaseBook,
  fetchPurchasedBooks,
  fetchBookReviews,
  addReview,
  editReview,
  deleteReview,
  isUserLoggedIn, 
};
