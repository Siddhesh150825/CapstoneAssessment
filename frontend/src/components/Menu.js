import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; 

function Menu() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/menu", {
          params: { search, category }
        });
        setItems(res.data);
      } catch (err) {
        alert("Failed to load menu: " + err.message);
      }
    };
    fetchMenu();
  }, [search, category]);

  return (
    <div>
      <h2>Menu</h2>
      <input
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        placeholder="Filter by category..."
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong> - ₹{item.price} <br />
            {item.description}
          </li>
        ))}
      </ul>

      {/* Navigation buttons */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/reservations">
          <button style={{ padding: "10px 20px", marginRight: "10px" }}>
            Reserve a Table
          </button>
        </Link>
        <Link to="/feedback">
          <button style={{ padding: "10px 20px" }}>
            Give Feedback
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Menu;
