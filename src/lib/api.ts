const API_URL =
  "https://fw6oikvho9.execute-api.us-west-2.amazonaws.com/prod";

export async function getProjects(idToken: string) {
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}
