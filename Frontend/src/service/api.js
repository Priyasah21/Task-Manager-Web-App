import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/tasks",
});

export default API;
