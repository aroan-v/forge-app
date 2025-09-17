# Macro Calculator with AI

## Main Features

- Macro Tracking: Enter meals with flexible units (e.g., grams, pcs, gallons). Defaults to grams for precision.
- AI-Powered Food Analysis: Submits food entries to AI (Groq + Gemma) to compute calories and protein while ignoring non-food items.
- Local Storage Persistence: Saves user stats and meal entries with computed values for easy recall.
- Health Metrics Calculator:
  - BMI (Body Mass Index): Weight relative to height.
  - BMR (Basal Metabolic Rate): Calories burned at rest.
  - TDEE (Total Daily Energy Expenditure): Daily calories burned including activity.
  - Water Intake Recommendation: Based on user stats.
- Progress Tracking: Compares consumed macros against calculated calories and protein targets.

## Limitations

- AI Dependence: Food recognition relies on AI accuracy — occasional misclassifications possible.
- No Offline AI: Requires an internet connection for AI-powered calculations.
- Local Only: Data is stored in browser localStorage, so progress is device-specific.

## Other Explored Concepts Through Research

- Next.js API Routes for integrating external AI models.
- State Management with Zustand for global store handling.
- UI/UX Theming with TailwindCSS and DaisyUI.
- Component Libraries: ShadCN for interactive and accessible UI elements.
- AI Integration with Groq SDK and Gemma model for structured chat + nutrition analysis.
- Developer Tooling: Custom dev logging with `@/lib/logger`.

## Applications Used

- Visual Studio Code – development
- Figma – design elements and prototyping
- Git & GitHub – version control

## Author

aroan-v
