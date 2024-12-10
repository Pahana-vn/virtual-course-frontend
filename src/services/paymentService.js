import api from "../untils/api";

export const executePaypalPayment = async (paymentId, payerId) => {
    try {
        const response = await api.post(`/payment/execute-paypal-payment?paymentId=${paymentId}&payerId=${payerId}`);
        return response.data;
    } catch (error) {
        console.error("Error executing PayPal payment:", error);
        throw error;
    }
};

export const createPaypalPayment = async (courseId) => {
    const response = await api.post(`/payment/create-paypal-payment?courseId=${courseId}`);
    return response.data;
};

export const createPaypalPaymentForCart = async (courseIds) => {
    const response = await api.post('/payment/create-paypal-payment-multiple', courseIds);
    return response.data; // approval_url
};