import { Metadata } from "next";
import ProductClientLoader from "./ProductClientLoader";

export const metadata: Metadata = {
  title: "상품 관리",
  description: "판매 중인 상품 목록을 확인하세요.",
};

export default function Page() {
  return <ProductClientLoader />;
}