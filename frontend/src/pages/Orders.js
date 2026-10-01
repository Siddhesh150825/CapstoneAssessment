import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../redux/ordersSlice";
import "./Orders.css";

const Orders = () => {
  const dispatch = useDispatch();
  const { list: orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="orders-container">
      <h1>🛒 My Orders</h1>

      {status === "loading" && <p>Loading orders...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && orders.length === 0 && (
        <p>No orders yet. Place your first order from the menu!</p>
      )}
      {status === "succeeded" && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order #{order._id}</h3>
              <p>Status: <strong>{order.status}</strong></p>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>{item.name} – ₹{item.price}</li>
                ))}
              </ul>
              <p><small>Placed on: {new Date(order.createdAt).toLocaleString()}</small></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
