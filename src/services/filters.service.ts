import { api } from "@/lib/axios";

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface FiltersData {
  categories: Category[];
  brands: Brand[];
}

/**
 * Fetches all available categories and brands from products
 * Since we don't have direct access to category/brand IDs in the public API,
 * we extract unique names from products. The IDs are sequential and used
 * only for UI purposes - actual filtering uses the searchTerm.
 */
export async function getFiltersData(): Promise<FiltersData> {
  // Fetch a large batch of products to extract categories and brands
  const res = await api.get("/products", {
    params: {
      pageNumber: 1,
      pageSize: 100, // Get enough to have variety
    },
  });

  const products = res.data?.data?.products ?? res.data?.products ?? [];

  // Extract unique category and brand names
  const categoryNames = new Set<string>();
  const brandNames = new Set<string>();

  products.forEach((product: { categoryName: string; brandName: string }) => {
    if (product.categoryName) {
      categoryNames.add(product.categoryName);
    }
    if (product.brandName) {
      brandNames.add(product.brandName);
    }
  });

  // Convert to arrays sorted alphabetically
  // IDs are assigned sequentially for UI tracking purposes
  const categories: Category[] = Array.from(categoryNames)
    .sort((a, b) => a.localeCompare(b))
    .map((name, index) => ({ id: index + 1, name }));

  const brands: Brand[] = Array.from(brandNames)
    .sort((a, b) => a.localeCompare(b))
    .map((name, index) => ({ id: index + 1, name }));

  return { categories, brands };
}
