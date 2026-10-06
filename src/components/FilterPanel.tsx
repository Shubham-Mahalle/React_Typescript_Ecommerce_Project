import type { Product } from "../types";
export interface Filters {
  search: string;
  category: string;
  min: string;
  max: string;
  rating: string;
  sort: string;
}
export const emptyFilters: Filters = {
  search: "",
  category: "",
  min: "",
  max: "",
  rating: "",
  sort: "",
};
export default function FilterPanel({
  products,
  filters,
  setFilters,
}: {
  products: Product[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  const categories = [...new Set(products.map((product) => product.category))];
  const update = (key: keyof Filters, value: string) =>
    setFilters({ ...filters, [key]: value });
  return (
    <aside className="filter-panel">
      <div className="filter-heading">
        <h2>Filters</h2>
        <button
          className="text-button"
          onClick={() => setFilters(emptyFilters)}
        >
          Clear all
        </button>
      </div>
      <label className="field-label">
        Search
        <input
          placeholder="Search products"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
        />
      </label>
      <label className="field-label">
        Category
        <select
          value={filters.category}
          onChange={(event) => update("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <div className="field-label">
        Price range
        <div className="price-fields">
          <input
            aria-label="Minimum price"
            type="number"
            min="0"
            placeholder="Min"
            value={filters.min}
            onChange={(event) => update("min", event.target.value)}
          />
          <span>to</span>
          <input
            aria-label="Maximum price"
            type="number"
            min="0"
            placeholder="Max"
            value={filters.max}
            onChange={(event) => update("max", event.target.value)}
          />
        </div>
      </div>
      <label className="field-label">
        Rating
        <select
          value={filters.rating}
          onChange={(event) => update("rating", event.target.value)}
        >
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
        </select>
      </label>
      <label className="field-label">
        Sort by
        <select
          value={filters.sort}
          onChange={(event) => update("sort", event.target.value)}
        >
          <option value="">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
          <option value="name-asc">Name: A–Z</option>
          <option value="name-desc">Name: Z–A</option>
        </select>
      </label>
    </aside>
  );
}
