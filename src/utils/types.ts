export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Review {
  userId: number;
  rating: number;
  comments: string;
}

export interface User {
  id: number,
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  avatar: string;
  created_at: number;
}

export interface CartItem {
  id: number;
  user?: User;
  product: Product;
  count: number;
}

export interface Cart {
  user?: User;
  items: CartItem[]
  show: boolean;
}

export interface Order {
  id: number;
  amount: number;
  shipping_fees: number;
  discount: number;
  final_amount: number;
  paid: boolean;
  user?: number; // there exist unregistered users
  shipping_address: string;
  created_at: number;
}

export interface AppState {
  cart: Cart;
  user?: User;
  filters: Filter;
}

export interface Filter {
  priceLow: number | 0,
  priceHigh: number | 0,
  sort: {
    type: string | "" // price/name,
    order: string | "" //asc/desc
  }
}