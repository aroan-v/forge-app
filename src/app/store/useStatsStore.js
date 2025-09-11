import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useStatsStore = create(
  immer((set, get) => ({
    // User’s submitted profile info (age, height, weight, gender, etc.)
    userData: {},
    userComputedStats: null,
    isLoading: true,

    // AI-calculated daily goals
    targetNutrients: {
      targetCalories: null,
      targetProtein: null,
    },

    // Running totals for today
    currentNutrients: {
      currentCalories: 0,
      currentProtein: 0,
    },

    // Actions
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
