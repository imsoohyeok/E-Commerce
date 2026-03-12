// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

// 가짜 상품 데이터베이스
const products = [
  { id: "1", name: "MSW로 가져온 맥북", category: "전자기기", price: 2500000 },
];

export const handlers = [
  // GET /api/products 요청이 오면 상품 목록을 반환
  http.get('/api/products', () => {
    return HttpResponse.json(products)
  }),

  // POST /api/products 요청이 오면 새로운 상품 추가 (흉내만 내기)
  http.post('/api/products', async ({ request }) => {
    const newProduct = await request.json()
    return HttpResponse.json(newProduct, { status: 201 })
  }),
]