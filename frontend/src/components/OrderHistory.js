import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../redux/ordersSlice";
import api from "../utils/axios";

const OrderHistory = ({ token, user }) => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.orders.history);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchOrderHistory({ token, userId: user._id }));
    }
  }, [dispatch, token, user]);

  return (
    <div className="order-history">
      <h2>📜 Order History</h2>
      {history.length === 0 ? (
        <p>No delivered orders yet.</p>
      ) : (
        <ul>
          {history.map((o) => (
            <li key={o._id}>
              <strong>Order #{o._id}</strong> – {o.items.map(i => i.name).join(", ")}
              <br />
              Delivered At: {new Date(o.deliveredAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
