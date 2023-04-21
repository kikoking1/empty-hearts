import axios from "axios";
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://localhost:7083"
    : "https://empty-hearts.com";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
