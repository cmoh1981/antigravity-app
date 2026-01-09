// ============================================
// Antigravity App - Core Type Definitions
// ============================================

// ============================================
// Enums and Constants
// ============================================

export type UserGoal = 
  | 'weight_management'  // 체중 관리
  | 'diet'               // 다이어트
  | 'muscle_gain'        // 근육 증가
  | 'weight_gain'        // 체중 증가
  | 'stress_relief';     // 스트레스 해소

export type Disease = 
  | 'diabetes'           // 당뇨
  | 'obesity'            // 비만
  | 'hypertension'       // 고혈압
  | 'hyperlipidemia'     // 고지혈증
  | 'heart_failure'      // 심부전
  | 'osteoporosis'       // 골다공증
  | 'hyperthyroidism'    // 갑상선 항진
  | 'hypothyroidism';    // 갑상선 저하

export type MoodEmoji = '😄' | '🙂' | '😐' | '😣' | '😤';

export type StressLevel = 'low' | 'medium' | 'high';

export type DigestionStatus = 'normal' | 'bloated' | 'diarrhea' | 'constipation';

export type SleepQuality = 'good' | 'fair' | 'poor';

export type PerceivedWeather = 'sunny' | 'cloudy' | 'rainy';

export type TemperatureFeel = 'cold' | 'cool' | 'warm' | 'hot';

export type AirQualityPerception = 'fresh' | 'normal' | 'stuffy';

export type ActivityLocation = 'indoor' | 'outdoor' | 'both';

export type ExerciseCategory = 
  | 'PH'  // Purifying Home: indoor/air bad
  | 'SO'  // Sunlight Outdoor: sunny + outdoor possible
  | 'MB'  // Mood Boosting: cloudy/rain OR stress high
  | 'TF'; // Temperature Fit: very hot/very cold

export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced';

export type MealTag = 
  | 'high_protein'    // 고단백
  | 'high_carb'       // 고탄수
  | 'high_fat'        // 고지방
  | 'high_sodium'     // 고나트륨
  | 'low_veggie'      // 채소부족
  | 'alcohol'         // 음주
  | 'dessert';        // 디저트

// Food tag for meal photo logging
export type FoodTag = 
  | 'protein'         // 단백질
  | 'carbs'           // 탄수화물
  | 'vegetables'      // 채소
  | 'fruits'          // 과일
  | 'dairy'           // 유제품
  | 'grains'          // 곡물
  | 'seafood'         // 해산물
  | 'soup'            // 국/찌개
  | 'fried'           // 튀김류
  | 'spicy'           // 매운 음식
  | 'sweet'           // 단 음식
  | 'caffeine'        // 카페인
  | 'alcohol'         // 주류
  | 'processed';      // 가공식품

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type PortionSize = 'small' | 'medium' | 'large';

export type MedicationTag = 
  | 'DROWSINESS_POSSIBLE'
  | 'DEHYDRATION_RISK_POSSIBLE'
  | 'ORTHOSTATIC_DIZZINESS_POSSIBLE'
  | 'BLEEDING_RISK_CAUTION';

export type EnvironmentTopping = 
  | 'anti_dust'       // 미세먼지 대응
  | 'immune'          // 면역력 강화
  | 'hydration'       // 수분 보충
  | 'mood_up';        // 기분 전환

// ============================================
// User Profile
// ============================================

export interface InBodyMetrics {
  height: number;           // cm (required)
  weight: number;           // kg (required)
  muscleMass?: number;      // kg (optional)
  fatMass?: number;         // kg (optional)
  bodyFatPercent?: number;  // % (optional)
  waist?: number;           // cm (optional)
}

export interface SleepProfile {
  usualBedtime?: string;    // HH:mm format
  usualWakeup?: string;     // HH:mm format
  isShiftWorker: boolean;
}

export interface UserProfile {
  id: string;
  goal: UserGoal;
  inBody: InBodyMetrics;
  diseases: Disease[];
  sleepProfile: SleepProfile;
  onboardingCompleted: boolean;
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
}

// ============================================
// Daily Check-in
// ============================================

export interface EnvironmentReport {
  perceivedWeather: PerceivedWeather;
  temperatureFeel: TemperatureFeel;
  airQuality: AirQualityPerception;
  activityLocation: ActivityLocation;
  regionCode?: string;      // 시/군/구 code if GPS disabled
}

