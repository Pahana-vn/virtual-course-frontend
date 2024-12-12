import api from "../untils/api";

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
        const response = await api.get(`/courses/${courseId}/details`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course details for ID ${courseId}:`, error);
        throw error;
    }
};

export const fetchCourseById = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}`); // Assuming this is the correct endpoint
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with ID ${courseId}:`, error);
        throw error;
    }
};



