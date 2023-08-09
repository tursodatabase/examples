export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string | null;
  avatar: string | null;
  createdAt: number | null;
  updatedAt: number | null;
  orders?: Order[];
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
  id: string;
  amount: number;
  shippingFees: number;
  discount?: number;
  finalAmount: number;
  paid: number;
  user?: User;
  shippingAddress: string;
  createdAt: number | null;
  updatedAt: number | null;
}
