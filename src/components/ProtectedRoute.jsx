import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Cek apakah ada data user di localStorage (setelah login)
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        // Jika tidak ada user, tendang balik ke halaman login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;