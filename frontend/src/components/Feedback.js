import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeedback, submitFeedback } from "../redux/feedbackSlice";

function Feedback() {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { list, status, error } = useSelector((state) => state.feedback);

  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  const handleSubmit = () => {
    if (token) {
      dispatch(submitFeedback({ token, rating, comment }));
      setRating(1);
      setComment("");
    }
  };

  if (status === "loading") return <p>Loading feedback...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Customer Feedback</h2>

      {user?.role === "customer" && (
        <div>
          <h3>Submit Feedback</h3>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <input
            placeholder="Your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      <h3>All Feedback</h3>
      <ul>
        {list.map((f) => (
          <li key={f._id}>
            ⭐ {f.rating} — {f.comment} <br />
            by {f.customerId?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feedback;
