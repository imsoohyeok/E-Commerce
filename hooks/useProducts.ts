// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";

export function useProducts() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // 1. [GET] 데이터 조회 (useQuery)
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"], // 이 키가 캐시를 식별하는 고유 이름입니다.
    queryFn: () => fetch("/api/products").then((res) => res.json()),
  });

  // 2. [POST] 데이터 추가 (useMutation)
  const addMutation = useMutation({
    mutationFn: (newProduct: Partial<Product>) =>
      fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
      }),
    onSuccess: () => {
      // 등록 성공 시 'products' 키를 무효화하여 목록을 자동 리프레시합니다!
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      toast.success("상품이 등록되었습니다.");
    },
  });

  // 3. [DELETE] 데이터 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.error("상품이 삭제되었습니다.");
    },
  });

  // 상태 변경 Mutation
  const toggleMutation = useMutation({
    mutationFn: (id: string) => {
      // 현재 상품을 찾아 상태를 반전시켜 서버에 보냅니다.
      const product = products.find((p) => p.id === id);
      const newStatus = product?.status === "판매중" ? "품절" : "판매중";
      
      return fetch(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("상태가 변경되었습니다.");
    },
  });

  // 가격 수정 Mutation
  const updatePriceMutation = useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) =>
      fetch(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ price }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingId(null); // 수정 모드 종료
      toast.info("가격이 수정되었습니다.");
    },
  });

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
    addProduct: addMutation.mutate,
    toggleStatus: toggleMutation.mutate,
    updatePrice: (id: string) => {
      if (editValue < 100) return alert("최소 100원 이상이어야 합니다.");
      updatePriceMutation.mutate({ id, price: editValue });
    },
    deleteProduct: (id: string) => {
      if (confirm("정말 삭제하시겠습니까?")) deleteMutation.mutate(id);
    },
  }
}