import { http, HttpResponse } from 'msw'
import { Product } from "@/types/product";

const DB_KEY = 'msw-products-storage';

const getDB = (): Product[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(DB_KEY);
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "MSW 맥북", category: "전자기기", price: 2500000, stock: 10, status: "판매중", createdAt: "2024-03-20" }
    ];
  }
  return [];
};

let products: Product[] = getDB();

const saveDB = (data: Product[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const handlers = [
  // 데이터 조회
  http.get('/api/products', () => HttpResponse.json(products)),

  // 데이터 추가
  http.post('/api/products', async ({ request }) => {
    const body = (await request.json()) as Omit<Product, 'id' | 'createdAt' | 'status' | 'stock'>;
    
    const newProduct: Product = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split("T")[0],
      status: "판매중",
      stock: 0
    };

    products = [newProduct, ...products];
    saveDB(products);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // 데이터 수정
  http.patch('/api/products/:id', async ({ request, params }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Product>;
    
    products = products.map(p => p.id === id ? { ...p, ...updates } : p);
    saveDB(products);
    
    const updatedProduct = products.find(p => p.id === id);
    return HttpResponse.json(updatedProduct, { status: 200 });
  }),

  // 데이터 삭제
  http.delete('/api/products/:id', ({ params }) => {
    const { id } = params;
    products = products.filter(p => p.id !== id);
    saveDB(products);
    return new HttpResponse(null, { status: 204 });
  }),
];