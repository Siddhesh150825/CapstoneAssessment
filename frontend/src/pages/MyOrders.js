import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, fetchOrderHistory } from "../redux/ordersSlice";

const MyOrders = () => {
  const dispatch = useDispatch();

  // ✅ Get token and user from auth slice
  const { token, user } = useSelector((state) => state.auth);

  const { list, status, error, history } = useSelector((state) => state.orders);

  useEffect(() => {
    if (token && user?._id) {
      dispatch(fetchOrders(token));
      dispatch(fetchOrderHistory({ token, userId: user._id }));
    }
  }, [dispatch, token, user]);

  if (status === "loading") return <p>Loading orders...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="orders-container">
      <h2>📦 My Orders</h2>
      {list.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="orders-list">
          {list.map((order) => (
            <li key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity} – ₹{item.price}
                  </li>
                ))}
              </ul>
              <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      <h3>Delivered Orders</h3>
      <ul>
        {history.map((order) => (
          <li key={order._id}>
            Order #{order._id} – Delivered
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders;
