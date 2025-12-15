import {useState} from "react";
import API_URL from "../services/api";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const res = await axios.post(`${API_URL}/users/login`, {
                mobile,
                password,
            });

            //Save auth info
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("name", res.data.name);

            // Redirect admin
            if (res.data.role === "admin") {
                navigate("/admin");
            } else {
                alert("You are not an admin");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "100px auto"}}>
            <h2>🔐 Admin Login</h2>

            {error && <p style={{color: "red"}}>{error}</p>}
            
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required 
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br /><br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}