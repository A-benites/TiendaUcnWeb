import { BaseApiService } from "./base-api-service";
import type { GetProductsParams, GetProductsResponse, Product } from "@/models/product.model";

class ProductService extends BaseApiService {
  constructor() {
    super("/products");
  }

  async getProducts(params?: GetProductsParams): Promise<GetProductsResponse> {
    const response = await this.httpClient.get<GetProductsResponse>(this.baseURL, { params });
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await this.httpClient.get<Product>(`${this.baseURL}/${id}`);
    return response.data;
  }
}

export const productService = new ProductService();
