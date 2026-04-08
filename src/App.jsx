import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import LoginPage from './pages/LoginPage/LoginPage';
import Cashier from './pages/Cashier/Cashier';
import Product from './pages/Product/Product';
import Calculator from './pages/Calculator/Calculator';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Halaman Publik */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Halaman Terproteksi (Bungkus di sini) */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
                <Route path="/cashier" element={<ProtectedRoute><Cashier /></ProtectedRoute>} />
                <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />            </Routes>
        </Router>
    );
}

export default App;