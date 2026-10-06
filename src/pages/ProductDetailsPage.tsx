import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { fetchProduct } from "../services/productApi";
import type { Product } from "../types";
import Loading from "../components/Loading";

export function ProductDetailsPage() {
  const { id = "" } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  useEffect(() => {
    let active = true;
    fetchProduct(id)
      .then((result: Product) => {
        if (active) setProduct(result);
      })
      .catch(() => {
        if (active) setError("This product could not be found.");
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (error)
    return (
      <main className="page-shell empty-state">
        <h1>{error}</h1>
        <Link to="/products" className="button button-dark">
          Back to shop
        </Link>
      </main>
    );
  if (!product)
    return (
      <main className="page-shell">
        <Loading />
      </main>
    );
  return (
    <main className="page-shell">
      <Link className="back-link" to="/products">
        ← Back to shop
      </Link>
      <div className="detail-layout">
        <div className="detail-image">
          <img
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
          />
        </div>
        <section className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="rating detail-rating">
            ★ {product.rating.toFixed(1)} <span>·</span>{" "}
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>
          <p className="detail-price">
            ${product.price.toFixed(2)}{" "}
            {product.discountPercentage > 0 && (
              <span>{Math.round(product.discountPercentage)}% off</span>
            )}
          </p>
          <p className="detail-description">{product.description}</p>
          <div className="quantity-control">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button
            className="button button-dark"
            onClick={() => {
              dispatch(addToCart({ product, quantity }));
              setAdded(true);
            }}
          >
            {added ? "Added to bag ✓" : "Add to bag"}
          </button>
          {added && (
            <Link className="inline-link" to="/cart">
              View your bag →
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}
