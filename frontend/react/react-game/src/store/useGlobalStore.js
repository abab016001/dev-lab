import { create } from "zustand";

export const useGlobalStore = create((set, get) => ({
  /** game - uuid */
  uuid: 1,
  refreshGame: () => {
    set({ uuid: crypto.randomUUID() });
    set({ step: 0 });
  },

  /** level */
  level: 1,
  setLevel: (val) => set({ level: val }),

  /** score */
  getScore: () => {
    const { step } = get();
    return Math.floor((1 - ((step - 3) / 9)) * 100);
  },

  /** step */
  step: 0,
  setStep: (val) => set({ step: val }),

  /** page */
  page: 1,
  setPage: (value, keep_global_page = false) => {
    if (!keep_global_page) {
      set({ globalPage: "" })
    }
    set({ page: value })

    if (value == 1) {
      set({ level: 1 }); // 初始化
      set({ score: 0 }); // 初始化
      set({ step: 0 }); // 初始化
    }
  },

  /** globalPage */
  globalPage: "",
  setGlobalPage: (value) => set({ globalPage: value }),

  /** GameOver */
  gameOver: { "msg": "", "winner": "" },
  setGameOver: ({ msg, winner }) => set({ gameOver: { msg, winner } })
}))