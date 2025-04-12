import axios from 'axios';

const API = axios.create({
  baseURL: 'https://notes-backend-doza.onrender.com',
});

export default API;
