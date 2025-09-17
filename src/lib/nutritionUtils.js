export function calculateBMR({ weight, height, age, gender }) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  }

  return Math.round(bmr * (multipliers[activityLevel] || 1.2))
}

export function calculateCalorieGoal(tdee, goal) {
  if (goal === 'cut') return Math.round(tdee - 500) // ~0.5kg loss per week
  if (goal === 'bulk') return Math.round(tdee + 300) // lean gain
  return tdee // maintain
}

export function calculateProteinTarget(weight) {
  const gramsPerKg = 2 // you can adjust based on goal later
  return Math.round(weight * gramsPerKg)
}

export function calculateFatTarget(calories) {
  const fatCalories = calories * 0.25
  return Math.round(fatCalories / 9) // 9 kcal per gram of fat
}

export function calculateCarbTarget(calories, proteinGrams, fatGrams) {
  const proteinCalories = proteinGrams * 4
  const fatCalories = fatGrams * 9
  const remainingCalories = calories - (proteinCalories + fatCalories)
  return Math.max(0, Math.round(remainingCalories / 4)) // 4 kcal per gram of carb
}

export function calculateBMI({ weight, height }) {
  const heightMeters = height / 100
  return (weight / (heightMeters * heightMeters)).toFixed(1)
}

export function calculateHydration(weight) {
  return Math.round(weight * 35)
}

export function generateUserStats(userData) {
  const { name, weight, height, age, gender, goal, activityLevel } = userData

  const bmr = calculateBMR({ weight, height, age, gender })
  const tdee = calculateTDEE(bmr, activityLevel)
  const calorieGoal = calculateCalorieGoal(tdee, goal)
  const proteinTarget = calculateProteinTarget(weight)
  const fatTarget = calculateFatTarget(calorieGoal)
  const carbTarget = calculateCarbTarget(calorieGoal, proteinTarget, fatTarget)
  const bmi = calculateBMI({ weight, height })
  const hydration = calculateHydration(weight)

  return {
    name: name || 'Guest',
    bmr,
    tdee,
    calorieGoal,
    proteinTarget,
    fatTarget,
    carbTarget,
    bmi,
    hydration,
  }
}

export function getBmiRating(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' }
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' }
  return { label: 'Obese', color: 'text-red-500' }
}
