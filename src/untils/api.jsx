import axios from "axios";

// ✅ Hàm lấy token từ Cookie hoặc LocalStorage
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

// ✅ Cấu hình Axios
const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ Cho phép gửi Cookie giữa frontend & backend
});

// ✅ Interceptor để tự động thêm token vào request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("⚠️ Không tìm thấy token khi gọi API!");
    }
    return config;
}, (error) => Promise.reject(error));

export default api;
