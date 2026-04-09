import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Register.css";
import { motion } from "framer-motion"; // 1. Import Framer Motion

import userIcon from "../../assets/logo2.svg";
import lockIcon from "../../assets/logo3.svg";
import emailIcon from "../../assets/logo1.svg";
import mainLogo from "../../assets/logo-labatrack.png";

function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [storeName, setStoreName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post("/api/auth/signup", {
                store_name: storeName,
                email: email,
                password: password
            });
            alert(response.data.message || "Pendaftaran Berhasil!");
            navigate("/login");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Terjadi kesalahan pada server";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                {/* 2. Tambahkan motion.div dengan animasi slide dari kiri */}
                <motion.div 
                    className="auth-left"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        className="logo"
                        src={mainLogo}
                        alt="Logo Labatrack"
                        id="logo"
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    />
                    <h1>Selamat Datang!</h1>
                    <p>Ayo! Mulai Mengelola Keuangan dan Pemasukan Kamu di Labatrack</p>
                    <p style={{ marginTop: "10px", fontSize: "12px" }}>Sudah punya akun?</p>
                    <button className="btn-orange" onClick={() => navigate("/login")}>
                        Masuk Sekarang
                    </button>
                </motion.div>

                {/* 3. Tambahkan motion.div dengan animasi slide dari kanan */}
                <motion.div 
                    className="auth-right"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h2 
                        initial={{ y: -19, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Buat Akun Baru
                    </motion.h2>
                    <p>Lengkapi info di bawah untuk mendaftarkan tokomu</p>

                    <form className="auth-form" onSubmit={handleRegister}>
                        {/* 4. Animasi stagger (muncul satu per satu) pada input */}
                        {[ 
                            { icon: userIcon, val: storeName, set: setStoreName, ph: "Nama Toko", type: "text" },
                            { icon: emailIcon, val: email, set: setEmail, ph: "Email Aktif", type: "email" },
                            { icon: lockIcon, val: password, set: setPassword, ph: "Password", type: "password" }
                        ].map((input, i) => (
                            <motion.div 
                                className="input-group" 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                            >
                                <img src={input.icon} className="input-icon" alt="icon" />
                                <input 
                                    type={input.type} 
                                    placeholder={input.ph} 
                                    value={input.val}
                                    onChange={(e) => input.set(e.target.value)}
                                    required 
                                />
                            </motion.div>
                        ))}

                        <motion.button 
                            type="submit" 
                            className="btn-green" 
                            disabled={isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            {isLoading ? "Sedang Memproses..." : "Daftar Gratis"}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default Register;