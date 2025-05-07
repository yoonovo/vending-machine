import { create } from "zustand";
import { reserveCashType } from "@/types/VendingMachineType";
import { initReserveCash, initInsertedCash } from "@/constants/cash";

type CashStoreType = {
  reserveCash: reserveCashType;
  totalInsertedCash: number;
  insertedCash: reserveCashType;
  setTotalInsertCash: (v: number) => void;
  setInsertedCash: (v: reserveCashType) => void;
  setReserveCash: (v: reserveCashType) => void;
  resetInsertedCash: () => void;
};

export const useCash = create<CashStoreType>()((set) => ({
  reserveCash: initReserveCash,
  totalInsertedCash: 0,
  insertedCash: initInsertedCash,
  setTotalInsertCash: (price) =>
    set((state) => ({
      ...state,
      totalInsertedCash: state.totalInsertedCash - price,
    })),
  setInsertedCash: (cash) =>
    set((state) => {
      const totalInsertedCash = Object.keys(cash).reduce((t, v) => {
        const key = Number(v);
        t += key * cash[key];
        return t;
      }, 0);

      return { ...state, totalInsertedCash, insertedCash: cash };
    }),
  setReserveCash: (cash) => set((state) => ({ ...state, reserveCash: cash })),
  resetInsertedCash: () =>
    set((state) => ({
      ...state,
      totalInsertedCash: 0,
      insertedCash: initInsertedCash,
    })),
}));
