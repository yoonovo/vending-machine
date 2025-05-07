import { create } from "zustand";
import { productsType } from "@/types/VendingMachineType";
import { initProducts, initPurchasedProducts } from "@/constants/product";

type ProductsStoreType = {
  products: productsType[];
  purchasedProducts: Record<string, number>;
  completePurchase: (product: productsType) => void;
  resetPurchasedProducts: () => void;
};

export const useProducts = create<ProductsStoreType>()((set) => ({
  products: initProducts,
  purchasedProducts: initPurchasedProducts,
  completePurchase: ({ name, id }) => {
    set((state) => {
      const products = state.products.map((v) =>
        v.id === id ? { ...v, ...{ quantity: v.quantity - 1 } } : v
      );
      const purchasedProducts = {
        ...state.purchasedProducts,
        ...{
          [name]: state.purchasedProducts[name] + 1,
        },
      };

      return { products, purchasedProducts };
    });
  },
  resetPurchasedProducts: () =>
    set((state) => ({ ...state, purchasedProducts: initPurchasedProducts })),
}));
