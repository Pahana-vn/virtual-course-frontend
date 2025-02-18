import api from "../utils/api";

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
                window.dispatchEvent(new Event("storage"));
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
        await api.post("/auth/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("accountId");
        localStorage.removeItem("studentId");
        window.location.reload();
    } catch (error) {
        console.error("Error logging out:", error);
    }
};


