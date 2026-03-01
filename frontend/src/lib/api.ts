const BASE_URL = "http://localhost:5000/api";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = JSON.parse(
    localStorage.getItem("auth-storage") || "{}"
  )?.state?.token;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "API request failed");
  }

  return response.json();
};