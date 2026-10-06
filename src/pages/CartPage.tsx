import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "../redux/cartSlice";

export function CartPage() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  if (!items.length)
    return (
      <main className="page-shell empty-state cart-empty">
        <div className="empty-bag">◇</div>
        <h1>Your bag is taking a breather.</h1>
        <p className="muted">
          Find something you'll love and it will be waiting here.
        </p>
        <Link className="button button-dark" to="/products">
          Continue shopping
        </Link>
      </main>
    );
  return (
    <main className="page-shell">
      <p className="eyebrow">YOUR SELECTION</p>
      <h1 className="section-title">
        Shopping bag{" "}
        <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
      </h1>
      <div className="cart-layout">
        <section className="cart-items">
          {items.map(({ product, quantity }) => (
            <article className="cart-item" key={product.id}>
              <Link to={`/products/${product.id}`} className="cart-thumb">
                <img src={product.thumbnail} alt={product.title} />
              </Link>
              <div className="cart-item-main">
                <Link to={`/products/${product.id}`} className="product-title">
                  {product.title}
                </Link>
                <p className="muted">{product.category}</p>
                <div className="quantity-control compact">
                  <button
                    onClick={() => dispatch(decreaseQuantity(product.id))}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => dispatch(increaseQuantity(product.id))}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                <strong>${(product.price * quantity).toFixed(2)}</strong>
                <button
                  className="text-button"
                  onClick={() => dispatch(removeFromCart(product.id))}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
        <aside className="summary-card">
          <h2>Order summary</h2>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-line summary-total">
            <strong>Total</strong>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <Link className="button button-dark full-width" to="/checkout">
            Continue to checkout
          </Link>
          <Link to="/products" className="continue-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
