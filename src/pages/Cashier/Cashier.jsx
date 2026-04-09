import React, { useState, useEffect } from 'react';
import './Cashier.css';
import { useNavigate } from "react-router-dom";
import api from "../../api"; 

function Cashier() {
    const navigate = useNavigate();

    // State Management
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [products, setProducts] = useState([]); 
    const [cart, setCart] = useState([]); 
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [isLoading, setIsLoading] = useState(false);
    
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

    const onClickLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // 1. Ambil data produk saat halaman dibuka
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/api/products");
                setProducts(response.data);
            } catch (err) {
                console.error("Gagal mengambil produk:", err);
            }
        };
        fetchProducts();
    }, []);

    // 2. Fungsi Tambah ke Keranjang (DENGAN VALIDASI STOK)
    const addToCart = (product) => {
        // FITUR 1: Cek stok awal
        if (product.stock <= 0) {
            return alert(`Maaf, stok ${product.name} sudah habis!`);
        }

        const existingItem = cart.find((item) => item.product_id === product.id);

        if (existingItem) {
            // FITUR 2: Cek apakah qty di cart sudah mencapai batas stok
            if (existingItem.quantity >= product.stock) {
                return alert("Stok tidak mencukupi untuk ditambah lagi.");
            }

            setCart(cart.map((item) =>
                item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { 
                product_id: product.id, 
                name: product.name, 
                price: product.sell_price, 
                quantity: 1 
            }]);
        }
    };

    // 3. Update Quantity di Cart (DENGAN VALIDASI STOK)
    const updateQty = (id, delta) => {
        // Ambil data produk asli untuk tau stok max-nya
        const originalProduct = products.find(p => p.id === id);

        setCart(cart.map(item => {
            if (item.product_id === id) {
                const newQty = item.quantity + delta;
                
                // Jika user klik (+), cek stok dulu
                if (delta > 0 && newQty > originalProduct.stock) {
                    alert("Stok terbatas!");
                    return item;
                }

                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    // 4. Hapus Item dari Cart
    const removeItem = (id) => {
        setCart(cart.filter(item => item.product_id !== id));
    };

    // 5. Checkout
    const handleCheckout = async () => {
        if (cart.length === 0) return alert("Keranjang masih kosong!");
        setIsLoading(true);

        try {
            const payload = {
                payment_method: paymentMethod,
                items: cart 
            };

            const response = await api.post("/api/transactions", payload);
            alert(`Transaksi Berhasil!`);
            
            // Refresh produk agar stok di UI update setelah berkurang
            const resProd = await api.get("/api/products");
            setProducts(resProd.data);
            
            setCart([]); 
        } catch (err) {
            alert(err.response?.data?.error || "Terjadi kesalahan transaksi");
        } finally {
            setIsLoading(false);
        }
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="container">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <nav className="menu">
                    <button className="menu-item" onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <button className="menu-item active">Cashier</button>
                    <button className="menu-item" onClick={() => navigate("/product")}>Product</button>
                    <button className="menu-item" onClick={() => navigate("/calculator")}>Calculator</button>
                </nav>

                <div className="profile-card">
                    <div className="profile-main" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ cursor: 'pointer' }}>
                        <div className="profile-info-wrapper">
                            <span className="avatar">
                                {user?.store_name?.charAt(0).toUpperCase() || "U"}
                            </span>
                            <span>{user?.store_name || "User"}</span>
                        </div>
                        <span className={`arrow ${isProfileOpen ? 'rotate' : ''}`}>🔻</span>
                    </div>
                    {isProfileOpen && (
                        <div className="profile-options-dropdown">
                            <button className="profile-opt-btn logout-text" onClick={onClickLogout}>
                                📕 Log out
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

            <main className="main-content">
                <header className="top-header">
                    <button className="hamburger" onClick={toggleSidebar}>☰</button>
                    <h2>CASHIER</h2>
                </header>

                <div className="product-grid">
                    {products.map((prod) => (
                        <div 
                            key={prod.id} 
                            className={`product-placeholder ${prod.stock <= 0 ? 'disabled' : ''}`} 
                            onClick={() => addToCart(prod)} 
                            style={{ 
                                position: 'relative', 
                                overflow: 'hidden',
                                cursor: prod.stock <= 0 ? 'not-allowed' : 'pointer',
                                filter: prod.stock <= 0 ? 'grayscale(1)' : 'none',
                                opacity: prod.stock <= 0 ? 0.7 : 1
                            }}
                        >
                            {/* FITUR 3: Badge Habis */}
                            {prod.stock <= 0 && (
                                <div style={{
                                    position: 'absolute', top: '10px', left: '10px',
                                    background: 'red', color: 'white', padding: '2px 8px',
                                    borderRadius: '5px', fontSize: '10px', fontWeight: 'bold', zIndex: 10
                                }}>HABIS</div>
                            )}

                            {prod.image_url ? (
                                <img src={prod.image_url} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ padding: '10px', textAlign: 'center', background: '#eee', height: '100%' }}>{prod.name}</div>
                            )}

                            <div className="prod-info-overlay" style={{ 
                                position: 'absolute', bottom: 0, 
                                background: 'rgba(0,0,0,0.7)', color: 'white', 
                                width: '100%', padding: '5px 0', textAlign: 'center' 
                            }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{prod.name}</div>
                                <div style={{ fontSize: '10px' }}>
                                    Stok: {prod.stock} | Rp {prod.sell_price.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <section className="cart-section">
                <div className="cart-header">
                    <span>🛒</span>
                    <h2>Cart</h2>
                </div>

                <div className="cart-list">
                    {cart.map((item) => (
                        <div key={item.product_id} className="cart-card">
                            <div className="item-detail">
                                <span className="name">{item.name}</span>
                            </div>
                            <div className="qty-control">
                                <button onClick={() => updateQty(item.product_id, 1)}>+</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQty(item.product_id, -1)}>-</button>
                            </div>
                            <div className="price-tag">
                                Rp.{(item.price * item.quantity).toLocaleString('id-ID')}
                                <b onClick={() => removeItem(item.product_id)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}> X</b>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-checkout">
                    <div className="summary">
                        <span>Total</span>
                        <span>Rp.{total.toLocaleString('id-ID')}</span>
                    </div>
                    <select 
                        className="btn-payment" 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="Cash">Cash</option>
                        <option value="QRIS">QRIS</option>
                        <option value="E-Wallet">E-Wallet</option>
                        <option value="Transfer">Transfer</option>
                    </select>
                    <div className="btn-group">
                        <button className="btn-check" onClick={handleCheckout} disabled={isLoading}>
                            {isLoading ? "Wait..." : "Checkout"}
                        </button>
                        <button className="btn-clear" onClick={() => setCart([])}>Clear</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Cashier;