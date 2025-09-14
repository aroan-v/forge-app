import { PcCase } from 'lucide-react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import { devError, devLog } from '@/lib/logger'
import { current, produce } from 'immer'

export const useFoodStore = create(
  immer((set, get) => ({
    loggedFood: [
      {
        name: 'Breakfast',
        id: 'breakfast_silog232',
        meals: [
          {
            food: 'Garlic Fried Rice (Sinangag)',
            value: 200, // grams
            unit: 'g',
            id: 'sinangag2023',
            displayValue: '200 g',
          },
          {
            food: 'Fried Egg',
            value: 2, // 2 pcs
            unit: 'pcs',
            id: 'itlog2023',
            displayValue: '2 pcs',
          },
          {
            food: 'Longganisa (Sweet Pork Sausage)',
            value: 3, // 3 pcs
            unit: 'pcs',
            displayValue: '3 pcs',
          },
          {
            food: 'Tomato & Cucumber Side Salad',
            value: 100, // grams
            unit: 'g',
            id: 'ensalada2023',
            displayValue: '100 g',
          },
        ],
      },
    ],
    foodBank: {},

    addFoodGroup: () =>
      set((state) => {
        state.loggedFood.push({
          name: null,
          id: nanoid(), // or use Date.now(), whatever you prefer
          meals: [
            {
              food: null,
              value: 0,
              unit: '',
              id: nanoid(),
            },
          ],
        })
      }),

    deleteFoodGroup: (groupId) =>
      set((state) => ({
        loggedFood: state.loggedFood.filter(({ id }) => id !== groupId),
      })),

    addMealRow: (targetId) => {
      set((state) => {
        const targetGroup = state.loggedFood.find(({ id }) => id === targetId)
        if (!targetGroup) return
        targetGroup.meals.push({
          food: null,
          value: 0,
          unit: '',
          id: nanoid(),
        })
      })
    },

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

    getUnregisteredFoods: () => {
      const currentState = get()
      const foodWithoutNutrition = {}

      currentState.loggedFood.forEach(({ meals, id: groupId }) => {
        meals.forEach((foodObj) => {
          const { food, id: foodId, displayValue, protein, calories } = foodObj

          if (food && foodId && displayValue && (protein == null || calories == null)) {
            if (!foodWithoutNutrition[groupId]) {
              foodWithoutNutrition[groupId] = {}
            }

            foodWithoutNutrition[groupId][foodId] = {
              food,
              displayValue,
            }
          }
        })
      })

      return foodWithoutNutrition
    },

    updateGroupName: ({ groupId, groupName }) =>
      set((state) => {
        const targetGroup = state.loggedFood.find(({ id }) => id === groupId)

        if (targetGroup) {
          targetGroup.name = groupName
        }
      }),

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
        console.log('received nutrition data', nutritionData)

        state.loggedFood.forEach((groupMeal) => {
          const enrichedGroup = nutritionData[groupMeal.id]
          if (!enrichedGroup) return

          groupMeal.meals.forEach((food) => {
            const enriched = enrichedGroup[food.id]
            if (!enriched) return

            // ✅ Safe to mutate via Immer
            food.calories = Number(enriched.calories)
            food.protein = Number(enriched.protein)
          })
        })
      }),

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
  }))
)

