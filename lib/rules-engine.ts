// ============================================
// Antigravity Rules Engine
// Deterministic logic for plan generation
// ============================================

import {
  UserProfile,
  DailyCheckIn,
  WeatherSnapshot,
  MealLog,
  MedicationEntry,
  ExerciseCategory,
  ExerciseLevel,
  ExercisePlan,
  MealPlanItem,
  NextMealCorrection,
  SleepRecommendation,
  PlanOfDay,
  EnvironmentTopping,
  Disease,
  MedicationTag,
  UserGoal,
  MealTag,
} from '@/types';
import { ALL_ROUTINES, getRoutine } from '@/data/routines';
import type { RoutineTemplate } from '@/types';
import { generateId, getTodayDate } from '@/store';

// ============================================
// Category Selection Logic
// ============================================

export function selectExerciseCategory(
  checkIn: DailyCheckIn,
  weather?: WeatherSnapshot
): ExerciseCategory {
  const { environment, stress } = checkIn;
  
  // Priority 1: Air quality bad -> PH (Purifying Home)
  if (environment.airQuality === 'stuffy') {
    return 'PH';
  }
  
  // Priority 2: Indoor only -> PH
  if (environment.activityLocation === 'indoor') {
    return 'PH';
  }
  
  // Priority 3: Extreme temperature -> TF (Temperature Fit)
  if (environment.temperatureFeel === 'cold' || environment.temperatureFeel === 'hot') {
    // Check if outdoor is possible
    if (environment.activityLocation === 'outdoor' || environment.activityLocation === 'both') {
      // If weather is good, still consider outdoor
      if (environment.perceivedWeather === 'sunny' && environment.temperatureFeel !== 'hot') {
        return 'SO';
      }
    }
    return 'TF';
  }
  
  // Priority 4: High stress or bad weather -> MB (Mood Boosting)
  if (stress === 'high' || environment.perceivedWeather === 'cloudy' || environment.perceivedWeather === 'rainy') {
    return 'MB';
  }
  
  // Priority 5: Sunny + outdoor possible -> SO (Sunlight Outdoor)
  if (environment.perceivedWeather === 'sunny' && 
      (environment.activityLocation === 'outdoor' || environment.activityLocation === 'both')) {
    return 'SO';
  }
  
  // Default: MB (Mood Boosting) - good for general wellness
  return 'MB';
}

export function getCategoryReason(category: ExerciseCategory, checkIn: DailyCheckIn): string {
  const { environment, stress } = checkIn;
  
  switch (category) {
    case 'PH':
      if (environment.airQuality === 'stuffy') {
        return '오늘은 공기질이 좋지 않아서 실내 운동을 추천드려요.';
      }
      return '실내에서 편안하게 할 수 있는 운동을 준비했어요.';
    
    case 'SO':
      return '맑은 날씨네요! 햇살 아래서 운동하면 비타민D도 얻고 기분도 좋아져요.';
    
    case 'MB':
      if (stress === 'high') {
        return '스트레스가 높으시네요. 기분 전환에 좋은 운동을 추천드려요.';
      }
      if (environment.perceivedWeather === 'rainy') {
        return '비 오는 날이지만 기분 좋게 운동할 수 있어요!';
      }
      return '기분 전환에 좋은 운동을 준비했어요.';
    
    case 'TF':
      if (environment.temperatureFeel === 'hot') {
        return '오늘은 덥네요. 무리하지 않는 선에서 운동해요.';
      }
      return '오늘은 추우니까 실내에서 따뜻하게 운동해요.';
    
    default:
      return '오늘의 상태에 맞는 운동을 준비했어요.';
  }
}

// ============================================
// Level Inference
// ============================================

export function inferExerciseLevel(profile: UserProfile): ExerciseLevel {
  // Default to beginner for safety
  // In a real app, this would consider exercise history, fitness tests, etc.
  
  // If user has certain conditions, stay at beginner
  const safetyConditions: Disease[] = ['heart_failure', 'osteoporosis', 'hypertension'];
  if (profile.diseases.some(d => safetyConditions.includes(d))) {
    return 'beginner';
  }
  
  // For now, default to beginner
  // Could be upgraded based on user preference or history
  return 'beginner';
}

// ============================================
// Safety Gate
// ============================================

interface SafetyResult {
  isAllowed: boolean;
  warnings: string[];
  adjustments: string[];
  alternativeRoutine?: RoutineTemplate;
}

