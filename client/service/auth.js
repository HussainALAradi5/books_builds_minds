const API_URL = import.meta.env.VITE_API_URL;
console.log('API_URL',API_URL);

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
  console.log("response:",response);
  
  return await parseJSON(response);
};

const loginUser = async ({ user_name_or_email, password }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name_or_email, password }),
  });

  return await parseJSON(response);
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

export {
  registerUser,
  loginUser,
  fetchUserProfile,
  editUser,
};