import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; 
import "./LoginPage.css";
import laba from "../../assets/logo-labatrack.png";
import { motion } from "framer-motion"; // 1. Import Framer Motion

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/api/auth/login", { 
                email, 
                password 
            });

            alert(response.data.message);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard");

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login Gagal, coba lagi!";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* 2. Tambahkan motion.div pada login-card agar muncul dengan efek zoom-in lembut */}
            <motion.div 
                className="login-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <motion.h2 
                    className="login-title"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Segera Masuk!
                </motion.h2>

                <motion.img
                    src={laba}
                    alt="Logo LabaTrack"
                    className="logo-labatrack2"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }} // Efek saat logo di-hover
                />
                
                <form onSubmit={handleSubmit} className="login-form">
                    {/* 3. Animasi pada input group */}
                    <motion.div 
                        className="input-group"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <input
                            type="email"
                            placeholder="Masukan email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                        />
                    </motion.div>

                    <motion.div 
                        className="input-group"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <input
                            type="password"
                            placeholder="Masukan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input password-input"
                            required
                        />
                    </motion.div>

                    <motion.button 
                        type="submit" 
                        className="btn-login" 
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {isLoading ? "Memproses..." : "Masuk"}
                    </motion.button>
                </form>

                {/* 4. Animasi pada link daftar */}
                <motion.div 
                    className="register-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
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
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Login;