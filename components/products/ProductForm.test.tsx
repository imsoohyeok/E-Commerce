import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from './ProductForm';
import { vi } from 'vitest';

describe('ProductForm 컴포넌트 테스트', () => {
  it('상품명이 2글자 미만이면 에러 메시지를 표시해야 한다', async () => {
    const mockSuccess = vi.fn();
    render(<ProductForm onSuccess={mockSuccess} />);

    // 1. 상품명 입력 칸에 '가' 하나만 입력 (2글자 미만)
    const nameInput = screen.getByLabelText(/상품명/i);
    fireEvent.change(nameInput, { target: { value: '가' } });

    // 2. 등록 버튼 클릭
    const submitButton = screen.getByRole('button', { name: /등록하기/i });
    fireEvent.click(submitButton);

    // 3. 에러 메시지가 화면에 나타나는지 확인
    const errorMessage = await screen.findByText(/상품명은 2글자 이상이어야 합니다/i);
    expect(errorMessage).toBeDefined();
    
    // 4. 성공 함수가 호출되지 않았어야 함
    expect(mockSuccess).not.toHaveBeenCalled();
  });

  it('올바른 값을 입력하고 제출하면 onSuccess 함수가 호출되어야 한다', async () => {
    const mockSuccess = vi.fn();
    render(<ProductForm onSuccess={mockSuccess} />);

    // 1. 올바른 값 입력
    fireEvent.change(screen.getByLabelText(/상품명/i), { target: { value: '테스트 상품' } });
    fireEvent.change(screen.getByLabelText(/가격/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/카테고리/i), { target: { value: '전자기기' } });

    // 2. 등록 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: /등록하기/i }));

    screen.debug();

    // 3. 기대 결과: mockSuccess 함수가 우리가 입력한 값과 함께 호출되었는가?
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith({
        name: '테스트 상품',
        price: 50000,
        category: '전자기기',
      });
    });
  });
});