import { productsType } from "@/types/VendingMachineType";

// 자판기 제품 정보
export const initProducts: productsType[] = [
  { id: 1, name: "Coke", price: 1100, color: "#e5322b", quantity: 5 },
  { id: 2, name: "Water", price: 600, color: "#0088c0", quantity: 10 },
  { id: 3, name: "Coffee", price: 700, color: "#623e27", quantity: 10 },
];

// 결제 완료된 제품 목록
export const initPurchasedProducts: Record<string, number> =
  initProducts.reduce((t: Record<string, number>, v) => {
    t[v.name] = 0;
    return t;
  }, {});
