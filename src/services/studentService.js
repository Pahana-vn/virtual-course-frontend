import api from "../untils/api";

export const fetchStudentByStudentId = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}`); // API mới lấy theo studentId
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy Student theo Student ID:", error);
        throw error;
    }
};

// ✅ Lấy thông tin Dashboard của Student
export const fetchStudentDashboardData = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}/dashboard`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy Dashboard:", error);
        throw error;
    }
};


// ✅ Lấy danh sách khóa học của Student
export const fetchStudentCourses = async (studentId) => {
    try {
        const response = await api.get(`/students/student-courses-status/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách khóa học:", error);
        throw error;
    }
};

export const fetchWishlist = async (studentId) => {
    try {
        const response = await api.get(`/favorite/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy Wishlist:", error);
        throw error;
    }
};

// ✅ Thêm khóa học vào Wishlist
export const addCourseToWishlist = async (studentId, courseId) => {
    try {
        const wishlist = await fetchWishlist(studentId);
        const isCourseInWishlist = wishlist.some(course => course.id === courseId);

        if (isCourseInWishlist) {
            console.log("❌ Khóa học đã có trong wishlist.");
            return { success: false, message: "Khóa học đã có trong wishlist." };
        }

        const response = await api.post(`/students/${studentId}/wishlist`, { id: courseId });
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi thêm vào Wishlist:", error.response ? error.response.data : error);
        throw error;
    }
};

// ✅ Thêm khóa học vào Cart
export const addCourseToCart = async (studentId, courseData) => {
    console.log("📌 Gửi request thêm vào Cart:", studentId, courseData);
    try {
        const response = await api.post(`/students/${studentId}/cart`, courseData);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi thêm vào Cart:", error.response ? error.response.data : error);
        throw error;
    }
};

// ✅ Lấy danh sách khóa học trong Cart
export const fetchCartItems = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}/cart-items`);
        return response.data; // Ensure the response contains the expected data
    } catch (error) {
        console.error("❌ Error fetching cart items:", error);
        throw error;
    }
};

// ✅ Xóa khóa học khỏi Cart
export const removeCourseFromCart = async (studentId, cartItemId) => {
    try {
        const response = await api.delete(`/students/${studentId}/cart-items/${cartItemId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi xóa khỏi Cart:", error);
        throw error;
    }
};

// ✅ Xóa khóa học khỏi Wishlist
export const removeCourseFromWishlist = async (studentId, courseId) => {
    try {
        const response = await api.delete(`/students/${studentId}/wishlist/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi xóa khỏi Wishlist:", error);
        throw error;
    }
};

// ✅ Lấy danh sách đơn hàng của sinh viên
export const fetchStudentOrders = async (studentId) => {
    try {
        const response = await api.get(`/transactions/history/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
        throw error;
    }
};

// ✅ Lấy thông tin hóa đơn theo orderId
export const fetchInvoiceDetails = async (transactionId) => {
    try {
        const response = await api.get(`/transactions/history/details/${transactionId}`);  // ✅ API ĐÚNG
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết hóa đơn:", error);
        throw error;
    }
};


