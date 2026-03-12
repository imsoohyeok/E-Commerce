"use client";

import dynamic from "next/dynamic";

const ProductClient = dynamic(() => import("./ProductClient"), {
  ssr: false,
  loading: () => <div className="p-8 text-center animate-pulse">페이지 로딩 중...</div>
});

export default function ProductClientLoader() {
  return <ProductClient />;
}