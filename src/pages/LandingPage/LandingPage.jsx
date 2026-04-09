import { useState, useEffect, useRef } from "react";
import "./LandingPage.css";
import logoLabatrack from "../../assets/logo-labatrack.png";
import manekin from "../../assets/menekin.png";
import iconFinansial from "../../assets/iconfinansial.png";
import kasir from "../../assets/kasir.png";
import menejemenProduct from "../../assets/menejemenproduct.png";
import dbsLogo from "../../assets/dbs-logo.png";
import dicodingLogo from "../../assets/dicoding-logo.png";
import gmailIcon from "../../assets/gmail-icon.png";
import waIcon from "../../assets/whatsapp-icon.png";
import { useNavigate } from "react-router-dom";

/* ── Custom hook: fade-in when element enters viewport ── */
function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(el); // trigger hanya sekali
                }
            },
            { threshold: 0.15, ...options }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, inView];
}

function AnimatedCard({ item, delay }) {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className="card-item"
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(50px) scale(0.95)",
                transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
            }}
        >
            <div className="icon-box">
                <img src={item.img} alt={item.title} className="icon-img" />
            </div>
            <h2 className="title-card">{item.title}</h2>
            <p className="desc-card">{item.desc}</p>
        </div>
    );
}

function LandingPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Refs untuk section animations
    const [fiturRef, fiturInView] = useInView();
    const [footerRef, footerInView] = useInView();

    const dataFitur = [
        {
            title: "Financial Recording",
            desc: "Sistem akan mempresentasikan rugi dan laba dari harga yang ditentukan sejak awal",
            img: iconFinansial,
        },
        {
            title: "Manejament Product",
            desc: "Fitur yang dimana akan mempermudah anda dalam mengatur dagangan anda dengan menambahkan list jualan product anda",
            img: menejemenProduct,
        },
        {
            title: "Hitungin",
            desc: "Fitur untuk mempermudah anda dalam mengkalkulasikan list product anda di dalam web kami",
            img: kasir,
        },
    ];

    const onClick = () => {
        navigate("/register");
    };

    return (
        <div className="backround-color">
            {/* ── HEADER ── */}
            <header>
                <img
                    src={logoLabatrack}
                    alt="Logo LabaTrack"
                    className="logo-labatrack"
                />
                <span className="text-linklabahead">www.labatrack.com</span>
            </header>

            {/* ── HERO ── */}
            <main className="hero">
                {/* Teks kiri */}
                <div className="hero-text">
                    <h2>Kendalikan kondisi</h2>
                    <div className="highlight-box">
                        <h1>Labapenjualanmu</h1>
                    </div>
                    <p>Tujuanmu meraih keuntungan berdagang, dimulai dari sini!!!</p>

                    <button
                        className="button-daftar"
                        onClick={() => navigate("/register")}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Daftar Gratis"} <span>→</span>
                    </button>
                </div>

                {/* Gambar kanan — dibungkus wrapper agar tidak nabrak teks */}
                <div className="hero-image-wrapper">
                    <div className="hero-img">
                        <img src={manekin} alt="manekin orang" className="manekin" />
                    </div>
                </div>
            </main>

            {/* ── FITUR ── */}
            <main className="backround-color2">
                <div
                    ref={fiturRef}
                    className="fitur"
                    style={{
                        opacity: fiturInView ? 1 : 0,
                        transform: fiturInView ? "translateY(0)" : "translateY(30px)",
                        transition: "opacity 0.7s ease, transform 0.7s ease",
                    }}
                >
                    <h1 className="h1-fitur">Fitur Kami</h1>
                    <p className="p-fitur">Tujuan Meraih Keuntungan Berdagang</p>
                </div>

                <section className="container-fitur">
                    <div className="wrapper-card">
                        {dataFitur.map((item, index) => (
                            <AnimatedCard key={index} item={item} delay={index * 0.15} />
                        ))}
                    </div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer
                ref={footerRef}
                className="footer-main"
                style={{
                    opacity: footerInView ? 1 : 0,
                    transform: footerInView ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
            >
                <div className="footer-container">
                    {/* Kolom 1: Logo + Sponsor */}
                    <div className="footer-col">
                        <img
                            src={logoLabatrack}
                            alt="LabaTrack Logo"
                            className="footer-logo-main"
                        />
                        <div className="support-section">
                            <p>Support by:</p>
                            <div className="support-box">
                                <img src={dbsLogo} alt="DBS" className="support-img" />
                                <div className="footer-divider"></div>
                                <img src={dicodingLogo} alt="Dicoding" className="support-img" />
                            </div>
                        </div>
                    </div>

                    {/* Kolom 2: Navigasi */}
                    <div className="footer-col nav-col">
                        <ul className="footer-links">
                            <li>Tentang Kami</li>
                            <li>Komunitas</li>
                            <li>Fitur Kami</li>
                            <li>Tim Developer</li>
                        </ul>
                    </div>

                    {/* Kolom 3: Kontak */}
                    <div className="footer-col">
                        <h3 className="footer-heading">KONTAK KAMI :</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <img src={gmailIcon} alt="Gmail" className="contact-icon" />
                                <span>Labatrack@gmail.com</span>
                            </div>
                            <div className="contact-item">
                                <img src={waIcon} alt="WhatsApp" className="contact-icon" />
                                <span>+62 878-2690-8794</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>Copyright 2026 – 2030 Labatrack.com</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;