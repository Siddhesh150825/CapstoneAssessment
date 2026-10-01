import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import "./Reservations.css";

const Reservations = () => {
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
        const res = await api.get("/reservations/my-reservations");
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

    // ✅ Validation checks
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

    // ✅ Time validation
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
      const res = await api.post("/reservations", formData);
      alert("✅ Reservation successful!");
      setReservations([...reservations, res.data]);
      setFormData({ date: "", time: "", guests: 1 }); // reset form
    } catch (err) {
      alert("❌ Failed to reserve table");
      console.error(err);
    }
  };

  return (
    <div className="reservations-container">
      <h1>📅 Table Reservations</h1>

      {/* Reservation Form */}
      <form onSubmit={handleSubmit} className="reservation-form">
        <input
          type="date"
          name="date"
          min={new Date().toISOString().split("T")[0]} // disables past dates
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

      {/* Reservation List */}
      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations yet. Book your first table!</p>
      ) : (
        <div className="reservations-list">
          {reservations.map((resv) => (
            <div key={resv._id} className="reservation-card">
              <h3>Reservation #{resv._id}</h3>
              <p>Date: {resv.date}</p>
              <p>Time: {resv.time}</p>
              <p>Guests: {resv.guests}</p>
              <p>Status: <strong>{resv.status}</strong></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
