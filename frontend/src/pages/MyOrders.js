import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const delivered = orders.filter(o => o.status === "Delivered");
  const active = orders.filter(o => o.status !== "Delivered");

  return (
    <div className="orders-container">
      <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              className="nav-btn"
              onClick={() => navigate("/reservations")}
            >
              Reserve a Table
            </button>
            <button
              className="nav-btn"
              style={{ marginLeft: "10px" }}
              onClick={() => navigate("/feedback")}
            >
              Give Feedback
            </button>
            <button 
                className="nav-btn"
                style={{ marginLeft: "10px" }}
                onClick={() => navigate("/menu")}
            >
                Back to Menu
            </button>
          </div>
      
      <h1>My Orders</h1>

      <h2>Active Orders</h2>
      {active.length === 0 ? (
        <p>No active orders yet.</p>
      ) : (
        <ul className="order-list">
          {active.map(o => (
            <li key={o._id} className="order-card">
              <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
              <p><strong>Items:</strong> {o.items.map(i => `${i.menuItemId?.name} × ${i.quantity}`).join(", ")}</p>
              <p><strong>Total:</strong> ₹{o.items.reduce((sum, i) => sum + (i.menuItemId?.price || 0) * i.quantity, 0)}</p>
              <p className="order-status">Status: {o.status}</p>
            </li>
          ))}
        </ul>
      )}

      <h2>Delivered Orders</h2>
      {delivered.length === 0 ? (
        <p>No delivered orders yet.</p>
      ) : (
        <ul className="order-list">
          {delivered.map(o => (
            <li key={o._id} className="order-card">
              <h3>Order #{o._id.slice(-6)}</h3>
              <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
              <p><strong>Items:</strong> {o.items.map(i => `${i.menuItemId?.name} × ${i.quantity}`).join(", ")}</p>
              <p><strong>Total:</strong> ₹{o.items.reduce((sum, i) => sum + (i.menuItemId?.price || 0) * i.quantity, 0)}</p>
              <p className="order-status">Status: Delivered</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;