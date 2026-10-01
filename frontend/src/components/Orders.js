import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../redux/ordersSlice";

function Orders() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { list, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (token) {
      dispatch(fetchOrders(token));
    }
  }, [dispatch, token]);

  if (status === "loading") return <p>Loading orders...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {list.map((order) => (
          <li key={order._id}>
            Status: {order.status} <br />
            Items:
            <ul>
              {order.items.map((i, idx) => (
                <li key={idx}>{i.menuItemId?.name} x {i.quantity}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