export interface DailyCheckIn {
  id: string;
  date: string;             // YYYY-MM-DD
  mood: MoodEmoji;
  stress: StressLevel;
  digestion?: DigestionStatus;
  sleepQuality?: SleepQuality;
  environment: EnvironmentReport;
  createdAt: string;        // ISO datetime
}

// ============================================
// Weather
// ============================================

export interface WeatherSnapshot {
  regionCode: string;
  temperature: number;      // Celsius
  humidity: number;         // %
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  airQualityIndex?: number; // PM2.5 or similar
  fetchedAt: string;        // ISO datetime
  expiresAt: string;        // ISO datetime (TTL)
}

export interface PerceivedWeatherResult {
  sunnyProb: number;        // 0-1
  cloudyProb: number;       // 0-1
  rainyProb: number;        // 0-1
}

// ============================================
// Meal Logging
// ============================================

export interface MealLog {
  id: string;
  date: string;             // YYYY-MM-DD
  mealType: MealType;
  photoUri?: string;        // Local file URI
  tags: (MealTag | FoodTag)[];
  portionSize?: PortionSize;
  estimatedCalories?: number;
  notes?: string;
  confirmedByUser?: boolean;
  createdAt: string;        // ISO datetime
}

// ============================================
// Medication
// ============================================

export interface MedicationEntry {
  id: string;
  name: string;             // Drug name in Korean
  nameEn?: string;          // Drug name in English
  tags: MedicationTag[];
  dosage?: string;          // e.g., "500mg"
  frequency?: string;       // e.g., "하루 2회"
  confirmedByUser: boolean;
  addedVia: 'search' | 'ocr';
  createdAt: string;        // ISO datetime
}

// ============================================
// Exercise Routines
// ============================================

export interface ExerciseSet {
  name: string;             // Exercise name in Korean
  nameEn?: string;          // Exercise name in English
  reps?: number;            // Number of repetitions
  duration?: number;        // Seconds
  sets?: number;            // Number of sets
  gifId?: string;           // Reference to GIF asset
  description?: string;     // Instructions in Korean
}

export interface RoutineTemplate {
  id: string;
  category: ExerciseCategory;
  goal: UserGoal;
  level: ExerciseLevel;
  name: string;             // Routine name in Korean
  nameEn?: string;          // Routine name in English
  description: string;      // Description in Korean
  totalDuration: number;    // Minutes
  warmup: ExerciseSet[];
  main: ExerciseSet[];
  cooldown: ExerciseSet[];
  contraindicationTags: Disease[];
  medicationWarnings: MedicationTag[];
  intensity: 'low' | 'moderate' | 'high';
}

// ============================================
// Plan of Day
// ============================================

export interface MealPlanItem {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  suggestion: string;       // Korean meal suggestion
  reason: string;           // Why this is recommended
  toppings: EnvironmentTopping[];
}

export interface NextMealCorrection {
  suggestion: string;       // Korean suggestion
  reason: string;           // Based on previous meal analysis
  tags: MealTag[];          // Tags to focus on
}

export interface SleepRecommendation {
  duration: number;         // Hours (e.g., 7.5, 8.0)
  bedtimeWindow?: {
    start: string;          // HH:mm
    end: string;            // HH:mm
  };
  reason: string;           // Korean explanation
}

export interface ExercisePlan {
  category: ExerciseCategory;
  categoryReason: string;   // Why this category
  routine: RoutineTemplate;
  safetyNotes: string[];    // Any warnings based on diseases/meds
  adjustments: string[];    // Modifications made
}

export interface PlanOfDay {
  id: string;
  date: string;             // YYYY-MM-DD
  exercisePlan: ExercisePlan;
  mealPlan: MealPlanItem[];
  nextMealCorrection?: NextMealCorrection;
  sleepRecommendation: SleepRecommendation;
  generatedAt: string;      // ISO datetime
  invalidatedAt?: string;   // Set when check-in or meal log changes
}

// ============================================
// LLM Adapter Types
// ============================================

export interface CoachFacts {
  userName?: string;
  goal: UserGoal;
  todayMood: MoodEmoji;
  todayStress: StressLevel;
  exerciseCategory: ExerciseCategory;
  exerciseRoutineName: string;
  mealSuggestion: string;
  sleepDuration: number;
}

export interface CoachCopy {
  greeting: string;
  exerciseMotivation: string;
  mealTip: string;
  sleepAdvice: string;
  closing: string;
}

export interface DrugFacts {
  name: string;
  tags: MedicationTag[];
  dosage?: string;
  frequency?: string;
}

export interface DrugExplainCopy {
  summary: string;
  exerciseNote?: string;
  mealNote?: string;
  generalNote?: string;
}

