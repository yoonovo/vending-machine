import { cashReserveType, insertedCashType } from "@/types/VendingMachineType";

// 자판기 현금 정보
export const initCashReserve: cashReserveType = {
  100: 5,
  500: 5,
  1000: 5,
  5000: 0,
  10000: 0,
};

// 결제 수단이 현금 일 경우, 투입된 금액 정보
export const initInsertedCash: insertedCashType = {
  total: 0,
  count: Object.keys(initCashReserve).reduce((t: cashReserveType, v) => {
    t[v] = 0;
    return t;
  }, {}),
};
