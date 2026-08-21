import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // send and receive cookies
});

// Optional Extra 9.1
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    if (status === 401 && !url.includes("/auth/me")) {
        // Here we could dispatch a logout or trigger an event
        console.warn("Unauthorized API call intercepted.");
    }
    return Promise.reject(error); // always re-reject
  }
);

export default api;
