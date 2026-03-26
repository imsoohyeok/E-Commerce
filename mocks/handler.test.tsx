import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { Product } from '@/types/product';

// 테스트 환경에서 사용할 가짜 서버(Node용)를 설정합니다.
const server = setupServer(...handlers);

// [설정] 테스트 시작 전, 가짜 서버를 가동합니다.
beforeAll(() => server.listen());

// [정리] 각 테스트가 끝날 때마다 상태를 초기화합니다.
afterEach(() => {
  server.resetHandlers(); // 핸들러 설정을 초기화하여 테스트 간 간섭을 방지합니다.
  localStorage.clear();   // 로컬스토리지(가짜 DB)를 비워 데이터 격리를 보장합니다.
});

// [종료] 모든 테스트가 완료되면 서버를 완전히 정지합니다.
afterAll(() => server.close());

describe('MSW API 핸들러 통합 테스트', () => {
  
  /**
   * 테스트 1: 초기 데이터 로딩 검증
   * 목적: API 호출 시 기본으로 설정된 상품 목록이 정상적으로 반환되는지 확인합니다.
   */
  it('GET /api/products: 초기 상품 목록을 정확히 반환해야 한다', async () => {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json() as Product[]; // 응답을 Product 배열로 캐스팅

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe('MSW 맥북'); // 초기 데이터의 상품명 검증
  });

  /**
   * 테스트 2: 신규 상품 등록 및 데이터 유지 검증
   * 목적: POST 요청 후 반환된 데이터가 올바른지, 그리고 실제 목록에 추가되었는지 확인합니다.
   */
  it('POST /api/products: 새로운 상품을 등록하고 목록에 반영해야 한다', async () => {
    // 서버에서 생성할 필드(id, createdAt 등)를 제외한 데이터 준비
    const newProductInput: Omit<Product, 'id' | 'createdAt' | 'status' | 'stock'> = { 
      name: '아이패드 프로', 
      price: 1200000, 
      category: '전자기기' 
    };

    // 1. 상품 등록 요청 (POST)
    const postRes = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductInput),
    });
    const created = await postRes.json() as Product;

    expect(postRes.status).toBe(201);
    expect(created.id).toBeDefined(); // 서버(MSW)가 자동으로 ID를 부여했는지 확인
    expect(created.name).toBe('아이패드 프로');

    // 2. 전체 목록 재조회 시 방금 등록한 상품이 들어있는지 확인 (Persistence 검증)
    const getRes = await fetch('http://localhost:3000/api/products');
    const list = await getRes.json() as Product[];
    expect(list.some((p) => p.name === '아이패드 프로')).toBe(true);
  });

  /**
   * 테스트 3: 상품 정보 수정 검증
   * 목적: PATCH 요청을 통해 특정 필드(가격, 상태)가 정상적으로 업데이트되는지 확인합니다.
   */
  it('PATCH /api/products/:id: 특정 상품의 정보를 수정해야 한다', async () => {
    // 수정할 필드만 정의 (Partial 활용)
    const updateData: Partial<Product> = { price: 2800000, status: '품절' };

    const response = await fetch('http://localhost:3000/api/products/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const updated = await response.json() as Product;

    expect(response.status).toBe(200);
    expect(updated.price).toBe(2800000); // 수정된 가격 확인
    expect(updated.status).toBe('품절');    // 수정된 상태 확인
  });

  /**
   * 테스트 4: 상품 삭제 검증
   * 목적: DELETE 요청 후 해당 상품이 목록에서 실제로 사라지는지 확인합니다.
   */
  it('DELETE /api/products/:id: 상품을 삭제하고 목록에서 제거해야 한다', async () => {
    // 1. 삭제 요청 (DELETE)
    const deleteRes = await fetch('http://localhost:3000/api/products/1', {
      method: 'DELETE',
    });
    expect(deleteRes.status).toBe(204); // 삭제 성공 시 No Content(204) 확인

    // 2. 전체 목록 조회 시 ID가 1인 상품이 없는지 최종 확인
    const getRes = await fetch('http://localhost:3000/api/products');
    const list = await getRes.json() as Product[];
    expect(list.find(p => p.id === "1")).toBeUndefined();
  });
});