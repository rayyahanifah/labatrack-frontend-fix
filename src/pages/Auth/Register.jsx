import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Pastikan path ke api.js sudah benar
import "./Register.css";

// Import Asset (Pastikan file-nya ada di folder assets)
import userIcon from "../../assets/logo2.svg";
import lockIcon from "../../assets/logo3.svg";
import emailIcon from "../../assets/logo1.svg";
import mainLogo from "../../assets/logo-labatrack.png";

function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // State untuk menampung input user
    const [storeName, setStoreName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mengirim data ke backend menggunakan instance axios 'api'
            const response = await api.post("/api/auth/signup", {
                store_name: storeName,
                email: email,
                password: password
            });

            // Jika sukses, munculkan pesan dan pindah ke login
            alert(response.data.message || "Pendaftaran Berhasil!");
            navigate("/login");

        } catch (err) {
            // Mengambil pesan error dari backend (Supabase/Node.js)
            const errorMessage = err.response?.data?.message || "Terjadi kesalahan pada server";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                {/* PANEL KIRI: Branding & Navigasi ke Login */}
                <div className="auth-left">
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
                </div>

                {/* PANEL KANAN: Form Register */}
                <div className="auth-right">
                    <h2>Buat Akun Baru</h2>
                    <p>Lengkapi info di bawah untuk mendaftarkan tokomu</p>

                    <form className="auth-form" onSubmit={handleRegister}>
                        {/* Input Nama Toko */}
                        <div className="input-group">
                            <img src={userIcon} className="input-icon" alt="user" />
                            <input 
                                type="text" 
                                placeholder="Nama Toko" 
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required 
                            />
                        </div>

                        {/* Input Email */}
                        <div className="input-group">
                            <img src={emailIcon} className="input-icon" alt="email" />
                            <input 
                                type="email" 
                                placeholder="Email Aktif" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        {/* Input Password */}
                        <div className="input-group">
                            <img src={lockIcon} className="input-icon" alt="lock" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        {/* Tombol Submit */}
                        <button type="submit" className="btn-green" disabled={isLoading}>
                            {isLoading ? "Sedang Memproses..." : "Daftar Gratis"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;