export function applySafetyGate(
  routine: RoutineTemplate,
  profile: UserProfile,
  medications: MedicationEntry[]
): SafetyResult {
  const warnings: string[] = [];
  const adjustments: string[] = [];
  let isAllowed = true;
  
  // Check disease contraindications
  for (const disease of profile.diseases) {
    if (routine.contraindicationTags.includes(disease)) {
      isAllowed = false;
      
      switch (disease) {
        case 'hypertension':
          warnings.push('고혈압이 있으시네요. 숨을 참는 동작과 최대 강도 운동은 피해주세요.');
          adjustments.push('호흡을 멈추지 않고 자연스럽게 유지하세요.');
          break;
        case 'osteoporosis':
          warnings.push('골다공증이 있으시네요. 점프나 비틀기 동작은 피해주세요.');
          adjustments.push('균형 운동과 밴드 운동 위주로 진행하세요.');
          break;
        case 'heart_failure':
          warnings.push('심장 건강을 위해 고강도 운동은 피해주세요.');
          adjustments.push('워밍업과 쿨다운을 충분히 하고, 중간에 휴식을 취하세요.');
          break;
        case 'diabetes':
          warnings.push('당뇨가 있으시네요. 공복 고강도 운동은 피해주세요.');
          adjustments.push('운동 전 가벼운 간식을 드시고, 저혈당 증상에 주의하세요.');
          break;
        case 'hyperthyroidism':
          warnings.push('갑상선 항진증이 있으시네요. 더운 환경과 고강도 운동은 피해주세요.');
          adjustments.push('시원한 환경에서 운동하고, 심박수를 모니터링하세요.');
          break;
        case 'hypothyroidism':
          warnings.push('갑상선 저하증이 있으시네요.');
          adjustments.push('워밍업을 충분히 하고, 점진적으로 강도를 높이세요.');
          break;
      }
    }
  }
  
  // Check medication warnings
  const allMedTags = new Set<MedicationTag>();
  medications.forEach(med => med.tags.forEach(tag => allMedTags.add(tag)));
  
  for (const tag of routine.medicationWarnings) {
    if (allMedTags.has(tag)) {
      switch (tag) {
        case 'DROWSINESS_POSSIBLE':
          warnings.push('복용 중인 약이 졸음을 유발할 수 있어요.');
          adjustments.push('늦은 시간 고강도 운동은 피하고, 낮 시간에 운동하세요.');
          break;
        case 'DEHYDRATION_RISK_POSSIBLE':
          warnings.push('탈수 위험이 있는 약을 복용 중이시네요.');
          adjustments.push('운동 전후로 충분히 수분을 섭취하세요.');
          break;
        case 'ORTHOSTATIC_DIZZINESS_POSSIBLE':
          warnings.push('급격한 자세 변화 시 어지러울 수 있어요.');
          adjustments.push('천천히 일어나고, 급격한 자세 변화를 피하세요.');
          break;
        case 'BLEEDING_RISK_CAUTION':
          warnings.push('출혈 위험이 있는 약을 복용 중이시네요.');
          adjustments.push('충돌이나 낙상 위험이 있는 운동은 피하세요.');
          break;
      }
    }
  }
  
  return {
    isAllowed,
    warnings,
    adjustments,
  };
}

// ============================================
// Routine Selection
// ============================================

export function selectRoutine(
  category: ExerciseCategory,
  profile: UserProfile,
  medications: MedicationEntry[]
): { routine: RoutineTemplate; safetyResult: SafetyResult } {
  const level = inferExerciseLevel(profile);
  
  // Map user goal to exercise goal
  let exerciseGoal = profile.goal;
  if (profile.goal === 'weight_management' || profile.goal === 'weight_gain') {
    exerciseGoal = 'muscle_gain';
  }
  
  // Try to get the ideal routine
  let routine = getRoutine(category, exerciseGoal, level);
  
  // If not found, try with stress_relief (most universally safe)
  if (!routine) {
    routine = getRoutine(category, 'stress_relief', level);
  }
  
  // If still not found, get any routine in the category
  if (!routine) {
    routine = ALL_ROUTINES.find(r => r.category === category && r.level === level);
  }
  
  // Last resort: any beginner routine
  if (!routine) {
    routine = ALL_ROUTINES.find(r => r.level === 'beginner');
  }
  
  // This should never happen, but TypeScript needs it
  if (!routine) {
    routine = ALL_ROUTINES[0];
  }
  
  // Apply safety gate
  let safetyResult = applySafetyGate(routine, profile, medications);
  
  // If not allowed, try to find a safer alternative
  if (!safetyResult.isAllowed) {
    // Try beginner level of same category
    const saferRoutine = getRoutine(category, 'stress_relief', 'beginner');
    if (saferRoutine) {
      const saferResult = applySafetyGate(saferRoutine, profile, medications);
      if (saferResult.isAllowed || saferResult.warnings.length < safetyResult.warnings.length) {
        routine = saferRoutine;
        safetyResult = saferResult;
        safetyResult.adjustments.push('안전을 위해 더 부드러운 루틴으로 변경했어요.');
      }
    }
  }
  
  return { routine, safetyResult };
}

