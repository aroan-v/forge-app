# Macro Calculator with AI

## Description

Tracking meals can feel overwhelming, especially when standard macro trackers force you to pick from limited serving options or predefined ingredients. It’s easy to get lost in all the details and feel restricted by the app. That’s why I wanted to make it simpler and more accessible.

With the power of AI—using Gemma (by Google and Gemini) and Groq as the API provider—you can now just type a detailed description of what you ate along with the serving size (which defaults to grams). The AI calculates calories and protein more accurately than traditional macro apps, handling the nuances of ingredients and portions for you.

All you really need is your weighing scale and a record of what you ate. Input the details, and let AI do the math. Simple, fast, and precise.

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
