import api from "../untils/api";

export const completeLecture = async (studentId, lectureId) => {
    try {
        await api.post(`/progress/complete-lecture?studentId=${studentId}&lectureId=${lectureId}`);
    } catch (error) {
        console.error("Error marking lecture as complete:", error);
        throw error;
    }
};