# Antigravity App - Design Document

## Overview

Antigravity is a Korean consumer mobile application that generates daily personalized plans for exercise, nutrition, and sleep. The app uses weather data, user self-reports, profile information, meal logging, and medication history to provide tailored recommendations. The design follows Apple Human Interface Guidelines (HIG) for a native iOS feel.

---

## Screen List

### 1. Onboarding Flow
- **Welcome Screen**: App introduction with brand messaging
- **Goal Selection Screen**: Single-select goal (체중 관리/다이어트/근육 증가/체중 증가/스트레스 해소)
- **Body Metrics Screen**: Height/weight (required), muscle mass/fat mass/body fat %/waist (optional)
- **Health Conditions Screen**: Multi-select diseases (당뇨, 비만, 고혈압, etc.)
- **Sleep Profile Screen**: Usual bedtime/wakeup, shift work toggle
- **Medication Screen**: Skip option, add medications later
- **Premium Teaser Screen**: 유전체/검진 업로드 coming soon placeholder
- **Completion Screen**: Welcome to personalized experience

### 2. Main Tabs
- **Home Tab**: Today's summary, exercise/meal/sleep cards, AI coach button
- **Meal Tab**: Meal photo logging, daily meal plan, next-meal suggestions
- **Exercise Tab**: 4 categories (PH/SO/MB/TF), routine list, execution timer
- **Report Tab**: Trends visualization (weight/muscle/fat, compliance)
- **Settings Tab**: Profile edit, AI toggle, medication management
- **Premium Tab**: Coming soon placeholder for genetics/medical analysis

### 3. Modal Screens
- **Daily Check-in Modal**: 15-second mood/stress/digestion/sleep/environment check
- **Meal Logging Modal**: Photo capture + manual tag confirmation
- **Medication Add Modal**: Search or OCR capture
- **Drug Detail Modal**: Deterministic facts + optional LLM explanation
- **Routine Execution Screen**: Timer with exercise GIF display

---

## Primary Content and Functionality

### Home Screen
- **Today Summary Card**: Date, weather icon, overall wellness score
- **Exercise Plan Card**: Category badge (PH/SO/MB/TF), reason text, routine preview, CTA button
- **Meal Plan Card**: Daily meal plan summary, next-meal tip with correction
- **Sleep Card**: Recommended duration, bedtime suggestion
- **AI Coach FAB**: Opens chat with allowed intents only

### Meal Screen
- **Today's Meal Log**: List of logged meals with photos and tags
- **Add Meal Button**: Opens camera for photo capture
- **Daily Plan Section**: Breakfast/lunch/dinner recommendations
- **Next Meal Tip**: Correction based on previous meal analysis

### Exercise Screen
- **Category Selector**: 4 category cards (PH/SO/MB/TF) with icons
- **Routine List**: Filtered by selected category, goal, and level
- **Routine Card**: Name, duration, intensity, contraindication warnings
- **Routine Detail**: Warmup/main/cooldown breakdown, GIF placeholders
- **Execution Timer**: Countdown with current exercise display

### Report Screen
- **Compliance Chart**: Weekly/monthly exercise and meal logging adherence
- **Body Metrics Chart**: Weight/muscle/fat trends (if data provided)
- **Sleep Quality Chart**: Sleep duration and quality over time
- **Mood Tracker**: Mood emoji distribution over time

### Settings Screen
- **Profile Section**: Edit goal, body metrics, health conditions
- **Sleep Profile**: Edit bedtime/wakeup preferences
- **Medication List**: View/add/remove medications
- **AI Coach Toggle**: 온디바이스 AI 코치(베타) on/off
- **Premium Section**: Link to premium placeholder

### Premium Screen (Placeholder)
- **Coming Soon Banner**: 유전체/검진 업로드는 출시 예정
- **Feature Preview**: List of premium features
- **Notify Me Button**: Interest registration

---

## Key User Flows

### Flow 1: First Launch → Onboarding → Home
1. User opens app for first time
2. Welcome screen with "시작하기" button
3. Goal selection (single choice)
4. Body metrics input (height/weight required)
5. Health conditions multi-select
6. Sleep profile (optional, can skip)
7. Medication (optional, can skip)
8. Premium teaser
9. Completion → Navigate to Home

### Flow 2: Daily Check-in → Plan Generation
1. User opens app (returning user)
2. Daily check-in modal appears automatically
3. User selects mood emoji (1 tap)
4. User selects stress level (1 tap)
5. Optional: digestion, sleep quality
6. Environment self-report (weather, temperature feel, air, indoor/outdoor)
7. Submit → Plan regenerates
8. Home screen shows updated recommendations