// ============================================
// Chatbot Intent Types
// ============================================

export type ChatIntent = 
  | 'exercise_question'
  | 'meal_question'
  | 'sleep_question'
  | 'motivation'
  | 'general_health'
  | 'medication_change'     // BLOCKED
  | 'medication_dosage'     // BLOCKED
  | 'medication_interaction'// BLOCKED
  | 'diagnosis'             // BLOCKED
  | 'treatment';            // BLOCKED

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: ChatIntent;
  blocked?: boolean;
  createdAt: string;
}

// ============================================
// App State
// ============================================

export interface AppState {
  isOnboarded: boolean;
  userProfile: UserProfile | null;
  todayCheckIn: DailyCheckIn | null;
  todayPlan: PlanOfDay | null;
  weatherCache: Map<string, WeatherSnapshot>;
  mealLogs: MealLog[];
  medications: MedicationEntry[];
  chatHistory: ChatMessage[];
  settings: AppSettings;
}

export interface AppSettings {
  enableLLMCoach: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: 'ko';           // Korean only for MVP
}

// ============================================
// Korean Label Mappings
// ============================================

export const GOAL_LABELS: Record<UserGoal, string> = {
  weight_management: '체중 관리',
  diet: '다이어트',
  muscle_gain: '근육 증가',
  weight_gain: '체중 증가',
  stress_relief: '스트레스 해소',
};

export const DISEASE_LABELS: Record<Disease, string> = {
  diabetes: '당뇨',
  obesity: '비만',
  hypertension: '고혈압',
  hyperlipidemia: '고지혈증',
  heart_failure: '심부전',
  osteoporosis: '골다공증',
  hyperthyroidism: '갑상선 항진',
  hypothyroidism: '갑상선 저하',
};

export const STRESS_LABELS: Record<StressLevel, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
};

export const DIGESTION_LABELS: Record<DigestionStatus, string> = {
  normal: '정상',
  bloated: '더부룩',
  diarrhea: '설사',
  constipation: '변비',
};

export const SLEEP_QUALITY_LABELS: Record<SleepQuality, string> = {
  good: '좋음',
  fair: '보통',
  poor: '나쁨',
};

export const WEATHER_LABELS: Record<PerceivedWeather, string> = {
  sunny: '맑음',
  cloudy: '흐림',
  rainy: '비',
};

export const TEMPERATURE_LABELS: Record<TemperatureFeel, string> = {
  cold: '추움',
  cool: '시원함',
  warm: '따뜻함',
  hot: '더움',
};

export const AIR_QUALITY_LABELS: Record<AirQualityPerception, string> = {
  fresh: '상쾌함',
  normal: '보통',
  stuffy: '답답함',
};

export const LOCATION_LABELS: Record<ActivityLocation, string> = {
  indoor: '실내만',
  outdoor: '실외만',
  both: '실내/실외 모두',
};

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  PH: '홈 퓨리파잉',
  SO: '햇살 아웃도어',
  MB: '무드 부스팅',
  TF: '온도 맞춤',
};

export const CATEGORY_DESCRIPTIONS: Record<ExerciseCategory, string> = {
  PH: '실내에서 공기질이 좋지 않을 때 적합한 운동',
  SO: '맑은 날 야외에서 즐기는 운동',
  MB: '흐리거나 비 오는 날, 스트레스가 높을 때 기분 전환 운동',
  TF: '매우 덥거나 추운 날씨에 맞춘 운동',
};

export const MEAL_TAG_LABELS: Record<MealTag, string> = {
  high_protein: '고단백',
  high_carb: '고탄수',
  high_fat: '고지방',
  high_sodium: '고나트륨',
  low_veggie: '채소부족',
  alcohol: '음주',
  dessert: '디저트',
};

export const FOOD_TAG_LABELS: Record<FoodTag, string> = {
  protein: '단백질',
  carbs: '탄수화물',
  vegetables: '채소',
  fruits: '과일',
  dairy: '유제품',
  grains: '곡물',
  seafood: '해산물',
  soup: '국/찌개',
  fried: '튀김류',
  spicy: '매운 음식',
  sweet: '단 음식',
  caffeine: '카페인',
  alcohol: '주류',
  processed: '가공식품',
};

export const ALL_TAG_LABELS: Record<MealTag | FoodTag, string> = {
  ...MEAL_TAG_LABELS,
  ...FOOD_TAG_LABELS,
};

export const LEVEL_LABELS: Record<ExerciseLevel, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};
