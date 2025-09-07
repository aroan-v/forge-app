import { PcCase } from 'lucide-react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useFoodStore = create(
  immer((set, get) => ({
    loggedFood: [
      {
        name: 'breakfast',
        id: 'breakfast232',
        meals: [
          {
            food: 'Rice',
            value: 150, // grams
            unit: 'g',
            id: 'ricedwdee',
            displayValue: '150 g', // combined string
          },
          {
            food: 'Egg',
            value: 2, // 2 pcs
            unit: 'pcs',
            id: 'eggdeed',
            displayValue: '2 pcs',
          },
          {
            food: 'Chicken Breast',
            value: 120, // grams
            unit: 'g',
            id: '343434',
            displayValue: '120 g',
          },
          {
            food: 'Banana',
            value: 1, // 1 pc
            unit: 'pcs',
            id: '3434wewc',
            displayValue: '1 pcs',
          },
          {
            food: 'Peanut Butter',
            value: 2, // 2 tbsp (custom quantity unit)
            unit: 'tbsp',
            id: '3434sdsd34',
            displayValue: '2 tbsp',
          },
        ],
      },
    ],
    foodBank: {},

    addMealRow: (targetId) => {
      set((state) => {
        const targetGroup = state.loggedFood.find(({ id }) => id === targetId)
        if (!targetGroup) return
        targetGroup.meals.push({
          food: null,
          value: 0,
          unit: '',
          id: Date.now().toString(36) + Math.random().toString(36).substring(2, 10),
        })
      })
    },

    getUnregisteredFoods: () => {
      const currentState = get()
      const foodWithoutNutrition = {}

      currentState.loggedFood.forEach(({ meals, id }) => {
        meals.forEach((foodObj) => {
          const { food, unit, displayValue, protein, calories } = foodObj

          // ✅ must have food + displayValue
          // ✅ must NOT already have protein & calories
          if (food && displayValue && (protein == null || calories == null)) {
            if (!foodWithoutNutrition[food]) {
              foodWithoutNutrition[food] = []
            }

            foodWithoutNutrition[food].push({
              food,
              unit,
              value: displayValue,
              groupId: id,
            })
          }
        })
      })

      return foodWithoutNutrition
    },

    updateLoggedFoodName: ({ groupId, foodId, foodName, displayValue }) =>
      set((state) => {
        const targetGroup = state.loggedFood.find(({ id }) => id === groupId)

        if (targetGroup.meals) {
          const targetMeal = targetGroup.meals.find(({ id }) => id === foodId)

          console.log('targetMeal', targetMeal)

          if (targetMeal) {
            if (foodName !== undefined) {
              targetMeal.food = foodName ?? ''
            }
          } else {
            console.warn('target meal not found')
          }
        } else {
          console.warn('target group not found')
        }
      }),

    updateLoggedFoodAmount: ({ groupId, foodId, displayValue }) =>
      set((state) => {
        const targetGroup = state.loggedFood.find(({ id }) => id === groupId)

        if (targetGroup.meals) {
          const targetMeal = targetGroup.meals.find(({ id }) => id === foodId)

          if (targetMeal) {
            if (displayValue !== undefined) {
              targetMeal.displayValue = displayValue ?? ''
            }
          } else {
            console.warn('target meal not found')
          }
        } else {
          console.warn('target group not found')
        }
      }),

    updateLoggedFoodWithNutrition: (nutritionData) =>
      set((state) => {
        // Loop through loggedFood

        console.log('recieved nutrition data', nutritionData)

        state.loggedFood.forEach((groupMeal) => {
          groupMeal.meals.forEach((food) => {
            // See if Hugging Face returned nutrition for this meal's food
            const enrichedArray = nutritionData[food.food]
            if (!enrichedArray) return

            // Match by groupId
            const enriched = enrichedArray.find((f) => f.groupId === groupMeal.id)
            if (!enriched) return

            // ✅ Mutate meal directly (Immer makes this safe)
            food.calories = Number(enriched.calories)
            food.protein = Number(enriched.protein)
          })
        })
      }),

    deleteMealRow: ({ groupId, foodIds }) => {
      set((state) => {
        // Find the target group by groupId
        const targetGroup = state.loggedFood.find((g) => g.id === groupId)

        if (targetGroup) {
          // ✅ Filter out all meals whose IDs are in foodIds
          targetGroup.meals = targetGroup.meals.filter((meal) => !foodIds.includes(meal.id))
        } else {
          console.warn(`No group found with id ${groupId}`)
        }
      })
    },
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
)
