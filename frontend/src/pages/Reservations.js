import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import "./Reservations.css";

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/api/reservations/my-reservations");
        setReservations(res.data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const selectedDate = new Date(formData.date);

    if (!formData.date || !formData.time || !formData.guests) {
      alert("Please fill all fields.");
      return;
    }

    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      alert("Date cannot be in the past.");
      return;
    }

    if (formData.guests < 1) {
      alert("Guests must be at least 1.");
      return;
    }

    const [hours, minutes] = formData.time.split(":").map(Number);
    if (hours < 10 || hours > 22) {
      alert("Reservations allowed only between 10:00 and 22:00.");
      return;
    }

    if (selectedDate.toDateString() === today.toDateString()) {
      const now = new Date();
      const selectedTime = new Date(selectedDate);
      selectedTime.setHours(hours, minutes, 0, 0);
      if (selectedTime < now) {
        alert("Time cannot be in the past.");
        return;
      }
    }

    try {
      const res = await api.post("/api/reservations", formData);
      alert("Reservation successful!");
      setReservations([...reservations, res.data]);
      setFormData({ date: "", time: "", guests: 1 });
    } catch (err) {
      alert("Failed to reserve table");
      console.error(err);
    }
  };

  return (
    
    <div className="reservations-container">

      <div className="reservation-nav">
        <button onClick={() => navigate("/feedback")} className="nav-btn">
          Go to Feedback
        </button>
        <button onClick={() => navigate("/menu")} className="nav-btn">
          Back to Menu
        </button>
      </div>

      <h1>Table Reservations</h1>

      {}
      <form onSubmit={handleSubmit} className="reservation-form">
        <input
          type="date"
          name="date"
          min={new Date().toISOString().split("T")[0]}
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="guests"
          min="1"
          value={formData.guests}
          onChange={handleChange}
          required
        />
        <button type="submit">Reserve Table</button>
      </form>

      {}
      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations yet. Book your first table!</p>
      ) : (
        <div className="reservations-list">
          {reservations.map((resv) => (
            <div key={resv._id} className="reservation-card">
              <h3>Customer: {resv.customerId?.name || "Unknown"}</h3>
              <p>Date: {new Date(resv.date).toLocaleDateString()}</p>
              <p>Time: {new Date(`1970-01-01T${resv.time}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Guests: {resv.guests}</p>
              {resv.status && <p>Status: <strong>{resv.status}</strong></p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
