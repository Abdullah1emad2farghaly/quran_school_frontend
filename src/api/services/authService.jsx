import api from "./api"


export const SignIn = async (userData) => {
    try {
        const res = await api.post("/auth/login", userData);
        console.log(res.data.data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
