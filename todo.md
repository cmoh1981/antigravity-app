# Project TODO

## Core Infrastructure
- [x] Data types and schemas (UserProfile, DailyCheckIn, WeatherSnapshot, MealLog, MedicationEntry, PlanOfDay, RoutineTemplate)
- [x] State management with Zustand
- [x] AsyncStorage persistence layer
- [x] Theme configuration with Korean wellness colors

## Onboarding Flow
- [x] Welcome screen with brand introduction
- [x] Goal selection screen (single select)
- [x] Body metrics input screen (height/weight required, optional fields)
- [x] Health conditions multi-select screen
- [x] Sleep profile screen (optional)
- [x] Medication history screen (skip option)
- [x] Premium teaser screen
- [x] Onboarding completion screen

## Daily Check-in
- [x] Check-in modal (15 seconds)
- [x] Mood emoji selector
- [x] Stress level selector
- [x] Digestion status (optional)
- [x] Sleep quality (optional)
- [x] Environment self-report (weather, temperature feel, air, indoor/outdoor)
- [ ] Region selection (if GPS disabled)

## Weather System
- [x] WeatherProvider interface
- [x] Mock weather provider with deterministic data
- [ ] Weather caching with TTL
- [ ] PerceivedWeatherClassifier interface (stub)

## Exercise Module
- [x] 36 routine templates (4 categories × 3 goals × 3 levels)
- [x] Category selection (PH/SO/MB/TF)
- [x] Safety gate by diseases
- [x] Safety gate by medication tags
- [x] Routine list screen
- [x] Routine detail screen
- [x] Routine execution timer with GIF placeholders

## Nutrition Module
- [x] Daily meal plan templates
- [x] Environment toppings (Anti-dust, Immune, Hydration, Mood-up)
- [x] Next-meal correction logic
- [x] Meal plan display on Home

## Sleep Module
- [x] Base sleep recommendation (7.5h)
- [x] Adjustments for stress/sleep quality
- [x] Adjustments for muscle gain/intensity
- [x] Bedtime window suggestion

## Meal Logging
- [ ] Photo capture with expo-camera
- [x] Manual tag confirmation UI
- [x] Meal log storage
- [ ] Calorie range estimation (optional)

## Medication Module
- [x] Internal drug dataset with tags
- [x] Add medication by search
- [ ] Add medication by OCR (stub)
- [x] Medication list screen
- [ ] Drug detail screen with deterministic facts
- [ ] Chatbot intent router
- [ ] Hard-coded refusal templates for medication-change questions

## LLM Adapter
- [x] LLMProvider interface
- [x] NoLLMProvider (template-based)
- [ ] OnDeviceLLMProvider (stub)
- [x] Output validators (reject unsafe content)
- [x] Fallback to templates on rejection

## Main Tabs
- [x] Home tab with summary cards
- [x] Meal tab with logging and plans
- [x] Exercise tab with categories and routines
- [x] Report tab with trends
- [x] Settings tab with profile management
- [x] Premium tab (coming soon placeholder)

## Rules Engine
- [x] Category selection logic (PH/SO/MB/TF)
- [x] Goal and level inference
- [x] Routine selection from templates
- [x] Meal plan generation
- [x] Sleep recommendation generation
- [ ] Plan caching with invalidation

## Korean Copy System
- [x] Template copy for exercise recommendations
- [x] Template copy for meal recommendations
- [x] Template copy for sleep recommendations
- [x] Coach-like, empathetic tone
- [x] Non-medical language

## Guardrails
- [ ] Intent router for chatbot queries
- [ ] Blocked intents list
- [ ] Refusal templates for medication questions
- [x] LLM output validation

## Branding
- [x] Generate custom app logo
- [x] Update app.config.ts with branding
- [x] Configure splash screen
- [x] Set up favicon and Android icons

## Polish
- [x] Icon mappings in icon-symbol.tsx
- [x] Haptic feedback on interactions
- [x] Loading states
- [x] Error handling
- [x] Empty states
