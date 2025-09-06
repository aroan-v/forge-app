import { PcCase } from 'lucide-react'
import { create } from 'zustand'

export const useFoodStore = create((set, get) => ({
  loggedFood: {
    meal1: {
      name: 'breakfast',
      id: 'breakfast232',
      meals: [
        {
          food: 'Rice',
          value: 150, // grams
          unit: 'g',
          id: 'ricedwdee',
        },
        {
          food: 'Egg',
          value: 2, // 2 pcs
          unit: 'pcs',
          id: 'eggdeed',
        },
        {
          food: 'Chicken Breast',
          value: 120, // grams
          unit: 'g',
          id: '343434',
        },
        {
          food: 'Banana',
          value: 1, // 1 pc
          unit: 'pcs',
          id: '3434',
        },
        {
          food: 'Peanut Butter',
          value: 2, // 2 tbsp (custom quantity unit)
          unit: 'tbsp',
          id: '343434',
        },
      ],
    },
  },
  foodBank: {},

  setFoodBank: (foodObject) =>
    set((prev) => {
      // guard clause: only allow non-null objects
      if (!foodObject || typeof foodObject !== 'object' || Array.isArray(foodObject)) {
        return prev
      }

      console.log('foodObject recieved', foodObject)
      const newFoodBank = { ...prev.foodBank }

      // Expected format of foodObject
      /*
            const foodBank = {
            egg: {
                servings: {
                piece: {
                    quantity: 1,        // base unit = 1 piece
                    calories: 75,       // macros for 1 piece
                    protein: 6
                },
                gram: {
                    quantity: 1,        // base unit = 1 gram
                    calories: 1.5,      // macros per gram
                    protein: 0.08
                }
                }
            },
            rice: {
                servings: {
                gram: {
                    quantity: 1,        // base unit = 1 gram
                    calories: 1.3,      // macros per gram
                    protein: 0.025
                },
                cup: {
                    quantity: 1,        // base unit = 1 cup
                    calories: 200,
                    protein: 4
                }
                }
            }
            }
        */

      // sample foodObject
      /*
        const sampleFoodObject = {
            egg: {
                serving: piece,
                quantity: 1,
                calories: 75,
                protein: 7
            }
        }
        */

      for (const food in foodObject) {
        console.log('logging food:', food)
        //   check if the food already exists

        const foodData = foodObject[food]

        if (!newFoodBank[food]) {
          newFoodBank[food] = {
            servings: {},
          }
        }

        newFoodBank[food].servings[foodData.serving] = {
          quantity: foodData.quantity,
          calories: foodData.calories,
          protein: foodData.protein,
        }
      }

      return {
        foodBank: newFoodBank,
      }
    }),

  getUnregisteredFood: null,

  //   isLoading: true,
  //   combinedData: null,
  //   combinedDelta: null,
  //   dailySnapshots: {},
  //   selectedDate: snapshotDates.at(-1) || null,
  //   finalSnapshot: null,
  //   selectedDelta: () => {
  //     const state = get()
  //     if (!state.selectedDate) {
  //       return null
  //     }
  //     return state.dailySnapshots[state.selectedDate]?.combinedDelta || null
  //   },
  //   selectedGapMovement: () => {
  //     const state = get()
  //     if (!state.selectedDate) {
  //       return null
  //     }
  //     return state.dailySnapshots[state.selectedDate]?.gapMovement || null
  //   },
  //   selectedCombinedData: () => {
  //     const state = get()
  //     if (!state.selectedDate) {
  //       return null
  //     }
  //     return state.dailySnapshots[state.selectedDate]?.combinedData || null
  //   },
  //   // State setter
  //   setApiState: (newState) => set(newState),
  //   setDailySnapshot: ({ date, times, gapMovement, combinedDelta, combinedData }) =>
  //     set((state) => ({
  //       dailySnapshots: {
  //         ...state.dailySnapshots,
  //         [date]: {
  //           times,
  //           gapMovement,
  //           combinedDelta,
  //           combinedData,
  //         },
  //       },
  //     })),
}))
