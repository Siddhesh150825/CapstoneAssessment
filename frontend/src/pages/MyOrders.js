import React, { useEffect, useState } from "react";
import api from "../utils/axios";

const MyOrders = () => {
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
      <h1>📦 My Orders</h1>
      {active.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {active.map(o => (
            <li key={o._id}>
              Order #{o._id} – {o.status}
            </li>
          ))}
        </ul>
      )}

      <h2>Delivered Orders</h2>
      {delivered.length === 0 ? (
        <p>No delivered orders yet.</p>
      ) : (
        <ul>
          {delivered.map(o => (
            <li key={o._id}>
              Order #{o._id} – Delivered
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
