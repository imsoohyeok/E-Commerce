"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

// 나중에 DB에서 가져올 가짜 데이터
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "맥북 프로 14 M3",
    category: "전자기기",
    price: 2990000,
    stock: 15,
    status: "판매중",
    createdAt: "2024-03-20",
  },
  {
    id: "2",
    name: "로지텍 MX Master 3S",
    category: "주변기기",
    price: 159000,
    stock: 0,
    status: "품절",
    createdAt: "2024-03-19",
  },
];

export default function ProductsPage() {
  // 1. 상품 리스트를 상태(State)로 관리합니다.
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // 2. 입력 폼의 상태를 관리합니다.
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
  });

  // 3. 등록 함수
  const handleAddProduct = () => {
    const product: Product = {
      id: Math.random().toString(36).substring(2, 9), // 임시 ID 생성
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      stock: 0,
      status: "판매중",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProducts([product, ...products]); // 기존 리스트 앞에 추가 (불변성 유지!)
    setNewProduct({ name: "", price: "", category: "" }); // 입력창 초기화
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">상품 관리</h1>
          <p className="text-muted-foreground">전체 상품 목록을 확인하고 관리합니다.</p>
        </div>
        
        {/* 상품 등록 모달 시작 */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Plus className="h-4 w-4" /> 상품 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>새 상품 등록</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">상품명</Label>
                <Input 
                  id="name" 
                  placeholder="상품 이름을 입력하세요" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">가격</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="0" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리</Label>
                <Input 
                  id="category" 
                  placeholder="카테고리 선택" 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddProduct}>등록하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 테이블 섹션 */}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toLocaleString()}원</TableCell>
                <TableCell>{product.stock}개</TableCell>
                <TableCell>
                  <Badge variant={product.status === "판매중" ? "default" : "destructive"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{product.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}