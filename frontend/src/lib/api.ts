const BASE_URL = "http://localhost:5000/api";

export const apiFetch = (endpoint: string, options: RequestInit = {}) => {
  const token = JSON.parse(
    localStorage.getItem("auth-storage") || "{}"
  )?.state?.token;

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};