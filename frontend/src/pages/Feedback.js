import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import "./Feedback.css";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("/feedback");
        setFeedbackList(res.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/feedback", formData);
      alert("✅ Feedback submitted!");
      setFeedbackList([...feedbackList, res.data]);
      setFormData({ rating: 5, comment: "" });
    } catch (err) {
      alert("❌ Failed to submit feedback");
      console.error(err);
    }
  };

  return (
    <div className="feedback-container">
      <h1>⭐ Customer Feedback</h1>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit} className="feedback-form">
        <label>
          Rating:
          <select name="rating" value={formData.rating} onChange={handleChange}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
        <textarea
          name="comment"
          placeholder="Write your feedback..."
          value={formData.comment}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Feedback</button>
      </form>

      {/* Feedback List */}
      {loading ? (
        <p>Loading feedback...</p>
      ) : feedbackList.length === 0 ? (
        <p>No feedback yet. Be the first to share!</p>
      ) : (
        <div className="feedback-list">
          {feedbackList.map((fb) => (
            <div key={fb._id} className="feedback-card">
              <p>
                <strong>Rating:</strong> {fb.rating} ⭐
              </p>
              <p>{fb.comment}</p>
              <p>
                <small>By: {fb.user?.name || "Anonymous"}</small>
              </p>

              {/* ✅ Edit/Delete actions */}
              <div className="feedback-actions">
                <button
                  className="edit-btn"
                  onClick={async () => {
                    const newComment = prompt("Edit your feedback:", fb.comment);
                    if (!newComment) return;
                    try {
                      const res = await api.put(`/feedback/${fb._id}`, {
                        comment: newComment,
                      });
                      alert("✅ Feedback updated!");
                      setFeedbackList((prev) =>
                        prev.map((f) =>
                          f._id === fb._id
                            ? { ...f, comment: res.data.comment }
                            : f
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
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this feedback?"
                      )
                    )
                      return;
                    try {
                      await api.delete(`/feedback/${fb._id}`);
                      alert("🗑️ Feedback deleted!");
                      setFeedbackList((prev) =>
                        prev.filter((f) => f._id !== fb._id)
                      );
                    } catch (err) {
                      alert("❌ Failed to delete feedback");
                      console.error(err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