// ============================================
// Meal Plan Generation
// ============================================

export function generateMealPlan(
  profile: UserProfile,
  checkIn: DailyCheckIn,
  weather?: WeatherSnapshot
): MealPlanItem[] {
  const { goal, diseases } = profile;
  const { environment, stress, digestion } = checkIn;
  
  // Determine environment toppings
  const toppings: EnvironmentTopping[] = [];
  
  if (environment.airQuality === 'stuffy') {
    toppings.push('anti_dust');
  }
  if (environment.temperatureFeel === 'cold' || environment.perceivedWeather === 'rainy') {
    toppings.push('immune');
  }
  if (environment.temperatureFeel === 'hot') {
    toppings.push('hydration');
  }
  if (stress === 'high') {
    toppings.push('mood_up');
  }
  
  // Base meal suggestions by goal
  const mealPlans: MealPlanItem[] = [];
  
  // Breakfast
  let breakfast: MealPlanItem = {
    mealType: 'breakfast',
    suggestion: '',
    reason: '',
    toppings: [...toppings],
  };
  
  switch (goal) {
    case 'diet':
      breakfast.suggestion = '통곡물 시리얼 + 저지방 우유 + 과일';
      breakfast.reason = '포만감이 오래가는 복합 탄수화물로 하루를 시작해요.';
      break;
    case 'muscle_gain':
      breakfast.suggestion = '계란 2개 + 통밀빵 + 그릭요거트';
      breakfast.reason = '근육 합성에 필요한 단백질을 아침부터 챙겨요.';
      break;
    case 'weight_gain':
      breakfast.suggestion = '오트밀 + 견과류 + 바나나 + 꿀';
      breakfast.reason = '건강한 칼로리를 충분히 섭취해요.';
      break;
    case 'stress_relief':
      breakfast.suggestion = '아보카도 토스트 + 달걀 + 오렌지주스';
      breakfast.reason = '기분 좋은 하루를 위한 영양 가득 아침이에요.';
      break;
    default:
      breakfast.suggestion = '현미밥 + 된장국 + 계란프라이';
      breakfast.reason = '균형 잡힌 한식 아침으로 에너지를 충전해요.';
  }
  
  // Apply disease modifications
  if (diseases.includes('diabetes')) {
    breakfast.suggestion = breakfast.suggestion.replace('꿀', '').replace('오렌지주스', '물');
    breakfast.reason += ' 혈당 관리를 위해 당류를 줄였어요.';
  }
  
  mealPlans.push(breakfast);
  
  // Lunch
  let lunch: MealPlanItem = {
    mealType: 'lunch',
    suggestion: '',
    reason: '',
    toppings: [...toppings],
  };
  
  switch (goal) {
    case 'diet':
      lunch.suggestion = '닭가슴살 샐러드 + 통밀빵 한 조각';
      lunch.reason = '단백질과 채소로 든든하면서도 가볍게!';
      break;
    case 'muscle_gain':
      lunch.suggestion = '소고기 덮밥 + 미역국 + 채소 반찬';
      lunch.reason = '운동 후 회복을 위한 단백질과 철분을 보충해요.';
      break;
    case 'weight_gain':
      lunch.suggestion = '제육볶음 + 밥 + 계란찜 + 된장찌개';
      lunch.reason = '충분한 칼로리와 단백질을 섭취해요.';
      break;
    case 'stress_relief':
      lunch.suggestion = '연어 포케 + 현미밥 + 아보카도';
      lunch.reason = '오메가-3가 풍부해서 스트레스 해소에 좋아요.';
      break;
    default:
      lunch.suggestion = '비빔밥 + 된장국';
      lunch.reason = '다양한 채소와 단백질을 한 그릇에!';
  }
  
  // Apply digestion modifications
  if (digestion === 'bloated' || digestion === 'constipation') {
    lunch.reason += ' 소화가 잘 되도록 천천히 드세요.';
  }
  
  mealPlans.push(lunch);
  
  // Dinner
  let dinner: MealPlanItem = {
    mealType: 'dinner',
    suggestion: '',
    reason: '',
    toppings: [...toppings],
  };
  
  switch (goal) {
    case 'diet':
      dinner.suggestion = '두부 스테이크 + 구운 채소 + 현미밥 반 공기';
      dinner.reason = '저녁은 가볍게, 하지만 단백질은 충분히!';
      break;
    case 'muscle_gain':
      dinner.suggestion = '삼치구이 + 밥 + 시금치나물 + 두부조림';
      dinner.reason = '수면 중 근육 회복을 위한 단백질을 챙겨요.';
      break;
    case 'weight_gain':
      dinner.suggestion = '삼겹살 + 밥 + 된장찌개 + 채소쌈';
      dinner.reason = '맛있게 먹으면서 칼로리도 채워요.';
      break;
    case 'stress_relief':
      dinner.suggestion = '고등어구이 + 현미밥 + 시금치무침 + 미역국';
      dinner.reason = '마그네슘과 오메가-3로 편안한 저녁을 보내요.';
      break;
    default:
      dinner.suggestion = '생선구이 + 밥 + 나물 반찬 + 국';
      dinner.reason = '균형 잡힌 저녁 식사로 하루를 마무리해요.';
  }
  
  // Apply hypertension modifications
  if (diseases.includes('hypertension')) {
    dinner.reason += ' 나트륨 섭취를 줄이기 위해 국물은 적게 드세요.';
  }
  
  mealPlans.push(dinner);
  
  // Add topping-specific suggestions
  if (toppings.includes('anti_dust')) {
    mealPlans.forEach(meal => {
      meal.reason += ' 미세먼지 대응을 위해 물을 충분히 마시고, 해조류를 챙겨드세요.';
    });
  }
  
  if (toppings.includes('hydration')) {
    mealPlans.forEach(meal => {
      meal.reason += ' 더운 날씨에는 수분 섭취가 중요해요!';
    });
  }
  
  return mealPlans;
}

