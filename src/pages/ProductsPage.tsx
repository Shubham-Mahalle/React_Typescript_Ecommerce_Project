import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import {
  loadingProducts,
  productsFailed,
  productsReceived,
} from "../redux/productSlice";
import { fetchProducts } from "../services/productApi";
import ProductCard from "../components/ProductCard";
import FilterPanel, { emptyFilters, type Filters } from "../components/FilterPanel";
import Loading from "../components/Loading";

export function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, total, nextSkip } = useSelector(
    (state: RootState) => state.products,
  );
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [mobileFilters, setMobileFilters] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const load = async () => {
    if (loading || (nextSkip >= total && total > 0)) return;
    dispatch(loadingProducts());
    try {
      const result = await fetchProducts(nextSkip);
      dispatch(
        productsReceived({
          products: result.products,
          total: result.total,
          nextSkip: result.skip + result.limit,
        }),   
      );        
    } catch { 
      dispatch(productsFailed("Unable to load products."));
    }
  };
  useEffect(() => {
    if (!products.length) void load();
  }, []);
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return; 
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void load();
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [products.length, nextSkip, total, loading]);
  const visible = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        (!filters.category || product.category === filters.category) &&
        (!filters.min || product.price >= Number(filters.min)) &&
        (!filters.max || product.price <= Number(filters.max)) &&
        (!filters.rating || product.rating >= Number(filters.rating)),
    );
    const sort = filters.sort;
    result = [...result];
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "name-asc")
      result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "name-desc")
      result.sort((a, b) => b.title.localeCompare(a.title));
    return result;
  }, [products, filters]);
  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">THE WATCH EDIT</p>
          <h1>Everyday essentials, with a little edge.</h1>
        </div>
        <p className="muted heading-note">
          Thoughtful finds for everyday living.
        </p>
      </div>
      <button
        className="button filter-toggle"
        onClick={() => setMobileFilters(!mobileFilters)}
      >
        ☷ {mobileFilters ? "Hide filters" : "Show filters"}
      </button>
      <div className="catalog-layout">
        <div className={`mobile-filters ${mobileFilters ? "visible" : ""}`}>
          <FilterPanel
            products={products}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
        <section className="catalog-main">
          <div className="catalog-count">
            {products.length
              ? `${visible.length} products`
              : "Shop the collection"}
          </div>
          {error ? (
            <div className="empty-state">
              <h2>We hit a little snag</h2>
              <p>{error}</p>
              <button
                className="button button-dark"
                onClick={() => void load()}
              >
                Try again
              </button>
            </div>
          ) : visible.length ? (
            <div className="product-grid">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : loading ? (
            <Loading />
          ) : (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try adjusting your search or filters.</p>
              <button
                className="text-button"
                onClick={() => setFilters(emptyFilters)}
              >
                Clear filters
              </button>
            </div>
          )}
          {loading && products.length > 0 && (
            <p className="load-more">
              <span className="spinner small" /> Loading more finds…
            </p>
          )}
          <div ref={sentinel} className="scroll-sentinel" />
          {!loading && products.length > 0 && products.length >= total && (
            <p className="load-more">You've seen it all.</p>
          )}
        </section>
      </div>
    </main>
  );
}
