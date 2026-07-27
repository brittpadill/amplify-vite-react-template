import { apiFetch } from "./client";

export async function getProjects() {
  return apiFetch("/projects");
}

