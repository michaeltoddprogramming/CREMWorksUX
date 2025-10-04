// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'failed';
  message: string;
  data?: T;
  error?: string;
}

// Auth Types
export interface User {
  id: string;
  username: string;
  admin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    admin: boolean;
  };
}

// Product Types
export interface Product {
  _id: string;
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  summary?: string;
  description: string;
  image: string;
  availabilityDate?: string | null;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: string;
  stock?: number;
  brand: string;
  summary?: string;
  availabilityDate?: string | null;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// Review Types
export interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  username: string;
  rating: number;
  comment: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartItemDetailed extends Product {
  quantity: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// Order Types
export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status: string;
  createdAt: string;
}

// Upload Types
export interface UploadRequest {
  imageData: string;
  fileName: string;
}

export interface UploadResponse extends ApiResponse {
  imageUrl: string;
}