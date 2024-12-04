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

export const fetchStudentCourses = async (accountId) => {
    try {
        const response = await api.get(`/courses/student-courses/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student courses:", error);
        throw error;
    }
};