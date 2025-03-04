import api from "../utils/api";

export const fetchChatHistory = async (user1Id, user2Id) => {
    try {
        const response = await api.get(`chat/history?user1Id=${user1Id}&user2Id=${user2Id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};

export const fetchRecentChats = async (userId) => {
    try {
        const response = await api.get(`chat/recent-chats?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recent chats:", error);
        throw error;
    }
};

export const fetchRecentChatsForInstructor = async (instructorId) => {
    try {
        const response = await api.get(`chat/recent-chats-instructor?instructorId=${instructorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recent chats for instructor:", error);
        throw error;
    }
};

export const fetchInstructorInfo = async (instructorId) => {
    try {
        const response = await api.get(`/instructors/${instructorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching instructor info:", error);
        throw error;
    }
};

export const fetchStudentInfo = async (studentId) => {
    try {
        const response = await api.get(`/students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student info:", error);
        throw error;
    }
};

export const sendChatMessage = async (messageDTO) => {
    try {
        const response = await api.post("chat/sendMessage", messageDTO);
        return response.data;
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
    }
};

export const fetchStudentInfoByAccountId = async (accountId) => {
    try {
        const response = await api.get(`/students/by-account/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student info by account ID:", error);
        throw error;
    }
};