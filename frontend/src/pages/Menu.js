import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

const Menu = ({ cartItems, setCartItems }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenuItems(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // ✅ Add item to cart with quantity tracking
  const addToCart = (item) => {
    const existing = cartItems.find((i) => i._id === item._id);
    if (existing) {
      setCartItems(
        cartItems.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="menu-container">
      <h1>🍽️ Restaurant Menu</h1>

      <input
        type="text"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="menu-search"
      />

      {loading ? (
        <p>Loading menu...</p>
      ) : filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <>
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item._id} className="menu-card">
                <img
                  src={item.image || "https://source.unsplash.com/300x200/?food"}
                  alt={item.name}
                  className="menu-image"
                />
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button
                  className="menu-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* 🛒 View Cart Button */}
          {cartItems.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                className="menu-btn"
                onClick={() => navigate("/cart")}
              >
                View Cart ({cartItems.length})
              </button>
            </div>
          )}

          {/* 📌 New Navigation Buttons */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              className="menu-btn"
              onClick={() => navigate("/reservations")}
            >
              Reserve a Table
            </button>
            <button
              className="menu-btn"
              style={{ marginLeft: "10px" }}
              onClick={() => navigate("/feedback")}
            >
              Give Feedback
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
