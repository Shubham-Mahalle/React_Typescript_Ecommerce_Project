import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { Product } from "../types";
import { addToCart } from "../redux/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        <span className="image-tag">{product.category}</span>
      </Link>
      <div className="product-info">
        <div className="product-title-row">
          <Link to={`/products/${product.id}`} className="product-title">
            {product.title}
          </Link>
          <Rating
            className="product-rating"
            value={product.rating}
            precision={0.1}
            size="small"
            readOnly
            aria-label={`Rated ${product.rating.toFixed(1)} out of 5`}
          />
        </div>
        <div className="product-bottom">
          <div>
            <strong>${product.price.toFixed(2)}</strong>
            {product.discountPercentage > 10 && (
              <span className="discount">
                {Math.round(product.discountPercentage)}% off
              </span>
            )}
          </div>
          <button
            className="icon-add"
            aria-label={`Add ${product.title} to cart`}
            onClick={() =>
              user
                ? dispatch(addToCart({ product }))
                : window.location.assign("/login")
            }
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
