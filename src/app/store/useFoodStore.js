import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { devError, devLog } from '@/lib/logger'
import { produce } from 'immer'

const loggedFood = [
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
]

const groupsById = {
  breakfast_silog232: {
    name: 'Breakfast (Sample)',
    mealIds: ['sinangag2023', 'itlog2023', 'longganisa_123', 'ensalada2023'],
    totalProtein: null,
    totalCalories: null,
  },
}

const mealsById = {
  sinangag2023: {
    food: 'Garlic Fried Rice',
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
    food: 'Longganisa',
    value: 3,
    unit: 'pcs',
    displayValue: '3 pcs',
  },
  ensalada2023: {
    food: 'Pandesal',
    value: 5,
    unit: 'pcs',
    displayValue: '5 pcs',
  },
}

export const useFoodStoreVersionTwo = create((set, get) => ({
  badNutritionResponses: [],
  foodGroups: ['breakfast_silog232'],
  groupsById: {},
  mealsById: {},
  foodBank: {},

  addFoodGroup: () =>
    set(
      produce((state) => {
        devLog('addFoodGroupInvoked')
        const groupId = nanoid()
        const mealId = nanoid()

        state.foodGroups.push(groupId)
        state.groupsById[groupId] = {
          name: '',
          mealIds: [mealId],
          totalProtein: 0,
          totalCalories: 0,
        }

        state.mealsById[mealId] = {
          food: '',
          value: null,
          unit: '',
          displayValue: '',
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

  setShallowState: (newData) =>
    set((state) => {
      devLog('setShallowState invoked')

      return {
        ...state,
        ...newData,
      }
    }),

  saveToLocalStorage: () => {
    const state = get()
    localStorage.setItem('mealsById', JSON.stringify(state.mealsById))
    localStorage.setItem('groupsById', JSON.stringify(state.groupsById))
  },

  resetSignal: 0,

  resetData: () => {
    set({
      foodGroups: [],
      groupsById: {},
      mealsById: {},
      resetSignal: get().resetSignal + 1,
    })
    get().addFoodGroup()
  },

  hydrate: ({ groupsById, mealsById }) => {
    devLog('hydrate', groupsById, mealsById)

    set({
      foodGroups: Object.keys(groupsById),
      groupsById,
      mealsById,
    })
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

  updateLoggedFoodWithNutrition: (nutritionData) =>
    set(
      produce((state) => {
        state.badNutritionResponses = []

        for (const id in nutritionData) {
          const entry = nutritionData[id]

          devLog('entry', entry)

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

      const newFoodBank = { ...prev.foodBank }

      for (const food in foodObject) {
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
