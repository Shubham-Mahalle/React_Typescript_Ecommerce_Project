import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { clearCart } from "../redux/cartSlice";
import { addOrder } from "../redux/orderSlice";
import type { Order, PaymentMethod, ShippingAddress } from "../types";
import { Field } from "./PageForm";

const blankAddress: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};
export function CheckoutPage() {
  const items = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentMethod>("Cash on Delivery");
  const [error, setError] = useState("");
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 7.5;
  if (!items.length)
    return (
      <main className="page-shell empty-state">
        <h1>Your bag is empty</h1>
        <Link className="button button-dark" to="/products">
          Continue shopping
        </Link>
      </main>
    );
  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (
      payment === "Credit/Debit Card" &&
      (String(data.get("cardNumber")).replace(/\s/g, "").length < 12 ||
        String(data.get("cvv")).length < 3)
    )
      return setError("Please check your card details.");
    if (payment === "UPI" && !String(data.get("upi")).includes("@"))
      return setError("Enter a valid UPI ID.");
    const shippingAddress = Object.fromEntries(
      Object.keys(blankAddress).map((key) => [key, String(data.get(key))]),
    ) as unknown as ShippingAddress;
    const order: Order = {
      id: `SE-${Date.now().toString().slice(-8)}`,
      userEmail: user?.email || "",
      items: [...items],
      shipping: shippingAddress,
      paymentMethod: payment,
      total: subtotal + shipping,
      date: new Date().toISOString(),
      status: "Placed",
    };
    dispatch(addOrder(order));
    dispatch(clearCart());
    navigate("/orders", { state: { placed: order.id } });
  }
  return (
    <main className="page-shell">
      <p className="eyebrow">ALMOST YOURS</p>
      <h1 className="section-title">Checkout</h1>
      <form onSubmit={placeOrder} className="checkout-layout">
        <div className="checkout-form">
          <section className="form-section">
            <h2>Shipping information</h2>
            <div className="form-grid">
              <Field
                label="Full name"
                name="fullName"
                defaultValue={user?.name}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                defaultValue={user?.email}
              />
              <Field label="Phone" name="phone" type="tel" />
              <Field label="Address" name="address" />
              <Field label="City" name="city" />
              <Field label="State" name="state" />
              <Field label="Pincode" name="pincode" />
            </div>
          </section>
          <section className="form-section">
            <h2>Payment method</h2>
            <div className="payment-options">
              {(
                [
                  "Cash on Delivery",
                  "Credit/Debit Card",
                  "UPI",
                ] as PaymentMethod[]
              ).map((method) => (
                <label
                  className={`payment-option ${payment === method ? "selected" : ""}`}
                  key={method}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === method}
                    onChange={() => setPayment(method)}
                  />
                  {method}
                </label>
              ))}
            </div>
            {payment === "Credit/Debit Card" && (
              <div className="form-grid payment-fields">
                <Field label="Card number" name="cardNumber" />
                <Field label="Cardholder name" name="cardName" />
                <Field label="Expiry date" name="expiry" />
                <Field label="CVV" name="cvv" />
              </div>
            )}
            {payment === "UPI" && (
              <div className="payment-fields">
                <Field label="UPI ID" name="upi" />
              </div>
            )}
          </section>
          {error && <p className="form-error">{error}</p>}
        </div>
        <aside className="summary-card">
          <h2>Your order</h2>
          {items.map((item) => (
            <div className="summary-line" key={item.product.id}>
              <span>
                {item.product.title} × {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span>{shipping ? `$${shipping.toFixed(2)}` : "Free"}</span>
          </div>
          <div className="summary-line summary-total">
            <strong>Total</strong>
            <strong>${(subtotal + shipping).toFixed(2)}</strong>
          </div>
          <button className="button button-dark full-width">Place order</button>
          <p className="secure-note">
            Secure checkout · Free shipping over $100
          </p>
        </aside>
      </form>
    </main>
  );
}
