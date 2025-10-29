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
    
    // If the body is a FormData, do not set the Content-Type header so the browser
    // can set the multipart boundary. Otherwise default to application/json.
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...this.getAuthHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers,
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

  async getProducts(params?: { page?: number; limit?: number; category?: string; search?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    const qs = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) qs.set('page', String(params.page));
      if (params.limit !== undefined) qs.set('limit', String(params.limit));
      if (params.category) qs.set('category', params.category);
      if (params.search) qs.set('search', params.search);
      if (params.minPrice !== undefined) qs.set('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined) qs.set('maxPrice', String(params.maxPrice));
    }

    const endpoint = `/products${qs.toString() ? `?${qs.toString()}` : ''}`;
    const response = await this.request<ApiResponse<{ products: Product[]; totalPages: number; currentPage: number; total: number }>>(endpoint);
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
    console.log('Adding to cart:', cartData);
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
    // uploadData should be a FormData with the file under key 'image'
    return this.request<UploadResponse>('/upload', {
      method: 'POST',
      body: uploadData as unknown as BodyInit,
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