export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images?: string[];
}
export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface User {
  name: string;
  email: string;
  password?: string;
}
export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}
export type PaymentMethod = "Cash on Delivery" | "Credit/Debit Card" | "UPI";
export interface Order {
  id: string;
  userEmail: string;
  items: CartItem[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  total: number;
  date: string;
  status: "Placed";
}
