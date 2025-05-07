import { create } from "zustand";
import { msgByStep } from "@/constants/step";

type StepStoreType = {
  step: number;
  stepMsg: string;
  setStatus: (state: number) => void;
};

export const useStep = create<StepStoreType>()((set) => ({
  step: 0,
  stepMsg: msgByStep[0],
  setStatus: (state) => set({ step: state, stepMsg: msgByStep[state] }),
}));