### Flow 3: Meal Logging → Next Meal Correction
1. User taps "식사 기록" on Meal tab
2. Camera opens for photo capture
3. User confirms meal tags (고단백, 고탄수, etc.)
4. Meal saved to log
5. Next-meal tip updates based on analysis
6. Home card reflects correction

### Flow 4: Exercise Execution
1. User taps exercise card on Home
2. Routine detail screen opens
3. User reviews warmup/main/cooldown
4. Taps "시작하기" button
5. Execution timer starts
6. GIF shows current exercise
7. Timer progresses through routine
8. Completion screen with summary

### Flow 5: Medication Management
1. User goes to Settings → Medication
2. Taps "약 추가"
3. Option: Search by name or Camera OCR
4. Search: Type medication name, select from list
5. OCR: Capture label, confirm extracted name
6. Medication added with tags
7. Drug detail available with facts

---

## Color Choices

### Primary Palette
- **Primary**: `#4A90D9` (Calm blue - trust, health, wellness)
- **Primary Dark**: `#3A7BC8` (Darker blue for pressed states)
- **Secondary**: `#7ED321` (Fresh green - vitality, growth)

### Semantic Colors
- **Success**: `#34C759` (iOS system green)
- **Warning**: `#FF9500` (iOS system orange)
- **Error**: `#FF3B30` (iOS system red)
- **Info**: `#5AC8FA` (iOS system teal)

### Neutral Palette
- **Background Light**: `#F5F7FA` (Soft gray-blue)
- **Background Dark**: `#1C1C1E` (iOS dark mode)
- **Surface Light**: `#FFFFFF`
- **Surface Dark**: `#2C2C2E`
- **Foreground Light**: `#1C1C1E`
- **Foreground Dark**: `#F5F5F7`
- **Muted Light**: `#8E8E93`
- **Muted Dark**: `#98989D`

### Category Colors
- **PH (Purifying Home)**: `#9B59B6` (Purple - indoor calm)
- **SO (Sunlight Outdoor)**: `#F39C12` (Orange - sunny energy)
- **MB (Mood Boosting)**: `#3498DB` (Blue - mental wellness)
- **TF (Temperature Fit)**: `#1ABC9C` (Teal - adaptability)

### Mood Emoji Colors
- 😄 `#FFD93D` (Bright yellow)
- 🙂 `#6BCB77` (Soft green)
- 😐 `#4D96FF` (Neutral blue)
- 😣 `#FF6B6B` (Soft red)
- 😤 `#C34A36` (Deep red)

---

## Typography

Following iOS system fonts:
- **Large Title**: SF Pro Display, 34pt, Bold
- **Title 1**: SF Pro Display, 28pt, Bold
- **Title 2**: SF Pro Display, 22pt, Bold
- **Title 3**: SF Pro Text, 20pt, Semibold
- **Headline**: SF Pro Text, 17pt, Semibold
- **Body**: SF Pro Text, 17pt, Regular
- **Callout**: SF Pro Text, 16pt, Regular
- **Subhead**: SF Pro Text, 15pt, Regular
- **Footnote**: SF Pro Text, 13pt, Regular
- **Caption**: SF Pro Text, 12pt, Regular

---

## Component Patterns

### Cards
- Rounded corners: 16px
- Shadow: subtle drop shadow (0 2px 8px rgba(0,0,0,0.08))
- Padding: 16px
- Background: surface color

### Buttons
- Primary: Filled with primary color, white text
- Secondary: Outlined with primary color border
- Destructive: Filled with error color
- Corner radius: 12px (large), 8px (medium)

### Input Fields
- Border radius: 10px
- Border: 1px solid border color
- Focus: Primary color border
- Padding: 12px 16px

### Selection Controls
- Single select: Radio-style cards with checkmark
- Multi select: Checkbox-style cards
- Emoji select: Large tappable emoji buttons

### Navigation
- Bottom tab bar: 6 tabs with icons
- Stack navigation within each tab
- Modal presentation for check-in and logging

---

## Accessibility Considerations

- Minimum touch target: 44x44pt
- Color contrast ratio: 4.5:1 minimum
- Dynamic type support
- VoiceOver labels for all interactive elements
- Reduced motion support for animations

---

## Critical UX Principles

1. **15-second check-in**: Must be completable in 15 seconds or less
2. **Coach-like tone**: Empathetic, encouraging, non-medical Korean copy
3. **Graceful degradation**: App works with partial data using conservative defaults
4. **No medical claims**: Never diagnose, treat, or prescribe
5. **LLM optional**: All features work without LLM using template fallback
6. **Safety first**: Medication handling is deterministic, LLM is explanation-only
