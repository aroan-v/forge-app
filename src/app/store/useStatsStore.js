import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useStatsStore = create(
  immer((set, get) => ({
    userData: {},
    userComputedStats: null,
    isLoading: true,

    targetNutrients: {
      targetCalories: null,
      targetProtein: null,
    },

    currentNutrients: {
      currentCalories: 0,
      currentProtein: 0,
    },

    setUserData: (data) =>
      set((state) => {
        state.userData = data
      }),

    setShallowState: (newData) =>
      set((state) => ({
        ...state,
        ...newData,
      })),

    setTargets: ({ targetCalories, targetProtein }) =>
      set((state) => {
        state.targetNutrients.targetCalories = targetCalories
        state.targetNutrients.targetProtein = targetProtein
      }),

    addNutrients: ({ calories, protein }) =>
      set((state) => {
        state.currentNutrients.currentCalories += calories
        state.currentNutrients.currentProtein += protein
      }),

    resetCurrentNutrients: () =>
      set((state) => {
        state.currentNutrients.currentCalories = 0
        state.currentNutrients.currentProtein = 0
      }),
  }))
)
