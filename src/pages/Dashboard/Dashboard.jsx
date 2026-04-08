import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; 

function Dashboard() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const [stats, setStats] = useState({
        labaHariIni: 0,
        transaksiHariIni: 0,
        produkTerjual: 0, // Ini akan berisi total unit terjual
        totalProduk: 0    // Ini akan berisi sisa stok (total unit)
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get("/api/reports/dashboard-summary");
                // Backend harus mengirimkan hasil SUM(stock) dan SUM(quantity)
                setStats(res.data.stats);
                setRecentTransactions(res.data.recent);
            } catch (err) {
                console.error("Gagal ambil data dashboard", err);
            }
        };
        fetchDashboardData();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    const onClickLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="container">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <nav className="menu">
                    <button className="menu-item active">Dashboard</button>
                    <button className="menu-item" onClick={() => navigate("/cashier")}>Cashier</button>
                    <button className="menu-item" onClick={() => navigate("/product")}>Product</button>
                    <button className="menu-item" onClick={() => navigate("/calculator")}>Calculator</button>
                </nav>

                <div className="profile-card">
                    <div className="profile-main" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ cursor: 'pointer' }}>
                        <div className="profile-info-wrapper">
                            <span className="avatar">{user?.store_name?.charAt(0).toUpperCase() || "U"}</span>
                            <span>{user?.store_name || "User"}</span>
                        </div>
                        <span className={`arrow ${isProfileOpen ? 'rotate' : ''}`}>▼</span>
                    </div>
                    {isProfileOpen && (
                        <div className="profile-options">
                            <button className="profile-opt-btn logout" onClick={onClickLogout}>⏻ Log out</button>
                        </div>
                    )}
                </div>
            </aside>

            <div className="main">
                <header className="top-header">
                    <button className="hamburger" onClick={toggleSidebar}>☰</button>
                </header>
                <div className="topbar">
                    <button onClick={onClickLogout} className="logout-item">⏻ Log out</button>
                </div>

                <div className="content">
                    <div className="header-title">
                        <h1>Dashboard 🔥</h1>
                        <p>Selamat datang kembali, <b>{user?.store_name}</b>!</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Laba Hari ini</h3>
                            <div className="stat-content">
                                <div className="icon-box">💰</div>
                                <span className="stat-value">Rp {stats.labaHariIni.toLocaleString('id-ID')}</span>
                            </div>
                            <p className="stat-footer">{stats.transaksiHariIni} transaksi hari ini</p>
                        </div>

                        {/* Menampilkan total unit yang sudah laku terjual */}
                        <div className="stat-card">
                            <h3>Produk Terjual</h3>
                            <div className="stat-content">
                                <div className="icon-box">📦</div>
                                <span className="stat-value">{stats.produkTerjual}</span>
                            </div>
                            <p className="stat-footer">Total item keluar</p>
                        </div>

                        {/* Menampilkan total sisa unit stok di gudang */}
                        <div className="stat-card">
                            <h3>Sisa Stok</h3>
                            <div className="stat-content">
                                <div className="icon-box">🛒</div>
                                <span className="stat-value">{stats.totalProduk}</span>
                            </div>
                            <p className="stat-footer">Total unit tersedia</p>
                        </div>
                    </div>

                    <div className="transaction-section">
                        <div className="section-title">
                            <span className="icon-history">⏳</span>
                            <h2>Transaksi Terakhir</h2> 
                        </div>
                        <div className="table-container">
                            <table className="transaction-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Metode</th>
                                        <th>Total</th>
                                        <th>Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>#{tx.id.toString().slice(-8)}</td>
                                            <td>{tx.payment_method}</td>
                                            <td>Rp {tx.total_amount.toLocaleString('id-ID')}</td>
                                            <td>{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    {recentTransactions.length === 0 && (
                                        <tr><td colSpan="4" style={{textAlign: 'center'}}>Belum ada transaksi</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;