import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "users") {
          const res = await api.get("/api/admin/users");
          setUsers(Array.isArray(res.data) ? res.data : []);
        } else if (activeTab === "menu") {
          const res = await api.get("/api/admin/menu");
          setMenu(Array.isArray(res.data) ? res.data : []);
        } else if (activeTab === "orders") {
          const res = await api.get("/api/admin/orders");
          setOrders(Array.isArray(res.data) ? res.data : []);
        } else if (activeTab === "reservations") {
          const res = await api.get("/api/admin/reservations");
          setReservations(Array.isArray(res.data) ? res.data : []);
        } else if (activeTab === "feedback") {
          const res = await api.get("/api/admin/feedback");
          setFeedback(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchData();
  }, [activeTab]);


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, status: res.data.status } : ord
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      { }
      <div className="admin-tabs">
        {["users", "menu", "orders", "reservations", "feedback"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      { }
      {activeTab === "users" && (
        <div>
          <h2>Manage Users</h2>
          <div className="user-list">
            {Array.isArray(users) && users.map((u) => (
              <div className="user-card" key={u._id}>
                <h4>{u.name}</h4>
                <span>{u.email}</span>
                <p>Role: {u.role}</p>

                { }
                <div className="user-actions">
                  {u.role === "customer" && (
  <button
    className="delete-btn"
    onClick={async () => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      try {
        await api.delete(`/api/admin/users/${u._id}`);
        alert("User deleted!");
        setUsers((prev) => prev.filter((usr) => usr._id !== u._id));
      } catch (err) {
        alert("Failed to delete user");
        console.error(err);
      }
    }}
  >
    Delete User
  </button>
)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "menu" && (
        <div>
          <h2>Manage Menu</h2>

          { }
          <div className="menu-form">
            <input
              type="text"
              placeholder="Item name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={newPrice}
              min="1"
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
            <button
              onClick={async () => {
                const nameRegex = /^[A-Za-z0-9\s]+$/; // only alphabets, numbers, spaces
                if (!newName.trim() || !nameRegex.test(newName)) {
                  alert("Item name must contain only letters and numbers (min 1 character).");
                  return;
                }

                if (!newPrice || isNaN(newPrice) || Number(newPrice) <= 0) {
                  alert("Price must be a positive number.");
                  return;
                }

                const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif))$/i;
                if (newImage && !urlRegex.test(newImage)) {
                  alert("Please enter a valid image URL (http/https ending with .png/.jpg/.jpeg/.webp/.gif).");
                  return;
                }

                try {
                  const res = await api.post("/api/admin/menu", {
                    name: newName,
                    price: newPrice,
                    image: newImage,
                  });
                  setMenu((prev) => [...prev, res.data]);
                  setNewName("");
                  setNewPrice("");
                  setNewImage("");
                } catch (err) {
                  console.error("Error adding menu item:", err);
                }
              }}
            >
              Add Item
            </button>
          </div>

          { }
          <ul className="menu-list">
            {Array.isArray(menu) && menu.map((m) => (
              <li key={m._id} className="menu-item">
                <div className="menu-info">
                  <img src={m.image} alt={m.name} className="menu-thumb" />
                  <div>
                    <h4>{m.name}</h4>
                    <span>₹{m.price}</span>
                  </div>
                </div>
                <div className="menu-actions">
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      try {
                        await api.delete(`/api/admin/menu/${m._id}`);
                        setMenu((prev) => prev.filter((item) => item._id !== m._id));
                      } catch (err) {
                        console.error("Error deleting menu item:", err);
                      }
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="edit-btn"
                    onClick={async () => {
                      const newPrice = prompt("Enter new price:", m.price);
                      if (newPrice) {
                        try {
                          const res = await api.put(`/api/admin/menu/${m._id}`, {
                            price: newPrice,
                          });
                          setMenu((prev) =>
                            prev.map((item) =>
                              item._id === m._id ? { ...item, price: res.data.price } : item
                            )
                          );
                        } catch (err) {
                          console.error("Error updating menu item:", err);
                        }
                      }
                    }}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      )}


      {activeTab === "orders" && (
  <div>
    <h2>Manage Orders</h2>
    <ul className="order-list">
      {Array.isArray(orders) && orders.map((o) => (
        <li key={o._id} className="order-card">
          <p><strong>Customer:</strong> {o.customerId?.name || "Unknown"}</p>
          <p><strong>Items:</strong> {o.items.map(i => i.menuItemId?.name).join(", ")}</p>
          <p><strong>Total:</strong> ₹{o.items.reduce((sum, i) => sum + (i.menuItemId?.price || 0), 0)}</p>
          <p><strong>Status:</strong> {o.status}</p>

          <select
  value={o.status}
  onChange={async (e) => {
    const newStatus = e.target.value;
    try {
      const res = await api.put(`/api/admin/orders/${o._id}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((ord) => ord._id === o._id ? res.data : ord)
      );
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  }}
>
  <option value="Pending" disabled={o.status !== "Pending"}>Pending</option>
  <option value="Preparing" disabled={o.status !== "Pending"}>Preparing</option>
  <option value="Ready" disabled={o.status !== "Preparing"}>Ready</option>
  <option value="Delivered" disabled={o.status !== "Ready"}>Delivered</option>
</select>

        </li>
      ))}
    </ul>
  </div>
)}


      {activeTab === "reservations" && (
  <div>
    <h2>Manage Reservations</h2>
    <ul className="reservation-list">
      {Array.isArray(reservations) && reservations.map((r) => (
        <li key={r._id} className="reservation-card">
          <p><strong>Customer:</strong> {r.customerId?.name || "Unknown"}</p>
          <p><strong>Date:</strong> {new Date(r.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {r.time}</p>
          <p><strong>Guests:</strong> {r.guests}</p>
          <p><strong>Status:</strong> {r.status}</p>
          <div className="reservations-actions">
    <button
      className="accept-btn"
      onClick={async () => {
        try {
          const res = await api.put(`/api/reservations/${r._id}/status`, { status: "accepted" });
          setReservations((prev) => prev.map((item) => item._id === r._id ? res.data : item));
        } catch (err) {
          console.error(err);
        }
      }}
    >
      Accept
    </button>

    <button
      className="reject-btn"
      onClick={async () => {
        try {
          const res = await api.put(`/api/reservations/${r._id}/status`, { status: "rejected" });
          setReservations((prev) => prev.map((item) => item._id === r._id ? res.data : item));
        } catch (err) {
          console.error(err);
        }
      }}
    >
      Reject
    </button>
  </div>
        </li>
      ))}
    </ul>
  </div>
)}


      {activeTab === "feedback" && (
        <div>
          <h2>Manage Feedback</h2>
          <ul className="feedback-list">
            {Array.isArray(feedback) && feedback.map((f) => (
              <li key={f._id} className="feedback-item">
                <div className="feedback-content">
                  <p><strong>{f.rating}⭐</strong> – {f.comment}</p>
                  <p><strong>Name:</strong> {f.customerId?.name || "Anonymous"}</p>
                  <p><strong>Email:</strong> {f.customerId?.email || "N/A"}</p>
                  <p><strong>Created At:</strong> {new Date(f.createdAt).toLocaleString()}</p>
                </div>
                <div className="feedback-actions">
                  <button
                    className="edit-btn"
                    onClick={async () => {
                      const newComment = prompt("Edit feedback comment:", f.comment);
                      if (!newComment) return;
                      try {
                        const res = await api.put(`/api/admin/feedback/${f._id}`, {
                          comment: newComment,
                        });
                        alert("Feedback updated!");
                        setFeedback((prev) =>
                          prev.map((fb) =>
                            fb._id === f._id ? { ...fb, comment: res.data.comment } : fb
                          )
                        );
                      } catch (err) {
                        alert("Failed to update feedback");
                        console.error(err);
                      }
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={async () => {
                      if (!window.confirm("Delete this feedback?")) return;
                      try {
                        await api.delete(`/api/admin/feedback/${f._id}`);
                        alert("Feedback deleted!");
                        setFeedback((prev) => prev.filter((fb) => fb._id !== f._id));
                      } catch (err) {
                        alert("Failed to delete feedback");
                        console.error(err);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
