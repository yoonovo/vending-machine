type reserveCashType = Record<number | string, number>;

type productsType = {
  id: number;
  name: string; // 제품명
  price: number; // 제품 가격
  color: string; // 제품 색
  quantity: number; // 재품 보유 수
};

export type { reserveCashType, productsType };
