export type ProductStatus = "판매중" | "품절" | "숨김";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
}