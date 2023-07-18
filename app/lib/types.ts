export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Review {
  userId: number;
  rating: number;
  comments: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string | null;
  avatar: string;
  createdAt: number;
}

export interface CartItem {
  id: string;
  count: number;
  user: User;
  product: Product;
}

export interface Cart {
  user: User;
  items: CartItem[];
  show: boolean;
}

export interface Order {
  id: number;
  amount: number;
  shippingFees: number;
  discount: number;
  finalAmount: number;
  paid: boolean;
  user: User;
  shippingAddress: string;
  createdAt: number;
}