// ============================================
// Next Meal Correction
// ============================================

export function generateNextMealCorrection(
  todayMeals: MealLog[],
  profile: UserProfile,
  checkIn: DailyCheckIn
): NextMealCorrection | undefined {
  if (todayMeals.length === 0) {
    return undefined;
  }
  
  // Analyze the last meal
  const lastMeal = todayMeals[todayMeals.length - 1];
  const tags = lastMeal.tags;
  
  const corrections: string[] = [];
  const focusTags: MealTag[] = [];
  
  // High protein + high sodium -> low sodium + veggies + hydration
  if (tags.includes('high_protein') && tags.includes('high_sodium')) {
    corrections.push('이전 식사에서 나트륨이 많았어요. 다음 식사는 저염식으로!');
    corrections.push('채소를 충분히 드시고 물을 많이 마셔주세요.');
    focusTags.push('high_sodium');
  }
  
  // High carb -> add protein + fiber
  if (tags.includes('high_carb') && !tags.includes('high_protein')) {
    corrections.push('탄수화물 위주였네요. 다음 식사에는 단백질을 추가해주세요.');
    corrections.push('식이섬유가 풍부한 채소도 함께 드세요.');
    focusTags.push('high_carb');
  }
  
  // High fat -> lighter next meal
  if (tags.includes('high_fat')) {
    corrections.push('기름진 식사를 하셨네요. 다음은 담백하게!');
    focusTags.push('high_fat');
  }
  
  // Low veggie -> emphasize vegetables
  if (tags.includes('low_veggie')) {
    corrections.push('채소가 부족했어요. 다음 식사에는 채소를 꼭 챙겨주세요.');
    focusTags.push('low_veggie');
  }
  
  // Alcohol -> hydration and light food
  if (tags.includes('alcohol')) {
    corrections.push('음주를 하셨네요. 수분을 충분히 섭취하고 해장은 가볍게!');
    focusTags.push('alcohol');
  }
  
  // Dessert -> reduce sugar next meal
  if (tags.includes('dessert')) {
    corrections.push('디저트를 드셨네요. 다음 식사는 당류를 줄여주세요.');
    focusTags.push('dessert');
  }
  
  // Stress-based correction
  if (checkIn.stress === 'high') {
    corrections.push('스트레스가 높을 때는 안정적인 탄수화물과 오메가-3가 도움이 돼요.');
  }
  
  if (corrections.length === 0) {
    return undefined;
  }
  
  return {
    suggestion: corrections[0],
    reason: corrections.slice(1).join(' '),
    tags: focusTags,
  };
}

