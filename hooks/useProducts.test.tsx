import { renderHook, waitFor, act } from '@testing-library/react';
import { useProducts } from './useProducts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';

// 1. 테스트용 서버 설정
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

// 2. TanStack Query를 위한 Wrapper 생성
// 테스트마다 새로운 QueryClient를 만들어 데이터가 섞이지 않게 합니다.
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // 테스트 시 재시도 로직을 꺼서 속도를 높입니다.
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useProducts 커스텀 훅 테스트', () => {
  
  /**
   * 테스트 1: 데이터 로딩 검증
   * 목적: 훅이 처음 호출되었을 때 MSW로부터 초기 데이터를 잘 가져오는지 확인합니다.
   */
  it('초기 상품 목록을 성공적으로 불러와야 한다', async () => {
    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

    // 처음에는 로딩 중이다가...
    expect(result.current.isLoading).toBe(true);

    // 데이터가 로드될 때까지 기다립니다.
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products.length).toBe(1);
    expect(result.current.products[0].name).toBe('MSW 맥북');
  });

  /**
   * 테스트 2: 상품 추가(Mutation) 검증
   * 목적: addProduct 함수를 호출했을 때 목록이 갱신되는지 확인합니다.
   */
  it('addProduct 호출 시 새로운 상품이 목록에 추가되어야 한다', async () => {
    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 신규 상품 등록 실행
    await result.current.addProduct({
      name: '신제품',
      price: 1000,
      category: '기타'
    });

    // TanStack Query의 무효화(Invalidation)가 일어나고 목록이 2개가 될 때까지 대기
    await waitFor(() => expect(result.current.products.length).toBe(2));
    expect(result.current.products[0].name).toBe('신제품');
  });

  /**
   * 테스트 3: 상품 삭제 검증
   * 목적: deleteProduct 호출 시 confirm을 거쳐 데이터가 사라지는지 확인합니다.
   */
  it('deleteProduct 호출 시 상품이 목록에서 제거되어야 한다', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.deleteProduct('1');
    });

    // 삭제 후 목록이 0이 되는지 확인
    await waitFor(() => expect(result.current.products.length).toBe(0), { timeout: 3000 });
  });
});