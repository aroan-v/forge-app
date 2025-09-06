// Defines the standard structure for a logged meal
export const mealSchema = {
  food: '', // string → name of the food
  value: 0, // number → amount entered (pcs or grams)
  unitType: 'weight', // enum: "weight" | "quantity"
  unit: 'g', // string → "g", "pcs", "slice", "cup", etc.
  calories: 0, // number → calculated total kcal
  protein: 0, // number → calculated total grams
}

// Options for unitType to prevent typos across app
export const UNIT_TYPES = ['weight', 'quantity']

// Predefined units depending on type
export const UNITS = {
  weight: ['g'], // only grams for now
  quantity: ['pcs', 'slice', 'cup', 'tbsp'], // can expand later
}

export const templateData = {
  food: '',
  value: 0, // grams
  unitType: 'weight',
  unit: 'g',
  calories: 0,
  protein: 0,
  id: Date.now().toString(36) + Math.random().toString(36).substring(2, 10),
}

// Example logged meals for a day
export const sampleData = [
  {
    food: 'Rice',
    value: 150, // grams
    unitType: 'weight',
    unit: 'g',
    calories: 200,
    protein: 4,
  },
  {
    food: 'Egg',
    value: 2, // 2 pcs
    unitType: 'quantity',
    unit: 'pcs',
    calories: 140, // ~70 kcal each
    protein: 12, // ~6g protein each
  },
  {
    food: 'Chicken Breast',
    value: 120, // grams
    unitType: 'weight',
    unit: 'g',
    calories: 198, // ~165 kcal per 100g
    protein: 36, // ~30g protein per 100g
  },
  {
    food: 'Banana',
    value: 1, // 1 pc
    unitType: 'quantity',
    unit: 'pcs',
    calories: 105,
    protein: 1.3,
  },
  {
    food: 'Peanut Butter',
    value: 2, // 2 tbsp (custom quantity unit)
    unitType: 'quantity',
    unit: 'tbsp',
    calories: 190, // ~95 kcal per tbsp
    protein: 8, // ~4g protein per tbsp
  },
]

export const sampleRawData = [
  {
    food: 'Rice',
    value: 150, // grams
    unit: 'g',
  },
  {
    food: 'Egg',
    value: 2, // 2 pcs
    unit: 'pcs',
  },
  {
    food: 'Chicken Breast',
    value: 120, // grams
    unit: 'g',
  },
  {
    food: 'Banana',
    value: 1, // 1 pc
    unit: 'pcs',
  },
  {
    food: 'Peanut Butter',
    value: 2, // 2 tbsp (custom quantity unit)
    unit: 'tbsp',
  },
]

// export const sampleData = [
//   {
//     food: 'Rice',
//     value: 150, // grams
//     unitType: 'weight',
//     unit: 'g',
//     calories: 200,
//     protein: 4,
//   },
//   {
//     food: 'Egg',
//     value: 2, // 2 pcs
//     unitType: 'quantity',
//     unit: 'pcs',
//     calories: 140, // ~70 kcal each
//     protein: 12, // ~6g protein each
//   },
//   {
//     food: 'Chicken Breast',
//     value: 120, // grams
//     unitType: 'weight',
//     unit: 'g',
//     calories: 198, // ~165 kcal per 100g
//     protein: 36, // ~30g protein per 100g
//   },
//   {
//     food: 'Banana',
//     value: 1, // 1 pc
//     unitType: 'quantity',
//     unit: 'pcs',
//     calories: 105,
//     protein: 1.3,
//   },
//   {
//     food: 'Peanut Butter',
//     value: 2, // 2 tbsp (custom quantity unit)
//     unitType: 'quantity',
//     unit: 'tbsp',
//     calories: 190, // ~95 kcal per tbsp
//     protein: 8, // ~4g protein per tbsp
//   },
// ]
