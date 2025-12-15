const API_URL = "http://localhost:5000/api";

export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export default API_URL;