import api from "../untils/api";

export const fetchChatHistory = async (user1Id, user2Id) => {
    try {
        const response = await api.get(`/chat/history?user1Id=${user1Id}&user2Id=${user2Id}`);
        return response.data; // trả về danh sách ChatMessage
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};
