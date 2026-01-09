// Exercise and Meal Image Mappings

// Exercise images - map exercise names to their illustrations
export const EXERCISE_IMAGES: Record<string, any> = {
  // Basic exercises
  '스쿼트': require('@/assets/images/exercises/squat.png'),
  '푸시업': require('@/assets/images/exercises/pushup.png'),
  '플랭크': require('@/assets/images/exercises/plank.png'),
  '런지': require('@/assets/images/exercises/lunge.png'),
  '버피': require('@/assets/images/exercises/burpee.png'),
  
  // Cardio
  '점핑잭': require('@/assets/images/exercises/jumping_jack.png'),
  '마운틴 클라이머': require('@/assets/images/exercises/mountain_climber.png'),
  '제자리 걷기': require('@/assets/images/exercises/walking.png'),
  '가벼운 조깅': require('@/assets/images/exercises/jogging.png'),
  '조깅': require('@/assets/images/exercises/jogging.png'),
  '걷기': require('@/assets/images/exercises/walking.png'),
  '산책': require('@/assets/images/exercises/walking.png'),
  
  // Yoga and stretching
  '고양이-소 스트레칭': require('@/assets/images/exercises/yoga_cat_cow.png'),
  '아이 자세': require('@/assets/images/exercises/yoga_child.png'),
  '전신 스트레칭': require('@/assets/images/exercises/stretching.png'),
  '스트레칭': require('@/assets/images/exercises/stretching.png'),
  '어깨 스트레칭': require('@/assets/images/exercises/stretching.png'),
  '목 스트레칭': require('@/assets/images/exercises/stretching.png'),
  '하체 스트레칭': require('@/assets/images/exercises/stretching.png'),
  
  // Dance and movement
  '댄스': require('@/assets/images/exercises/dance.png'),
  '가벼운 댄스': require('@/assets/images/exercises/dance.png'),
  '에어로빅': require('@/assets/images/exercises/dance.png'),
  
  // Meditation and breathing
  '명상': require('@/assets/images/exercises/meditation.png'),
  '호흡 운동': require('@/assets/images/exercises/breathing.png'),
  '심호흡': require('@/assets/images/exercises/breathing.png'),
  '복식 호흡': require('@/assets/images/exercises/breathing.png'),
};

// Default exercise image for unmapped exercises
export const DEFAULT_EXERCISE_IMAGE = require('@/assets/images/exercises/stretching.png');

// Meal images - map meal types to their illustrations
export const MEAL_IMAGES = {
  // Breakfast
  breakfast_healthy: require('@/assets/images/meals/breakfast_healthy.png'),
  breakfast_diet: require('@/assets/images/meals/breakfast_diet.png'),
  
  // Lunch
  lunch_protein: require('@/assets/images/meals/lunch_protein.png'),
  lunch_balanced: require('@/assets/images/meals/lunch_balanced.png'),
  
  // Dinner
  dinner_light: require('@/assets/images/meals/dinner_light.png'),
  
  // Snacks
  snack_fruit: require('@/assets/images/meals/snack_fruit.png'),
  snack_nuts: require('@/assets/images/meals/snack_nuts.png'),
  
  // Others
  smoothie: require('@/assets/images/meals/smoothie.png'),
  soup: require('@/assets/images/meals/soup.png'),
  salad: require('@/assets/images/meals/salad.png'),
};

// Map meal time and goal to appropriate image
export function getMealImage(mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack', goal?: string): any {
  if (mealTime === 'breakfast') {
    return goal === 'diet' ? MEAL_IMAGES.breakfast_diet : MEAL_IMAGES.breakfast_healthy;
  }
  if (mealTime === 'lunch') {
    return goal === 'muscle' ? MEAL_IMAGES.lunch_protein : MEAL_IMAGES.lunch_balanced;
  }
  if (mealTime === 'dinner') {
    return MEAL_IMAGES.dinner_light;
  }
  if (mealTime === 'snack') {
    return Math.random() > 0.5 ? MEAL_IMAGES.snack_fruit : MEAL_IMAGES.snack_nuts;
  }
  return MEAL_IMAGES.lunch_balanced;
}

// Get exercise image by name, with fallback
export function getExerciseImage(exerciseName: string): any {
  // Try exact match first
  if (EXERCISE_IMAGES[exerciseName]) {
    return EXERCISE_IMAGES[exerciseName];
  }
  
  // Try partial match
  for (const [key, image] of Object.entries(EXERCISE_IMAGES)) {
    if (exerciseName.includes(key) || key.includes(exerciseName)) {
      return image;
    }
  }
  
  // Return default
  return DEFAULT_EXERCISE_IMAGE;
}
