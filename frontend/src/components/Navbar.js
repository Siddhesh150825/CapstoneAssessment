import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ cartItems }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + item.qty, 0)
    : 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">🍴 SmartRestaurant</h2>
      <ul className="nav-links">
        <li><Link to="/menu">Menu</Link></li>
        <li>
          <Link to="/cart">
            Cart{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </li>
        <Link to="/my-orders">My Orders</Link>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/reservations">Reservations</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
        <li><Link to="/admin">Admin</Link></li>

        {}
        {token ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
