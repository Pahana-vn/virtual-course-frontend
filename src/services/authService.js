import api from "../untils/api";

export const login = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        const { token, accountId, studentId } = response.data;

        if (token) {
            document.cookie = `token=${token}; path=/; Secure; HttpOnly; SameSite=Strict`;
            localStorage.setItem("token", token);
            localStorage.setItem("accountId", accountId);
            if (studentId) {
                localStorage.setItem("studentId", studentId);
                window.dispatchEvent(new Event("storage")); // 🔹 Cập nhật `storage`
            }
        }

        return response.data;
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error);
        throw error;
    }
};



export const register = async (username, email, password, role = "STUDENT") => {
    const payload = {
        username,
        email,
        password,
        role,
    };

    const response = await api.post("/auth/register", payload);
    return response.data;
};

export const logout = async () => {
    try {
        await api.post("/auth/logout"); // Gọi API logout
        localStorage.removeItem("token"); // Xóa token từ LocalStorage
        localStorage.removeItem("user");  // Xóa user data
        window.location.reload(); // Reload lại trang để cập nhật UI
    } catch (error) {
        console.error("Error logging out:", error);
    }
};


