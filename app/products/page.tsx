"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Product } from "@/types/product";

// zod 스키마
const formSchema = z.object({
  name: z.string().min(2, "상품명은 2글자 이상이어야 합니다."),
  price: z.coerce.number().min(100, "가격은 최소 100원 이상이어야 합니다."),
  category: z.string().min(1, "카테고리를 입력해주세요."),
});

// 더미 데이터
const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "맥북 프로 14 M3", category: "전자기기", price: 2990000, stock: 15, status: "판매중", createdAt: "2024-03-20" },
  { id: "2", name: "로지텍 MX Master 3S", category: "주변기기", price: 159000, stock: 0, status: "품절", createdAt: "2024-03-19" },
];

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("my-products");
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    }
    return INITIAL_PRODUCTS;
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // 폼 초기화 (react-hook-form)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
    },
  });

  // 데이터 변경 시마다 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem("my-products", JSON.stringify(products));
  }, [products]);

  // 등록 처리 함수 + Toast
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const product: Product = {
      id: crypto.randomUUID(),
      ...values,
      stock: 0,
      status: "판매중",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProducts([product, ...products]);
    form.reset();
    setOpen(false);
    
    toast.success("상품이 등록되었습니다.");
  };

  // 삭제 함수
  const handleDeleteProduct = (id: string) => {
    if (!confirm("정말 이 상품을 삭제하시겠습니까?")) return;
    setProducts(products.filter((product) => product.id !== id));

    toast.error("상품이 삭제되었습니다.");
  };

  // 상태 변경 토글 함수
  const handleStatusToggle = (id: string) => {
  setProducts(
    products.map((product) =>
      product.id === id
        ? { ...product, status: product.status === "판매중" ? "품절" : "판매중" }
        : product
      )
    );

    toast.success("상태가 변경되었습니다.");
  };

  // 가격 수정 완료 함수
  const handlePriceUpdate = (id: string) => {
    if (editValue < 100) {
      alert("가격은 최소 100원 이상이어야 합니다.");
      return;
    }

    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, price: editValue } : product
      )
    );
    setEditingId(null);

    toast.info("가격이 수정되었습니다.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">상품 관리</h1>
          <p className="text-muted-foreground">전체 상품 목록을 확인하고 관리합니다.</p>
        </div>
        
        {/* 상품 등록 모달 */}
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상품명</FormLabel>
                      <FormControl><Input placeholder="상품명을 입력하세요" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>가격</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          value={field.value as number} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <FormControl><Input placeholder="카테고리 선택" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="w-full">등록하기</Button>
                </DialogFooter>
              </form>
            </Form>
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
                          if (e.key === "Enter") handlePriceUpdate(product.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                      />
                      <Button 
                        size="sm" 
                        className="h-8 px-2" 
                        onClick={() => handlePriceUpdate(product.id)}
                      >
                        저장
                      </Button>
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
                    onClick={() => handleStatusToggle(product.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    variant={product.status === "판매중" ? "default" : "destructive"}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{product.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteProduct(product.id)}
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

export default dynamic(() => Promise.resolve(ProductsPage), {
  ssr: false,
});
