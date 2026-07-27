import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL =
  "https://i5y6pw0ex7.execute-api.us-west-2.amazonaws.com/prod";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const session = await fetchAuthSession();

  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("No authenticated user found.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
