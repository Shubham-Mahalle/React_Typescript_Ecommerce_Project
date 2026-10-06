import type { Product, ProductResponse } from "../types";
export async function fetchProducts(
  skip: number,
  limit = 12,
): Promise<ProductResponse> {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
  );
  if (!response.ok) throw new Error("Unable to load products.");
  const page = (await response.json()) as ProductResponse;

  if (skip !== 0) return page;

  const featuredCategories = ["mens-shirts", "mens-shoes", "mens-watches"];
  const featuredRequests = await Promise.allSettled(
    featuredCategories.map(async (category) => {
      const categoryResponse = await fetch(
        `https://dummyjson.com/products/category/${category}?limit=4`,
      );
      if (!categoryResponse.ok) return [] as Product[];
      const categoryPage = (await categoryResponse.json()) as ProductResponse;
      return categoryPage.products;
    }),
  );

  const featuredProducts = featuredRequests.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
  const uniqueProducts = new Map<number, Product>();
  [...featuredProducts, ...page.products].forEach((product) =>
    uniqueProducts.set(product.id, product),
  );

  return { ...page, products: [...uniqueProducts.values()] };
}
export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) throw new Error("Product not found.");
  return response.json() as Promise<Product>;
}
