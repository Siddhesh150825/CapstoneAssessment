import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Menu from "./pages/Menu";
import AdminDashboard from "./pages/AdminDashboard";
import Reservations from "./pages/Reservations";
import Feedback from "./pages/Feedback";
import Cart from "./pages/Cart";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  if (role && decoded.role !== role) {
    return <Navigate to="/menu" />;
  }

  return children;
};

function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/feedback" element={<Feedback />} />

        {}
        <Route
          path="/menu"
          element={<Menu cartItems={cartItems} setCartItems={setCartItems} />}
        />

        {}
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
