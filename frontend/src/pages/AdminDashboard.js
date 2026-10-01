import React, { useEffect, useState } from "react";
import api from "../utils/axios"; // axios instance with JWT interceptor
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
          const res = await api.get("/admin/users");
          setUsers(res.data);
        } else if (activeTab === "menu") {
          const res = await api.get("/admin/menu");
          setMenu(res.data);
        } else if (activeTab === "orders") {
          const res = await api.get("/admin/orders");
          setOrders(res.data);
        } else if (activeTab === "reservations") {
          const res = await api.get("/reservations");
          setReservations(res.data);
        } else if (activeTab === "feedback") {
          const res = await api.get("/feedback");
          setFeedback(res.data);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchData();
  }, [activeTab]);

  // Function to update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      // Update local state after successful API call
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
      <h1>🔐 Admin Dashboard</h1>

      {/* Navigation Tabs */}
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

      {/* Tab Content */}
      {activeTab === "users" && (
  <div>
    <h2>Manage Users</h2>
    <div className="user-list">
      {users.map((u) => (
        <div className="user-card" key={u._id}>
          <h4>{u.name}</h4>
          <span>{u.email}</span>
          <p>Role: {u.role}</p>

          {/* ✅ Admin actions */}
          <div className="user-actions">
            <button
              className="edit-btn"
              onClick={async () => {
                const newRole = prompt("Enter new role (customer/admin):", u.role);
                if (!newRole) return;
                try {
                  const res = await api.put(`/admin/users/${u._id}/role`, { role: newRole });
                  alert("✅ Role updated!");
                  setUsers((prev) =>
                    prev.map((usr) =>
                      usr._id === u._id ? { ...usr, role: res.data.role } : usr
                    )
                  );
                } catch (err) {
                  alert("❌ Failed to update role");
                  console.error(err);
                }
              }}
            >
              Update Role
            </button>

            <button
              className="delete-btn"
              onClick={async () => {
                if (!window.confirm("Are you sure you want to delete this user?")) return;
                try {
                  await api.delete(`/admin/users/${u._id}`);
                  alert("🗑️ User deleted!");
                  setUsers((prev) => prev.filter((usr) => usr._id !== u._id));
                } catch (err) {
                  alert("❌ Failed to delete user");
                  console.error(err);
                }
              }}
            >
              Delete User
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {activeTab === "menu" && (
  <div>
    <h2>Manage Menu</h2>

    {}
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
          try {
            const res = await api.post("/admin/menu", {
              name: newName,
              price: newPrice,
              image: newImage,
            });
            setMenu((prev) => [...prev, res.data]);
            setNewName("");
            setNewPrice("");
          } catch (err) {
            console.error("Error adding menu item:", err);
          }
        }}
      >
        Add Item
      </button>
    </div>

    {}
    <ul className="menu-list">
  {menu.map((m) => (
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
              await api.delete(`/admin/menu/${m._id}`);
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
                const res = await api.put(`/admin/menu/${m._id}`, {
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
            <ul>
              {orders.map((o) => (
                <li key={o._id}>
                  Order #{o._id} – {o.status}
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  >
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "reservations" && (
          <div>
            <h2>Manage Reservations</h2>
            <ul>
              {reservations.map((r) => (
                <li key={r._id}>
                  {r.date} {r.time} – {r.guests} guests
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "feedback" && (
          <div>
            <h2>Manage Feedback</h2>
            <ul className="feedback-list">
            {feedback.map((f) => (
              <li key={f._id} className="feedback-item">
              <p><strong>{f.rating}⭐</strong> – {f.comment}</p>
            <div className="feedback-actions">
              <button
                className="edit-btn"
                onClick={async () => {
                const newComment = prompt("Edit feedback comment:", f.comment);
                if (!newComment) return;
                try {
                  const res = await api.put(`/feedback/${f._id}`, {
                    comment: newComment,
                  });
                  alert("✅ Feedback updated!");
                  setFeedback((prev) =>
                    prev.map((fb) =>
                      fb._id === f._id ? { ...fb, comment: res.data.comment } : fb
                    )
                  );
                } catch (err) {
                  alert("❌ Failed to update feedback");
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
                  await api.delete(`/feedback/${f._id}`);
                  alert("🗑️ Feedback deleted!");
                  setFeedback((prev) => prev.filter((fb) => fb._id !== f._id));
                } catch (err) {
                  alert("❌ Failed to delete feedback");
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
