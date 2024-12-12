import api from "../untils/api";

export const fetchStudentByAccountId = async (accountId) => {
    try {
        const response = await api.get(`/students/by-account/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student by account ID:", error);
        throw error;
    }
};

export const fetchStudentDashboardData = async (accountId) => {
    try {
        const response = await api.get(`/students/dashboard/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};

// export const fetchStudentCourses = async (studentId) => {
//     try {
//         const response = await api.get(`/courses/student-courses/${studentId}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching student courses:", error);
//         throw error;
//     }
// };

export const fetchStudentCourses = async (studentId) => {
    try {
        // Đổi đường dẫn sang endpoint mới đã tạo
        const response = await api.get(`/students/student-courses-status/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student courses:", error);
        throw error;
    }
};


export const addCourseToWishlist = async (studentId, courseId) => {
    try {
        const response = await api.post(`/students/${studentId}/wishlist`, { id: courseId });
        return response.data;
    } catch (error) {
        console.error("Error adding course to wishlist:", error.response ? error.response.data : error);
        throw error;
    }
};

export const addCourseToCart = async (studentId, courseData) => {
    try {
        const response = await api.post(`/students/${studentId}/cart`, courseData);
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error.response ? error.response.data : error);
        throw error;
    }
};

export const fetchCartItems = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}/cart-items`);
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error("Invalid cart data");
        }
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
        console.error("Error removing course from cart:", error);
        throw error;
    }
};