export const useFoodStoreVersionTwo = create((set, get) => ({
  foodGroups: ['breakfast_silog232'],

  badNutritionResponses: [],

  groupsById: {
    breakfast_silog232: {
      name: 'Breakfast Version Two',
      mealIds: ['sinangag2023', 'itlog2023', 'longganisa_123', 'ensalada2023'],
      totalProtein: null,
      totalCalories: null,
    },
  },

  mealsById: {
    sinangag2023: {
      food: 'Garlic Fried Rice (Sinangag)',
      value: 200,
      unit: 'g',
      displayValue: '200 g',
    },
    itlog2023: {
      food: 'Fried Egg',
      value: 2,
      unit: 'pcs',
      displayValue: '2 pcs',
    },
    longganisa_123: {
      food: 'Longganisa (Sweet Pork Sausage)',
      value: 3,
      unit: 'pcs',
      displayValue: '3 pcs',
    },
    ensalada2023: {
      food: 'Tomato & Cucumber Side Salad',
      value: 100,
      unit: 'g',
      displayValue: '100 g',
    },
  },

  foodBank: {},

  addFoodGroup: () =>
    set(
      produce((state) => {
        const newId = nanoid()

        state.foodGroups.push(newId)
        state.groupsById[newId] = {
          name: '',
          mealIds: [],
          totalProtein: null,
          totalCalories: null,
        }
      })
    ),

  deleteFoodGroup: (targetGroupId) =>
    set(
      produce((state) => {
        state.foodGroups = state.foodGroups.filter((id) => id !== targetGroupId)

        const index = state.foodGroups.findIndex((id) => id === targetGroupId)
        if (index !== -1) {
          state.foodGroups.splice(index, 1)
        }

        const targetGroup = state.groupsById[targetGroupId]
        if (targetGroup) {
          const targetMealIds = targetGroup.mealIds
          delete state.groupsById[targetGroupId]

          targetMealIds.forEach((id) => {
            delete state.mealsById[id]
          })
        }
      })
    ),

  addMealRow: (targetGroupId) => {
    set(
      produce((state) => {
        const newFood = {
          id: nanoid(),
          food: null,
          value: 0,
          unit: '',
          displayValue: '',
        }

        if (state.groupsById[targetGroupId]) {
          state.groupsById[targetGroupId].mealIds.push(newFood.id)
          state.mealsById[newFood.id] = newFood
        }
      })
    )
  },

  deleteMealRow: ({ targetMealIds, targetGroupId }) => {
    set(
      produce((state) => {
        const targetGroup = state.groupsById[targetGroupId]

        if (targetGroup) {
          targetGroup.mealIds = targetGroup.mealIds.filter((id) => !targetMealIds.includes(id))

          targetMealIds.forEach((id) => {
            delete state.mealsById[id]
          })
        }
      })
    )
  },

  getUnregisteredFoods: () => {
    const currentState = get()
    const foodWithoutNutrition = {}

    for (const id in currentState.mealsById) {
      if (currentState.mealsById.hasOwnProperty(id)) {
        const { food, displayValue, protein, calories } = currentState.mealsById[id]

        if (food && displayValue && (protein == null || calories == null)) {
          foodWithoutNutrition[id] = {
            food,
            displayValue,
          }
        }
      }
    }

    return foodWithoutNutrition
  },

  updateGroupName: ({ groupId, groupName }) =>
    set(
      produce((state) => {
        const targetGroup = state.groupsById[groupId]

        if (targetGroup) {
          targetGroup.name = groupName
        }
      })
    ),

  updateLoggedFoodName: ({ foodId, foodName }) =>
    set(
      produce((state) => {
        if (state.mealsById[foodId]) {
          state.mealsById[foodId].food = foodName
        } else {
          devError('foodId not found', foodId)
        }
      })
    ),

  updateLoggedFoodAmount: ({ foodId, displayValue }) =>
    set(
      produce((state) => {
        if (state.mealsById[foodId]) {
          state.mealsById[foodId].displayValue = displayValue
        } else {
          devError('foodId not found', foodId)
        }
      })
    ),

  // updateLoggedFoodWithNutrition: (nutritionData) =>
  //   set((state) => {
  //     console.log('received nutrition data', nutritionData)

  //     state.loggedFood.forEach((groupMeal) => {
  //       const enrichedGroup = nutritionData[groupMeal.id]
  //       if (!enrichedGroup) return

  //       groupMeal.meals.forEach((food) => {
  //         const enriched = enrichedGroup[food.id]
  //         if (!enriched) return

  //         // ✅ Safe to mutate via Immer
  //         food.calories = Number(enriched.calories)
  //         food.protein = Number(enriched.protein)
  //       })
  //     })
  //   }),

  updateLoggedFoodWithNutrition: (nutritionData) =>
    set(
      produce((state) => {
        state.badNutritionResponses = []

        for (const id in nutritionData) {
          const entry = nutritionData[id]

          if (!state.mealsById[id]) {
            state.badNutritionResponses.push({ id, ...entry })
            continue
          }

          if (!entry?.calories && !entry?.protein) {
            state.badNutritionResponses.push({ id, ...entry })
            continue
          }

          Object.assign(state.mealsById[id], {
            calories: entry.calories,
            protein: entry.protein,
          })
        }

        for (const groupId in state.groupsById) {
          const mealIds = state.groupsById[groupId].mealIds

          const { totalCalories, totalProtein } = mealIds.reduce(
            (acc, mealId) => {
              const meal = state.mealsById[mealId]
              acc.totalCalories += Number(meal.calories ?? 0)
              acc.totalProtein += Number(meal.protein ?? 0)
              return acc
            },
            { totalCalories: 0, totalProtein: 0 }
          )

          state.groupsById[groupId].totalCalories = +totalCalories.toFixed(1)
          state.groupsById[groupId].totalProtein = +totalProtein.toFixed(1)
        }
      })
    ),

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
}))
