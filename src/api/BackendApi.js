import axios from 'axios';

const Instance = axios.create({
  baseURL: "http://localhost:3001", // Correct usage
  headers: { 'Content-Type': 'application/json' }
});

export default Instance;
