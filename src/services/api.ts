import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  ApiResponse,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  CreateReviewRequest,
  Review,
  AddToCartRequest,
  CartItemDetailed,
  UpdateCartRequest,
  CheckoutRequest,
  UploadRequest,
  UploadResponse
} from '@/types/api';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<ApiResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.request<ApiResponse<{ products: Product[], totalPages: number, currentPage: number, total: number }>>('/products');
    return response.data?.products || [];
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request<ApiResponse<Product>>(`/products/${id}`);
    return response.data!;
  }

  async createProduct(product: CreateProductRequest): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: UpdateProductRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async addReview(productId: string, review: CreateReviewRequest): Promise<ApiResponse<Review>> {
    return this.request<ApiResponse<Review>>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async getReviews(productId: string): Promise<{
    reviews: Review[];
    averageRating: number;
    reviewCount: number;
  }> {
    const response = await this.request<ApiResponse<{
      reviews: Review[];
      averageRating: number;
      reviewCount: number;
    }>>(`/products/${productId}/reviews`);
    return response.data!;
  }

  async addToCart(cartData: AddToCartRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/cart/add', {
      method: 'POST',
      body: JSON.stringify(cartData),
    });
  }

  async getCart(): Promise<CartItemDetailed[]> {
    const response = await this.request<ApiResponse<{ items: CartItemDetailed[] }>>('/cart');
    return response.data?.items || [];
  }

  async updateCartItem(productId: string, data: UpdateCartRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, ...data }),
    });
  }

  async removeFromCart(productId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/cart/clear', {
      method: 'DELETE',
    });
  }

  async checkout(checkoutData: CheckoutRequest): Promise<ApiResponse<{ orderId: number }>> {
    return this.request<ApiResponse<{ orderId: number }>>('/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
  }

  async uploadImage(uploadData: UploadRequest): Promise<UploadResponse> {
    return this.request<UploadResponse>('/upload', {
      method: 'POST',
      body: JSON.stringify(uploadData),
    });
  }

  async createOrder(checkoutData: CheckoutRequest): Promise<ApiResponse<{ orderId: string }>> {
    return this.request<ApiResponse<{ orderId: string }>>('/orders', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
  }

  // async getUserOrders(email: string): Promise<ApiResponse<Order[]>> {
  //   return this.request<ApiResponse<Order[]>>(`/orders/${email}`);
  // }

}

export const apiClient = new ApiClient();