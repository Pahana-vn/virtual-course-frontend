import api from "../utils/api";

export const fetchCourses = async () => {
    try {
        const response = await api.get("/courses");
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const fetchCourseDetails = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}/course-details`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course details for ID ${courseId}:`, error);
        throw error;
    }
};

export const fetchCourseById = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with ID ${courseId}:`, error);
        throw error;
    }
};

export const fetchCourseDetailsForStudent = async (courseId, studentId) => {
    const response = await api.get(`/courses/${courseId}/details-for-student?studentId=${studentId}`);
    return response.data;
};
