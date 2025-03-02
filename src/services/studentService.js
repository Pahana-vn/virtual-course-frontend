import api from "../utils/api";

export const fetchStudentByStudentId = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error when getting Student by Student ID:", error);
        throw error;
    }
};

export const updateStudentProfile = async (studentId, studentData) => {
    try {
        const response = await api.put(`/students/${studentId}`, studentData);
        return response.data;
    } catch (error) {
        console.error("Error updating student profile:", error);
        throw error;
    }
};

export const fetchStudentDashboardData = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Error when getting Dashboard:", error);
        throw error;
    }
};

export const fetchStudentCourses = async (studentId) => {
    try {
        const response = await api.get(`/students/student-courses-status/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error while getting course list:", error);
        throw error;
    }
};

export const fetchWishlist = async (studentId) => {
    try {
        const response = await api.get(`/favorite/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error while getting Wishlist:", error);
        throw error;
    }
};

export const addCourseToWishlist = async (studentId, courseId) => {
    try {
        const wishlist = await fetchWishlist(studentId);
        const isCourseInWishlist = wishlist.some(course => course.id === courseId);

        if (isCourseInWishlist) {
            return { success: false, message: "The course is already in the wishlist." };
        }

        const response = await api.post(`/students/${studentId}/wishlist`, { id: courseId });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error adding to Wishlist:", error.response ? error.response.data : error);
        throw error;
    }
};

export const addCourseToCart = async (studentId, courseData) => {
    console.log("Send request to add to Cart:", studentId, courseData);
    try {
        const response = await api.post(`/students/${studentId}/cart`, courseData);
        return response.data;
    } catch (error) {
        console.error("Error adding to Cart:", error.response ? error.response.data : error);
        throw error;
    }
};

export const fetchCartItems = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}/cart-items`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        throw error;
    }
};

export const removeCourseFromCart = async (studentId, cartItemId) => {
    try {
        const response = await api.delete(`/students/${studentId}/cart-items/${cartItemId}`);
        return response.data;
    } catch (error) {
        console.error("Error while removing from Cart:", error);
        throw error;
    }
};

export const removeCourseFromWishlist = async (studentId, courseId) => {
    try {
        const response = await api.delete(`/students/${studentId}/wishlist/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error while removing from Wishlist:", error);
        throw error;
    }
};

export const fetchStudentOrders = async (studentId) => {
    try {
        const response = await api.get(`/transactions/history/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error when getting order list:", error);
        throw error;
    }
};

export const fetchInvoiceDetails = async (transactionId) => {
    try {
        const response = await api.get(`/transactions/history/details/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting invoice details:", error);
        throw error;
    }
};

export const fetchStudentCourseProgress = async (studentId) => {
    try {
        const response = await api.get(`/students/student-courses/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting student course progress details:", error);
        throw error;
    }
};

export const fetchStudentQuizResults = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}/quiz-results`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách bài kiểm tra:", error);
        throw error;
    }
};

export const fetchStudentQuizDetails = async (quizId) => {
    try {
        const response = await api.get(`/students/quiz-details/${quizId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết bài kiểm tra:", error);
        throw error;
    }
};

export const changeStudentPassword = async (studentId, passwordData) => {
    try {
        const response = await api.put(`/students/${studentId}/change-password-student`, passwordData);
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteStudentAccount = async (studentId, password) => {
    try {
        const response = await api.delete(`/students/${studentId}/delete-account-student`, {
            data: { password }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting account:", error.response ? error.response.data : error);
        throw error;
    }
};
