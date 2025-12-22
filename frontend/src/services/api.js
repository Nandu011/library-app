const API_URL = "http://localhost:5000/api";

export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
       Authorization: `Bearer ${token}`,
       "Content-Type": "application/json"
    };
}

export default API_URL;