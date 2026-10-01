import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("menu");
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (activeTab === "menu") {
      const fetchMenu = async () => {
        const res = await api.get("/api/admin/menu");
        setMenu(res.data);
      };
      fetchMenu();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "orders") {
      const fetchOrders = async () => {
        const res = await api.get("/api/orders");
        setOrders(res.data);
      };
      fetchOrders();
    }
  }, [activeTab]);

useEffect(() => {
  if (activeTab === "reservations") {
    const fetchReservations = async () => {
      const res = await api.get("/api/reservations");
      setReservations(res.data);
    };
    fetchReservations();
  }
}, [activeTab]);

useEffect(() => {
  if (activeTab === "feedback") {
    const fetchFeedback = async () => {
      const res = await api.get("/api/feedback");
      setFeedbacks(res.data);
    };
    fetchFeedback();
  }
}, [activeTab]);


  return (
    <div className="admin-container">
      <h1>🔐 Admin Dashboard</h1>

      {}
      <div className="admin-tabs">
        {["menu", "orders", "reservations", "feedback"].map((tab) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {}
      {activeTab === "menu" && (
        <div>
          <h2>Manage Menu</h2>
          {}
          {}
        </div>
      )}

      {}
{activeTab === "reservations" && (
  <div>
    <h2>Manage Reservations</h2>
    <ul>
      {reservations.map(r => (
        <li key={r._id}>
          {new Date(r.date).toLocaleDateString()} {r.time} – {r.guests} guests by {r.customerId?.name}
          <button onClick={async () => {
            await api.delete(`/api/reservations/${r._id}`);
            setReservations(reservations.filter(item => item._id !== r._id));
          }}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
)}

{}
{activeTab === "feedback" && (
  <div>
    <h2>Manage Feedback</h2>
    <ul>
      {feedbacks.map(f => (
        <li key={f._id}>
          ⭐ {f.rating} – {f.comment} by {f.customerId?.name}
          <button onClick={async () => {
            await api.delete(`/api/feedback/${f._id}`);
            setFeedbacks(feedbacks.filter(item => item._id !== f._id));
          }}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
)}


      {}
      {activeTab === "orders" && (
        <div>
          <h2>Manage Orders</h2>
          <ul>
            {orders.map((o) => (
              <li key={o._id} className={`order-card ${o.status.toLowerCase()}`}>
                <span>Order #{o._id} – {o.items.map(i => i.name).join(", ")}</span>
                <select
                  value={o.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    const res = await api.put(`/api/orders/${o._id}/status`, { status: newStatus });
                    setOrders(orders.map(ord => ord._id === o._id ? res.data : ord));
                  }}
                >
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Delivered</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;