"use client";

import dynamic from 'next/dynamic';
import { Plus, Trash2 } from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";

const HeavyProductForm = dynamic(() => import('@/components/products/ProductForm'), {
  loading: () => <div className="p-8 text-center animate-pulse">폼을 준비하는 중...</div>,
  ssr: false, 
});

export default function ProductsPage() {
  const {
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
  } = useProducts();

  if (isLoading) return <div className="p-20 text-center text-muted-foreground">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">상품 관리</h1>
          <p className="text-muted-foreground">전체 상품 목록을 확인하고 관리합니다.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Plus className="h-4 w-4" /> 상품 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>새 상품 등록</DialogTitle>
            </DialogHeader>
            {open && <HeavyProductForm onSuccess={addProduct} />}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>재고</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="h-8 w-28"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") updatePrice(product.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                      />
                      <Button size="sm" className="h-8 px-2" onClick={() => updatePrice(product.id)}>저장</Button>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-slate-100 p-1 rounded-md transition-colors inline-block"
                      onClick={() => {
                        setEditingId(product.id);
                        setEditValue(product.price);
                      }}
                    >
                      {product.price.toLocaleString()}원
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.stock}개</TableCell>
                <TableCell>
                  <Badge 
                    onClick={() => toggleStatus(product.id)}
                    className="cursor-pointer hover:opacity-80"
                    variant={product.status === "판매중" ? "default" : "destructive"}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{product.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" size="icon" className="text-destructive"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}