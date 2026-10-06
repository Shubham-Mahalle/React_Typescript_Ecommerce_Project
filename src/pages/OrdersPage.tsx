import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export function OrdersPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const allOrders = useSelector((state: RootState) => state.orders.orders);
  const locationState = window.history.state?.usr as
    { placed?: string } | undefined;
  const orders = allOrders.filter((order) => order.userEmail === user?.email);
  return (
    <main className="page-shell">
      <p className="eyebrow">YOUR ACCOUNT</p>
      <h1 className="section-title">Your orders</h1>
      {locationState?.placed && (
        <div className="order-success">
          ✓ &nbsp; Order placed successfully{" "}
          <span>Order {locationState.placed}</span>
        </div>
      )}
      {!orders.length ? (
        <div className="empty-state">
          <div className="empty-bag">◇</div>
          <h2>No orders yet</h2>
          <p className="muted">Your placed orders will show up here.</p>
          <Link className="button button-dark" to="/products">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-head">
                <div>
                  <span className="order-label">ORDER</span>
                  <strong>{order.id}</strong>
                </div>
                <span className="order-status">{order.status}</span>
              </div>
              <div className="order-meta">
                <span>{new Date(order.date).toLocaleDateString()}</span>
                <span>{order.paymentMethod}</span>
                <strong>${order.total.toFixed(2)}</strong>
              </div>
              <div className="order-products">
                {order.items.map((item) => (
                  <span key={item.product.id}>
                    {item.product.title} <b>× {item.quantity}</b>
                  </span>
                ))}
              </div>
              <details className="order-details">
                <summary>View shipping details</summary>
                <p>
                  {order.shipping.fullName} · {order.shipping.address},{" "}
                  {order.shipping.city}, {order.shipping.state}{" "}
                  {order.shipping.pincode}
                </p>
              </details>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
