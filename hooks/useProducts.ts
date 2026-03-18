// src/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // [GET] 상품 목록 가져오기
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("상품 로드 에러 상세:", error);
      toast.error("상품을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // [POST] 상품 등록
  const addProduct = async (values: { name: string; price: number; category: string }) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prev) => [newProduct, ...prev]);
        setOpen(false);
        toast.success("상품이 등록되었습니다.");
      }
    } catch (error) {
      console.error("상품 로드 에러 상세:", error);
      toast.error("상품 등록 중 에러가 발생했습니다.");
    }
  };

  // [DELETE] 상품 삭제
  const deleteProduct = async (id: string) => {
    if (!confirm("정말 이 상품을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.error("상품이 삭제되었습니다.");
      }
    } catch (error) {
      console.error("상품 로드 에러 상세:", error);
      toast.error("삭제 실패!");
    }
  };

  // 상태 변경 (Toggle)
  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "판매중" ? "품절" : "판매중" } : p
      )
    );
    toast.success("상태가 변경되었습니다.");
  };

  // 가격 수정
  const updatePrice = (id: string) => {
    if (editValue < 100) {
      alert("가격은 최소 100원 이상이어야 합니다.");
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: editValue } : p))
    );
    setEditingId(null);
    toast.info("가격이 수정되었습니다.");
  };

  // 컴포넌트에서 필요한 값들만 골라서 내보냅니다.
  return {
    products,
    isLoading,
    open,
    setOpen,
    editingId,
    setEditingId,
    editValue,
    setEditValue,
    addProduct,
    deleteProduct,
    toggleStatus,
    updatePrice,
  };
}