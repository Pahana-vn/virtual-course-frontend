import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
const getToken = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === "token") {
            return value;
        }
    }
    return localStorage.getItem("token");
};

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("Token not found when calling API!");
    }
    return config;
}, (error) => Promise.reject(error));

export default api;
