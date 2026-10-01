import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReservations, createReservation } from "../redux/reservationsSlice";

function Reservations() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { list, status, error } = useSelector((state) => state.reservations);

  useEffect(() => {
    if (token) {
      dispatch(fetchReservations(token));
    }
  }, [dispatch, token]);

  const handleReserve = () => {
    if (token) {
      dispatch(createReservation({ token, date, time, guests }));
      setDate("");
      setTime("");
      setGuests(1);
    }
  };

  if (status === "loading") return <p>Loading reservations...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Reservations</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} />
      <button onClick={handleReserve}>Reserve</button>

      <ul>
        {list.map((r) => (
          <li key={r._id}>
            {r.date} at {r.time} for {r.guests} guests
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reservations;
