import api from "../utils/api";

export const fetchInstructors = async () => {
    try {
        const response = await api.get("/instructors");
        return response.data;
    } catch (error) {
        console.error("Error fetching instructors:", error);
        throw error;
    }
};
