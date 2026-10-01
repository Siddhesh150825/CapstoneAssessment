import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "./Cart.css";

const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const checkout = async () => {
  try {
    const res = await api.post("/orders", {
      items: cartItems.map((i) => ({
        menuItemId: i._id,
        quantity: i.qty
      })),
    });
    alert("✅ Order placed successfully!");
    setCartItems([]);
    navigate("/my-orders");
  } catch (err) {
    alert("❌ Checkout failed");
    console.error("Checkout error:", err.response?.data || err.message);
  }
};


  return (
    <div className="cart-container">
      <h1>🛒 My Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                {item.name} – ₹{item.price} × {item.qty}
              </li>
            ))}
          </ul>
          <h3>Total: ₹{total}</h3>
          <button onClick={checkout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
