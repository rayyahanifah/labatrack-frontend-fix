import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Pastikan path ke api.js benar
import "./LoginPage.css";
import laba from "../../assets/logo-labatrack.png";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Memanggil API Login menggunakan instance 'api'
            const response = await api.post("/api/auth/login", { 
                email, 
                password 
            });

            alert(response.data.message);
            
            // Simpan data user ke localStorage jika perlu (opsional)
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Jika login sukses, arahkan ke Dashboard
            navigate("/dashboard");

        } catch (err) {
            // Mengambil pesan error dari backend (User tidak ditemukan / Password salah)
            const errorMessage = err.response?.data?.message || "Login Gagal, coba lagi!";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">Segera Masuk!</h2>
                <img
                    src={laba}
                    alt="Logo LabaTrack"
                    className="logo-labatrack2"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                />
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Masukan email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Masukan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input password-input"
                            required
                        />
                    </div>

                    <div className="forgot-password-container">
                        <a href="/forgot-password" className="forgot-password-link">
                            Lupa password?
                        </a>
                    </div>

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <div className="register-container">
                    <p className="register-text">
                        Belum punya akun?{" "}
                        <span 
                            onClick={() => navigate("/register")} 
                            className="register-link"
                            style={{ cursor: "pointer" }}
                        >
                            Daftar
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;