// ============================================
// Sleep Recommendation
// ============================================

export function generateSleepRecommendation(
  profile: UserProfile,
  checkIn: DailyCheckIn,
  exercisePlan: ExercisePlan
): SleepRecommendation {
  // Base: 7.5 hours
  let duration = 7.5;
  const reasons: string[] = [];
  
  // Adjust +0.5h if stress high
  if (checkIn.stress === 'high') {
    duration += 0.5;
    reasons.push('스트레스가 높아서 충분한 휴식이 필요해요.');
  }
  
  // Adjust +0.5h if sleep quality poor
  if (checkIn.sleepQuality === 'poor') {
    duration += 0.5;
    reasons.push('어젯밤 수면의 질이 좋지 않았네요. 오늘은 일찍 주무세요.');
  }
  
  // Adjust +0.5h if muscle gain goal or high intensity exercise
  if (profile.goal === 'muscle_gain' || exercisePlan.routine.intensity === 'high') {
    duration += 0.5;
    reasons.push('운동 후 근육 회복을 위해 충분히 주무세요.');
  }
  
  // Cap at 9 hours
  duration = Math.min(duration, 9);
  
  // Generate bedtime window
  let bedtimeWindow: { start: string; end: string } | undefined;
  
  if (profile.sleepProfile.usualWakeup) {
    // Calculate bedtime based on wake time and duration
    const [wakeHour, wakeMin] = profile.sleepProfile.usualWakeup.split(':').map(Number);
    const wakeMinutes = wakeHour * 60 + wakeMin;
    const sleepMinutes = wakeMinutes - duration * 60;
    
    const bedHour = Math.floor(((sleepMinutes % 1440) + 1440) % 1440 / 60);
    const bedMin = ((sleepMinutes % 1440) + 1440) % 60;
    
    const startHour = bedHour;
    const endHour = (bedHour + 1) % 24;
    
    bedtimeWindow = {
      start: `${startHour.toString().padStart(2, '0')}:${bedMin.toString().padStart(2, '0')}`,
      end: `${endHour.toString().padStart(2, '0')}:${bedMin.toString().padStart(2, '0')}`,
    };
    
    reasons.push(`${profile.sleepProfile.usualWakeup}에 일어나시려면 ${bedtimeWindow.start}~${bedtimeWindow.end} 사이에 주무세요.`);
  }
  
  // Default reason if none
  if (reasons.length === 0) {
    reasons.push('충분한 수면은 건강의 기본이에요.');
  }
  
  return {
    duration,
    bedtimeWindow,
    reason: reasons.join(' '),
  };
}

// ============================================
// Full Plan Generation
// ============================================

export function generatePlanOfDay(
  profile: UserProfile,
  checkIn: DailyCheckIn,
  medications: MedicationEntry[],
  todayMeals: MealLog[],
  weather?: WeatherSnapshot
): PlanOfDay {
  // 1. Select exercise category
  const category = selectExerciseCategory(checkIn, weather);
  const categoryReason = getCategoryReason(category, checkIn);
  
  // 2. Select routine with safety gate
  const { routine, safetyResult } = selectRoutine(category, profile, medications);
  
  // 3. Build exercise plan
  const exercisePlan: ExercisePlan = {
    category,
    categoryReason,
    routine,
    safetyNotes: safetyResult.warnings,
    adjustments: safetyResult.adjustments,
  };
  
  // 4. Generate meal plan
  const mealPlan = generateMealPlan(profile, checkIn, weather);
  
  // 5. Generate next meal correction
  const nextMealCorrection = generateNextMealCorrection(todayMeals, profile, checkIn);
  
  // 6. Generate sleep recommendation
  const sleepRecommendation = generateSleepRecommendation(profile, checkIn, exercisePlan);
  
  return {
    id: generateId(),
    date: getTodayDate(),
    exercisePlan,
    mealPlan,
    nextMealCorrection,
    sleepRecommendation,
    generatedAt: new Date().toISOString(),
  };
}
