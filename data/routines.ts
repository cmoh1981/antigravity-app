// ============================================
// Exercise Routine Templates (36 total)
// 4 categories × 3 goals × 3 levels
// ============================================

import { RoutineTemplate, ExerciseCategory, UserGoal, ExerciseLevel } from '@/types';

// Helper to create routine ID
const createId = (cat: string, goal: string, level: string) => 
  `routine-${cat}-${goal}-${level}`;

// ============================================
// PH (Purifying Home) - Indoor/Air Bad
// ============================================

const PH_ROUTINES: RoutineTemplate[] = [
  // Diet Goal
  {
    id: createId('PH', 'diet', 'beginner'),
    category: 'PH',
    goal: 'diet',
    level: 'beginner',
    name: '실내 가벼운 유산소',
    nameEn: 'Light Indoor Cardio',
    description: '공기질이 좋지 않은 날 실내에서 할 수 있는 가벼운 유산소 운동입니다.',
    totalDuration: 20,
    intensity: 'low',
    warmup: [
      { name: '제자리 걷기', duration: 60, description: '편안하게 제자리에서 걸어주세요' },
      { name: '팔 돌리기', reps: 10, sets: 2, description: '양팔을 크게 돌려주세요' },
    ],
    main: [
      { name: '제자리 걷기 (빠르게)', duration: 180, description: '조금 빠르게 걸어주세요' },
      { name: '사이드 스텝', duration: 120, description: '좌우로 스텝을 밟아주세요' },
      { name: '니업', reps: 15, sets: 2, description: '무릎을 번갈아 올려주세요' },
    ],
    cooldown: [
      { name: '심호흡', duration: 60, description: '깊게 숨을 쉬며 심박수를 낮춰주세요' },
      { name: '전신 스트레칭', duration: 120, description: '온몸을 천천히 늘려주세요' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('PH', 'diet', 'intermediate'),
    category: 'PH',
    goal: 'diet',
    level: 'intermediate',
    name: '실내 인터벌 트레이닝',
    nameEn: 'Indoor Interval Training',
    description: '실내에서 효과적으로 칼로리를 소모하는 인터벌 운동입니다.',
    totalDuration: 30,
    intensity: 'moderate',
    warmup: [
      { name: '점핑잭', duration: 60, description: '가볍게 점핑잭으로 몸을 풀어주세요' },
      { name: '동적 스트레칭', duration: 120, description: '관절을 움직이며 스트레칭' },
    ],
    main: [
      { name: '버피', reps: 10, sets: 3, description: '전신 운동으로 심박수를 올려주세요' },
      { name: '마운틴 클라이머', duration: 45, sets: 3, description: '빠르게 무릎을 당겨주세요' },
      { name: '스쿼트 점프', reps: 12, sets: 3, description: '점프하며 스쿼트' },
    ],
    cooldown: [
      { name: '걷기', duration: 120, description: '천천히 걸으며 심박수를 낮춰주세요' },
      { name: '하체 스트레칭', duration: 180, description: '다리 근육을 충분히 늘려주세요' },
    ],
    contraindicationTags: ['heart_failure', 'osteoporosis'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  {
    id: createId('PH', 'diet', 'advanced'),
    category: 'PH',
    goal: 'diet',
    level: 'advanced',
    name: '고강도 실내 서킷',
    nameEn: 'High Intensity Indoor Circuit',
    description: '짧은 시간에 최대 효과를 내는 고강도 서킷 트레이닝입니다.',
    totalDuration: 40,
    intensity: 'high',
    warmup: [
      { name: '점핑잭', duration: 90, description: '빠르게 점핑잭' },
      { name: '동적 스트레칭', duration: 150, description: '전신 동적 스트레칭' },
    ],
    main: [
      { name: '버피', reps: 15, sets: 4, description: '최대 속도로 버피' },
      { name: '터키쉬 겟업', reps: 5, sets: 3, description: '코어와 전신 안정성' },
      { name: '박스 점프 (의자)', reps: 12, sets: 4, description: '안정적인 의자에 점프' },
      { name: '플랭크 투 푸시업', reps: 10, sets: 3, description: '플랭크에서 푸시업으로' },
    ],
    cooldown: [
      { name: '걷기', duration: 180, description: '천천히 걸으며 회복' },
      { name: '전신 스트레칭', duration: 300, description: '충분한 스트레칭' },
    ],
    contraindicationTags: ['heart_failure', 'osteoporosis', 'hypertension'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE', 'BLEEDING_RISK_CAUTION'],
  },
  // Muscle Gain Goal
  {
    id: createId('PH', 'muscle_gain', 'beginner'),
    category: 'PH',
    goal: 'muscle_gain',
    level: 'beginner',
    name: '실내 기초 근력',
    nameEn: 'Basic Indoor Strength',
    description: '맨몸으로 할 수 있는 기초 근력 운동입니다.',
    totalDuration: 25,
    intensity: 'low',
    warmup: [
      { name: '팔 돌리기', reps: 15, sets: 2, description: '어깨 관절을 풀어주세요' },
      { name: '스쿼트 (얕게)', reps: 10, description: '가볍게 스쿼트' },
    ],
    main: [
      { name: '푸시업 (무릎)', reps: 10, sets: 3, description: '무릎을 대고 푸시업' },
      { name: '스쿼트', reps: 12, sets: 3, description: '정확한 자세로 스쿼트' },
      { name: '플랭크', duration: 30, sets: 3, description: '코어에 힘을 주세요' },
    ],
    cooldown: [
      { name: '고양이-소 스트레칭', reps: 10, description: '척추를 부드럽게' },
      { name: '전신 스트레칭', duration: 120, description: '근육을 이완시켜주세요' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('PH', 'muscle_gain', 'intermediate'),
    category: 'PH',
    goal: 'muscle_gain',
    level: 'intermediate',
    name: '실내 중급 근력',
    nameEn: 'Intermediate Indoor Strength',
    description: '맨몸으로 근육을 키우는 중급 프로그램입니다.',
    totalDuration: 35,
    intensity: 'moderate',
    warmup: [
      { name: '점핑잭', duration: 60, description: '전신 워밍업' },
      { name: '동적 스트레칭', duration: 120, description: '관절 가동성 확보' },
    ],
    main: [
      { name: '푸시업', reps: 15, sets: 4, description: '가슴과 삼두근' },
      { name: '불가리안 스플릿 스쿼트', reps: 10, sets: 3, description: '한 다리씩 번갈아' },
      { name: '딥스 (의자)', reps: 12, sets: 3, description: '삼두근 집중' },
      { name: '플랭크', duration: 45, sets: 3, description: '코어 강화' },
    ],
    cooldown: [
      { name: '폼롤러 (또는 스트레칭)', duration: 180, description: '근막 이완' },
      { name: '호흡 운동', duration: 60, description: '깊은 호흡으로 마무리' },
    ],
    contraindicationTags: ['heart_failure'],
    medicationWarnings: ['DROWSINESS_POSSIBLE'],
  },
  {
    id: createId('PH', 'muscle_gain', 'advanced'),
    category: 'PH',
    goal: 'muscle_gain',
    level: 'advanced',
    name: '실내 고급 근력',
    nameEn: 'Advanced Indoor Strength',
    description: '고강도 맨몸 운동으로 근육을 자극합니다.',
    totalDuration: 45,
    intensity: 'high',
    warmup: [
      { name: '버피 (가볍게)', reps: 5, description: '전신 활성화' },
      { name: '동적 스트레칭', duration: 180, description: '충분한 워밍업' },
    ],
    main: [
      { name: '피스톨 스쿼트', reps: 8, sets: 3, description: '한 다리 스쿼트' },
      { name: '다이아몬드 푸시업', reps: 12, sets: 4, description: '삼두근 집중' },
      { name: '핸드스탠드 홀드 (벽)', duration: 30, sets: 3, description: '어깨 강화' },
      { name: 'L-sit 홀드', duration: 20, sets: 3, description: '코어와 삼두근' },
    ],
    cooldown: [
      { name: '요가 스트레칭', duration: 300, description: '전신 이완' },
      { name: '명상 호흡', duration: 120, description: '마음 정리' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension', 'osteoporosis'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  // Stress Relief Goal
  {
    id: createId('PH', 'stress_relief', 'beginner'),
    category: 'PH',
    goal: 'stress_relief',
    level: 'beginner',
    name: '실내 릴렉스 요가',
    nameEn: 'Indoor Relaxing Yoga',
    description: '스트레스 해소를 위한 부드러운 요가 동작입니다.',
    totalDuration: 20,
    intensity: 'low',
    warmup: [
      { name: '심호흡', duration: 60, description: '깊게 숨을 쉬세요' },
      { name: '목 스트레칭', duration: 60, description: '목을 천천히 돌려주세요' },
    ],
    main: [
      { name: '고양이-소 자세', reps: 10, description: '척추를 부드럽게 움직여주세요' },
      { name: '아이 자세', duration: 60, description: '편안하게 휴식' },
      { name: '비둘기 자세', duration: 45, sets: 2, description: '고관절 스트레칭' },
    ],
    cooldown: [
      { name: '시체 자세', duration: 180, description: '완전히 이완하세요' },
      { name: '명상', duration: 120, description: '마음을 비워주세요' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('PH', 'stress_relief', 'intermediate'),
    category: 'PH',
    goal: 'stress_relief',
    level: 'intermediate',
    name: '실내 플로우 요가',
    nameEn: 'Indoor Flow Yoga',
    description: '호흡과 함께 흐르는 요가 시퀀스입니다.',
    totalDuration: 30,
    intensity: 'moderate',
    warmup: [
      { name: '태양 경배 A', reps: 3, description: '몸을 깨워주세요' },
    ],
    main: [
      { name: '전사 시퀀스', duration: 300, description: '전사 1, 2, 3 연결' },
      { name: '균형 자세', duration: 180, description: '나무 자세, 독수리 자세' },
      { name: '트위스트 시퀀스', duration: 180, description: '척추 회전' },
    ],
    cooldown: [
      { name: '앉은 전굴', duration: 120, description: '햄스트링 스트레칭' },
      { name: '시체 자세', duration: 300, description: '완전한 이완' },
    ],
    contraindicationTags: [],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  {
    id: createId('PH', 'stress_relief', 'advanced'),
    category: 'PH',
    goal: 'stress_relief',
    level: 'advanced',
    name: '실내 파워 요가',
    nameEn: 'Indoor Power Yoga',
    description: '강도 있는 요가로 스트레스를 해소합니다.',
    totalDuration: 45,
    intensity: 'moderate',
    warmup: [
      { name: '태양 경배 B', reps: 5, description: '전신 활성화' },
    ],
    main: [
      { name: '전사 플로우', duration: 420, description: '전사 자세 연결 시퀀스' },
      { name: '암 밸런스', duration: 180, description: '까마귀 자세 등' },
      { name: '백벤드 시퀀스', duration: 240, description: '가슴 열기' },
    ],
    cooldown: [
      { name: '힙 오프너', duration: 300, description: '고관절 깊은 스트레칭' },
      { name: '시체 자세', duration: 420, description: '완전한 휴식' },
    ],
    contraindicationTags: ['osteoporosis'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
];

// ============================================
// SO (Sunlight Outdoor) - Sunny + Outdoor
// ============================================

const SO_ROUTINES: RoutineTemplate[] = [
  // Diet Goal
  {
    id: createId('SO', 'diet', 'beginner'),
    category: 'SO',
    goal: 'diet',
    level: 'beginner',
    name: '햇살 산책',
    nameEn: 'Sunny Walk',
    description: '맑은 날 야외에서 즐기는 가벼운 산책입니다.',
    totalDuration: 30,
    intensity: 'low',
    warmup: [
      { name: '제자리 걷기', duration: 60, description: '가볍게 몸을 풀어주세요' },
    ],
    main: [
      { name: '빠른 걷기', duration: 1200, description: '약간 숨이 찰 정도로 걸어주세요' },
      { name: '계단 오르기', duration: 180, description: '계단이 있다면 활용하세요' },
    ],
    cooldown: [
      { name: '천천히 걷기', duration: 180, description: '심박수를 낮춰주세요' },
      { name: '스트레칭', duration: 120, description: '하체 스트레칭' },
    ],
    contraindicationTags: [],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE'],
  },
  {
    id: createId('SO', 'diet', 'intermediate'),
    category: 'SO',
    goal: 'diet',
    level: 'intermediate',
    name: '야외 조깅',
    nameEn: 'Outdoor Jogging',
    description: '햇살 아래 즐기는 조깅 프로그램입니다.',
    totalDuration: 35,
    intensity: 'moderate',
    warmup: [
      { name: '빠른 걷기', duration: 180, description: '워밍업 걷기' },
      { name: '동적 스트레칭', duration: 120, description: '다리 스윙, 런지' },
    ],
    main: [
      { name: '조깅', duration: 1200, description: '대화 가능한 속도로' },
      { name: '인터벌 (빠르게/느리게)', duration: 300, description: '1분 빠르게, 1분 천천히' },
    ],
    cooldown: [
      { name: '걷기', duration: 180, description: '천천히 걸으며 회복' },
      { name: '하체 스트레칭', duration: 180, description: '충분히 늘려주세요' },
    ],
    contraindicationTags: ['heart_failure'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE', 'DROWSINESS_POSSIBLE'],
  },
  {
    id: createId('SO', 'diet', 'advanced'),
    category: 'SO',
    goal: 'diet',
    level: 'advanced',
    name: '야외 인터벌 러닝',
    nameEn: 'Outdoor Interval Running',
    description: '고강도 야외 인터벌 러닝입니다.',
    totalDuration: 45,
    intensity: 'high',
    warmup: [
      { name: '조깅', duration: 300, description: '가볍게 조깅' },
      { name: '동적 스트레칭', duration: 180, description: '전신 동적 스트레칭' },
    ],
    main: [
      { name: '스프린트', duration: 30, sets: 8, description: '전력 질주 후 90초 휴식' },
      { name: '언덕 달리기', duration: 60, sets: 4, description: '언덕이 있다면 활용' },
    ],
    cooldown: [
      { name: '조깅', duration: 300, description: '천천히 조깅' },
      { name: '전신 스트레칭', duration: 300, description: '충분한 쿨다운' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  // Muscle Gain Goal
  {
    id: createId('SO', 'muscle_gain', 'beginner'),
    category: 'SO',
    goal: 'muscle_gain',
    level: 'beginner',
    name: '공원 기초 운동',
    nameEn: 'Park Basic Workout',
    description: '공원에서 할 수 있는 기초 근력 운동입니다.',
    totalDuration: 25,
    intensity: 'low',
    warmup: [
      { name: '빠른 걷기', duration: 120, description: '몸을 데워주세요' },
      { name: '팔 돌리기', reps: 15, sets: 2, description: '어깨 풀기' },
    ],
    main: [
      { name: '벤치 푸시업', reps: 10, sets: 3, description: '벤치에 손을 대고' },
      { name: '스쿼트', reps: 12, sets: 3, description: '정확한 자세로' },
      { name: '벤치 딥스', reps: 8, sets: 3, description: '삼두근 운동' },
    ],
    cooldown: [
      { name: '걷기', duration: 120, description: '천천히 걸으며' },
      { name: '스트레칭', duration: 180, description: '전신 스트레칭' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('SO', 'muscle_gain', 'intermediate'),
    category: 'SO',
    goal: 'muscle_gain',
    level: 'intermediate',
    name: '야외 중급 근력',
    nameEn: 'Outdoor Intermediate Strength',
    description: '공원 시설을 활용한 중급 근력 운동입니다.',
    totalDuration: 40,
    intensity: 'moderate',
    warmup: [
      { name: '조깅', duration: 180, description: '가볍게 조깅' },
      { name: '동적 스트레칭', duration: 120, description: '관절 가동성' },
    ],
    main: [
      { name: '풀업 (또는 인버티드 로우)', reps: 8, sets: 4, description: '등 운동' },
      { name: '딥스', reps: 10, sets: 4, description: '가슴과 삼두근' },
      { name: '점프 스쿼트', reps: 12, sets: 3, description: '하체 폭발력' },
      { name: '플랭크', duration: 45, sets: 3, description: '코어 강화' },
    ],
    cooldown: [
      { name: '걷기', duration: 180, description: '회복 걷기' },
      { name: '스트레칭', duration: 240, description: '전신 스트레칭' },
    ],
    contraindicationTags: ['heart_failure', 'osteoporosis'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE'],
  },
  {
    id: createId('SO', 'muscle_gain', 'advanced'),
    category: 'SO',
    goal: 'muscle_gain',
    level: 'advanced',
    name: '야외 고급 근력',
    nameEn: 'Outdoor Advanced Strength',
    description: '공원 시설을 최대한 활용한 고급 운동입니다.',
    totalDuration: 50,
    intensity: 'high',
    warmup: [
      { name: '조깅', duration: 240, description: '충분한 워밍업' },
      { name: '동적 스트레칭', duration: 180, description: '전신 동적 스트레칭' },
    ],
    main: [
      { name: '머슬업 (또는 풀업)', reps: 5, sets: 5, description: '상체 폭발력' },
      { name: '피스톨 스쿼트', reps: 8, sets: 3, description: '한 다리 스쿼트' },
      { name: '플라이오 푸시업', reps: 10, sets: 4, description: '폭발적 푸시업' },
      { name: '레그 레이즈 (철봉)', reps: 12, sets: 3, description: '코어 강화' },
    ],
    cooldown: [
      { name: '조깅', duration: 240, description: '천천히 조깅' },
      { name: '전신 스트레칭', duration: 360, description: '충분한 쿨다운' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension', 'osteoporosis'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  // Stress Relief Goal
  {
    id: createId('SO', 'stress_relief', 'beginner'),
    category: 'SO',
    goal: 'stress_relief',
    level: 'beginner',
    name: '자연 속 명상 산책',
    nameEn: 'Nature Meditation Walk',
    description: '자연 속에서 마음을 정화하는 산책입니다.',
    totalDuration: 25,
    intensity: 'low',
    warmup: [
      { name: '심호흡', duration: 60, description: '깊게 숨을 쉬세요' },
    ],
    main: [
      { name: '마음챙김 걷기', duration: 900, description: '주변을 관찰하며 천천히' },
      { name: '벤치 명상', duration: 300, description: '앉아서 명상' },
    ],
    cooldown: [
      { name: '스트레칭', duration: 180, description: '부드러운 스트레칭' },
      { name: '감사 명상', duration: 120, description: '감사한 것들을 떠올려보세요' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('SO', 'stress_relief', 'intermediate'),
    category: 'SO',
    goal: 'stress_relief',
    level: 'intermediate',
    name: '야외 요가',
    nameEn: 'Outdoor Yoga',
    description: '햇살 아래서 즐기는 요가입니다.',
    totalDuration: 35,
    intensity: 'moderate',
    warmup: [
      { name: '태양 경배', reps: 5, description: '태양을 향해 인사' },
    ],
    main: [
      { name: '서서 하는 자세', duration: 420, description: '전사, 삼각형 자세 등' },
      { name: '균형 자세', duration: 300, description: '나무, 독수리 자세' },
      { name: '앉아서 하는 자세', duration: 300, description: '전굴, 트위스트' },
    ],
    cooldown: [
      { name: '시체 자세', duration: 300, description: '잔디 위에서 이완' },
      { name: '감사 명상', duration: 180, description: '자연에 감사' },
    ],
    contraindicationTags: [],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE'],
  },
  {
    id: createId('SO', 'stress_relief', 'advanced'),
    category: 'SO',
    goal: 'stress_relief',
    level: 'advanced',
    name: '야외 플로우 요가',
    nameEn: 'Outdoor Flow Yoga',
    description: '자연과 하나 되는 고급 요가 시퀀스입니다.',
    totalDuration: 50,
    intensity: 'moderate',
    warmup: [
      { name: '태양 경배 B', reps: 5, description: '전신 활성화' },
    ],
    main: [
      { name: '전사 플로우', duration: 600, description: '전사 자세 연결' },
      { name: '암 밸런스', duration: 300, description: '까마귀, 사이드 플랭크' },
      { name: '백벤드', duration: 300, description: '가슴 열기' },
      { name: '인버전', duration: 300, description: '물구나무 또는 어깨서기' },
    ],
    cooldown: [
      { name: '힙 오프너', duration: 360, description: '고관절 스트레칭' },
      { name: '시체 자세', duration: 480, description: '완전한 이완' },
    ],
    contraindicationTags: ['osteoporosis', 'hypertension'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
];

// ============================================
// MB (Mood Boosting) - Cloudy/Rain OR Stress High
// ============================================

const MB_ROUTINES: RoutineTemplate[] = [
  // Diet Goal
  {
    id: createId('MB', 'diet', 'beginner'),
    category: 'MB',
    goal: 'diet',
    level: 'beginner',
    name: '기분 전환 댄스',
    nameEn: 'Mood Boosting Dance',
    description: '즐거운 음악과 함께하는 가벼운 댄스 운동입니다.',
    totalDuration: 20,
    intensity: 'low',
    warmup: [
      { name: '제자리 걷기', duration: 60, description: '음악에 맞춰 걸어주세요' },
      { name: '어깨 풀기', duration: 60, description: '어깨를 돌려주세요' },
    ],
    main: [
      { name: '프리 댄스', duration: 600, description: '좋아하는 음악에 맞춰 자유롭게' },
      { name: '스텝 터치', duration: 180, description: '좌우로 스텝' },
    ],
    cooldown: [
      { name: '천천히 움직이기', duration: 120, description: '느린 음악에 맞춰' },
      { name: '스트레칭', duration: 120, description: '전신 스트레칭' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('MB', 'diet', 'intermediate'),
    category: 'MB',
    goal: 'diet',
    level: 'intermediate',
    name: '에어로빅 댄스',
    nameEn: 'Aerobic Dance',
    description: '신나는 에어로빅으로 스트레스를 날려버리세요.',
    totalDuration: 30,
    intensity: 'moderate',
    warmup: [
      { name: '마칭', duration: 120, description: '제자리 행진' },
      { name: '스텝 터치', duration: 60, description: '좌우 스텝' },
    ],
    main: [
      { name: '에어로빅 루틴', duration: 900, description: '다양한 스텝 조합' },
      { name: '점프 동작', duration: 180, description: '점핑잭, 니업' },
      { name: '코어 동작', duration: 180, description: '트위스트, 사이드 밴드' },
    ],
    cooldown: [
      { name: '마칭 (느리게)', duration: 120, description: '심박수 낮추기' },
      { name: '스트레칭', duration: 180, description: '전신 스트레칭' },
    ],
    contraindicationTags: ['heart_failure'],
    medicationWarnings: ['DROWSINESS_POSSIBLE'],
  },
  {
    id: createId('MB', 'diet', 'advanced'),
    category: 'MB',
    goal: 'diet',
    level: 'advanced',
    name: 'HIIT 댄스',
    nameEn: 'HIIT Dance',
    description: '고강도 댄스 인터벌 트레이닝입니다.',
    totalDuration: 40,
    intensity: 'high',
    warmup: [
      { name: '댄스 워밍업', duration: 180, description: '가볍게 몸 풀기' },
    ],
    main: [
      { name: 'HIIT 댄스', duration: 1200, description: '40초 운동, 20초 휴식 반복' },
      { name: '버피 댄스', reps: 10, sets: 3, description: '버피 + 댄스 동작' },
    ],
    cooldown: [
      { name: '쿨다운 댄스', duration: 180, description: '느린 동작' },
      { name: '스트레칭', duration: 240, description: '충분한 스트레칭' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  // Muscle Gain Goal
  {
    id: createId('MB', 'muscle_gain', 'beginner'),
    category: 'MB',
    goal: 'muscle_gain',
    level: 'beginner',
    name: '기분 전환 근력',
    nameEn: 'Mood Boosting Strength',
    description: '음악과 함께하는 즐거운 근력 운동입니다.',
    totalDuration: 25,
    intensity: 'low',
    warmup: [
      { name: '댄스 워밍업', duration: 120, description: '음악에 맞춰 몸 풀기' },
    ],
    main: [
      { name: '스쿼트 (음악 비트)', reps: 12, sets: 3, description: '비트에 맞춰 스쿼트' },
      { name: '푸시업', reps: 8, sets: 3, description: '천천히 정확하게' },
      { name: '런지 (음악 비트)', reps: 10, sets: 2, description: '비트에 맞춰 런지' },
    ],
    cooldown: [
      { name: '느린 댄스', duration: 120, description: '천천히 움직이기' },
      { name: '스트레칭', duration: 180, description: '전신 스트레칭' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('MB', 'muscle_gain', 'intermediate'),
    category: 'MB',
    goal: 'muscle_gain',
    level: 'intermediate',
    name: '리듬 근력 트레이닝',
    nameEn: 'Rhythm Strength Training',
    description: '리듬에 맞춘 중급 근력 운동입니다.',
    totalDuration: 35,
    intensity: 'moderate',
    warmup: [
      { name: '댄스 카디오', duration: 180, description: '가볍게 춤추며 워밍업' },
    ],
    main: [
      { name: '점프 스쿼트', reps: 12, sets: 4, description: '폭발적으로' },
      { name: '푸시업 변형', reps: 10, sets: 4, description: '와이드, 다이아몬드' },
      { name: '버피', reps: 8, sets: 3, description: '전신 운동' },
      { name: '플랭크 잭', duration: 30, sets: 3, description: '코어 + 카디오' },
    ],
    cooldown: [
      { name: '걷기', duration: 120, description: '천천히 걷기' },
      { name: '스트레칭', duration: 240, description: '전신 스트레칭' },
    ],
    contraindicationTags: ['heart_failure', 'osteoporosis'],
    medicationWarnings: ['DROWSINESS_POSSIBLE'],
  },
  {
    id: createId('MB', 'muscle_gain', 'advanced'),
    category: 'MB',
    goal: 'muscle_gain',
    level: 'advanced',
    name: '파워 리듬 트레이닝',
    nameEn: 'Power Rhythm Training',
    description: '고강도 리듬 기반 근력 운동입니다.',
    totalDuration: 45,
    intensity: 'high',
    warmup: [
      { name: '댄스 카디오', duration: 240, description: '충분한 워밍업' },
    ],
    main: [
      { name: '박스 점프', reps: 10, sets: 4, description: '폭발력 훈련' },
      { name: '클랩 푸시업', reps: 8, sets: 4, description: '상체 폭발력' },
      { name: '점프 런지', reps: 12, sets: 3, description: '하체 폭발력' },
      { name: '버피 변형', reps: 10, sets: 4, description: '터키쉬 버피' },
    ],
    cooldown: [
      { name: '조깅', duration: 180, description: '가볍게 조깅' },
      { name: '전신 스트레칭', duration: 300, description: '충분한 쿨다운' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension', 'osteoporosis'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE', 'BLEEDING_RISK_CAUTION'],
  },
  // Stress Relief Goal
  {
    id: createId('MB', 'stress_relief', 'beginner'),
    category: 'MB',
    goal: 'stress_relief',
    level: 'beginner',
    name: '스트레스 해소 스트레칭',
    nameEn: 'Stress Relief Stretching',
    description: '긴장을 풀어주는 부드러운 스트레칭입니다.',
    totalDuration: 20,
    intensity: 'low',
    warmup: [
      { name: '심호흡', duration: 120, description: '깊게 숨을 쉬세요' },
    ],
    main: [
      { name: '목 스트레칭', duration: 120, description: '목 긴장 풀기' },
      { name: '어깨 스트레칭', duration: 120, description: '어깨 긴장 풀기' },
      { name: '등 스트레칭', duration: 180, description: '고양이-소 자세' },
      { name: '고관절 스트레칭', duration: 180, description: '비둘기 자세' },
    ],
    cooldown: [
      { name: '전신 이완', duration: 180, description: '누워서 이완' },
      { name: '명상', duration: 180, description: '마음 정리' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('MB', 'stress_relief', 'intermediate'),
    category: 'MB',
    goal: 'stress_relief',
    level: 'intermediate',
    name: '복싱 스트레스 해소',
    nameEn: 'Boxing Stress Relief',
    description: '복싱 동작으로 스트레스를 해소합니다.',
    totalDuration: 30,
    intensity: 'moderate',
    warmup: [
      { name: '점핑잭', duration: 60, description: '몸 풀기' },
      { name: '섀도 복싱 (가볍게)', duration: 120, description: '가볍게 펀치' },
    ],
    main: [
      { name: '잽-크로스', duration: 180, description: '기본 펀치 조합' },
      { name: '훅-어퍼컷', duration: 180, description: '파워 펀치' },
      { name: '콤비네이션', duration: 300, description: '펀치 조합' },
      { name: '풋워크', duration: 180, description: '발 움직임' },
    ],
    cooldown: [
      { name: '가볍게 걷기', duration: 120, description: '심박수 낮추기' },
      { name: '스트레칭', duration: 180, description: '팔, 어깨 스트레칭' },
    ],
    contraindicationTags: ['heart_failure'],
    medicationWarnings: ['DROWSINESS_POSSIBLE'],
  },
  {
    id: createId('MB', 'stress_relief', 'advanced'),
    category: 'MB',
    goal: 'stress_relief',
    level: 'advanced',
    name: '킥복싱 스트레스 해소',
    nameEn: 'Kickboxing Stress Relief',
    description: '킥복싱으로 스트레스를 완전히 해소합니다.',
    totalDuration: 45,
    intensity: 'high',
    warmup: [
      { name: '조깅', duration: 180, description: '가볍게 조깅' },
      { name: '동적 스트레칭', duration: 180, description: '전신 동적 스트레칭' },
    ],
    main: [
      { name: '펀치 콤비네이션', duration: 300, description: '다양한 펀치 조합' },
      { name: '킥 콤비네이션', duration: 300, description: '프론트, 사이드, 라운드하우스' },
      { name: '펀치-킥 콤보', duration: 420, description: '전신 조합 동작' },
      { name: '백 워크아웃', duration: 300, description: '샌드백 또는 섀도' },
    ],
    cooldown: [
      { name: '걷기', duration: 180, description: '천천히 걷기' },
      { name: '전신 스트레칭', duration: 300, description: '충분한 쿨다운' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE', 'BLEEDING_RISK_CAUTION'],
  },
];

// ============================================
// TF (Temperature Fit) - Very Hot/Very Cold
// ============================================

const TF_ROUTINES: RoutineTemplate[] = [
  // Diet Goal
  {
    id: createId('TF', 'diet', 'beginner'),
    category: 'TF',
    goal: 'diet',
    level: 'beginner',
    name: '온도 맞춤 가벼운 운동',
    nameEn: 'Temperature Fit Light Exercise',
    description: '극한 온도에서도 안전하게 할 수 있는 가벼운 운동입니다.',
    totalDuration: 20,
    intensity: 'low',
    warmup: [
      { name: '제자리 걷기', duration: 120, description: '천천히 몸을 데워주세요' },
    ],
    main: [
      { name: '의자 스쿼트', reps: 10, sets: 3, description: '의자에 앉았다 일어나기' },
      { name: '벽 푸시업', reps: 10, sets: 3, description: '벽에 기대어 푸시업' },
      { name: '제자리 걷기', duration: 300, description: '꾸준히 걷기' },
    ],
    cooldown: [
      { name: '심호흡', duration: 60, description: '깊게 숨쉬기' },
      { name: '스트레칭', duration: 180, description: '가벼운 스트레칭' },
    ],
    contraindicationTags: [],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE'],
  },
  {
    id: createId('TF', 'diet', 'intermediate'),
    category: 'TF',
    goal: 'diet',
    level: 'intermediate',
    name: '실내 유산소',
    nameEn: 'Indoor Cardio',
    description: '실내에서 효과적으로 하는 유산소 운동입니다.',
    totalDuration: 30,
    intensity: 'moderate',
    warmup: [
      { name: '마칭', duration: 120, description: '제자리 행진' },
      { name: '동적 스트레칭', duration: 120, description: '관절 풀기' },
    ],
    main: [
      { name: '하이 니', duration: 180, description: '무릎 높이 올리기' },
      { name: '버트 킥', duration: 180, description: '발뒤꿈치 엉덩이 차기' },
      { name: '점핑잭', duration: 120, description: '전신 유산소' },
      { name: '스텝 터치', duration: 180, description: '좌우 스텝' },
    ],
    cooldown: [
      { name: '걷기', duration: 120, description: '천천히 걷기' },
      { name: '스트레칭', duration: 180, description: '전신 스트레칭' },
    ],
    contraindicationTags: ['heart_failure'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE', 'DROWSINESS_POSSIBLE'],
  },
  {
    id: createId('TF', 'diet', 'advanced'),
    category: 'TF',
    goal: 'diet',
    level: 'advanced',
    name: '실내 HIIT',
    nameEn: 'Indoor HIIT',
    description: '실내에서 하는 고강도 인터벌 트레이닝입니다.',
    totalDuration: 35,
    intensity: 'high',
    warmup: [
      { name: '점핑잭', duration: 120, description: '몸 풀기' },
      { name: '동적 스트레칭', duration: 180, description: '충분한 워밍업' },
    ],
    main: [
      { name: '버피', reps: 10, sets: 4, description: '전신 운동' },
      { name: '마운틴 클라이머', duration: 45, sets: 4, description: '코어 + 카디오' },
      { name: '스쿼트 점프', reps: 12, sets: 3, description: '하체 폭발력' },
      { name: '푸시업', reps: 15, sets: 3, description: '상체 강화' },
    ],
    cooldown: [
      { name: '걷기', duration: 180, description: '천천히 걷기' },
      { name: '전신 스트레칭', duration: 240, description: '충분한 쿨다운' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension', 'hyperthyroidism'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  // Muscle Gain Goal
  {
    id: createId('TF', 'muscle_gain', 'beginner'),
    category: 'TF',
    goal: 'muscle_gain',
    level: 'beginner',
    name: '온도 맞춤 기초 근력',
    nameEn: 'Temperature Fit Basic Strength',
    description: '극한 온도에서도 안전한 기초 근력 운동입니다.',
    totalDuration: 25,
    intensity: 'low',
    warmup: [
      { name: '관절 풀기', duration: 180, description: '모든 관절을 천천히 돌려주세요' },
    ],
    main: [
      { name: '벽 푸시업', reps: 12, sets: 3, description: '벽에 기대어' },
      { name: '의자 스쿼트', reps: 12, sets: 3, description: '의자 활용' },
      { name: '플랭크', duration: 20, sets: 3, description: '코어 강화' },
      { name: '글루트 브릿지', reps: 12, sets: 3, description: '엉덩이 강화' },
    ],
    cooldown: [
      { name: '심호흡', duration: 60, description: '깊게 숨쉬기' },
      { name: '스트레칭', duration: 180, description: '전신 스트레칭' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('TF', 'muscle_gain', 'intermediate'),
    category: 'TF',
    goal: 'muscle_gain',
    level: 'intermediate',
    name: '실내 중급 근력',
    nameEn: 'Indoor Intermediate Strength',
    description: '실내에서 하는 중급 근력 운동입니다.',
    totalDuration: 35,
    intensity: 'moderate',
    warmup: [
      { name: '동적 스트레칭', duration: 180, description: '관절 가동성 확보' },
      { name: '가벼운 스쿼트', reps: 10, description: '몸 데우기' },
    ],
    main: [
      { name: '푸시업', reps: 12, sets: 4, description: '가슴과 삼두근' },
      { name: '스쿼트', reps: 15, sets: 4, description: '하체 강화' },
      { name: '딥스 (의자)', reps: 10, sets: 3, description: '삼두근' },
      { name: '플랭크', duration: 45, sets: 3, description: '코어' },
    ],
    cooldown: [
      { name: '걷기', duration: 120, description: '천천히 걷기' },
      { name: '스트레칭', duration: 240, description: '전신 스트레칭' },
    ],
    contraindicationTags: ['heart_failure'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE'],
  },
  {
    id: createId('TF', 'muscle_gain', 'advanced'),
    category: 'TF',
    goal: 'muscle_gain',
    level: 'advanced',
    name: '실내 고급 근력',
    nameEn: 'Indoor Advanced Strength',
    description: '실내에서 하는 고급 근력 운동입니다.',
    totalDuration: 45,
    intensity: 'high',
    warmup: [
      { name: '동적 스트레칭', duration: 240, description: '충분한 워밍업' },
      { name: '버피 (가볍게)', reps: 5, description: '전신 활성화' },
    ],
    main: [
      { name: '피스톨 스쿼트', reps: 6, sets: 4, description: '한 다리 스쿼트' },
      { name: '다이아몬드 푸시업', reps: 12, sets: 4, description: '삼두근 집중' },
      { name: '불가리안 스플릿 스쿼트', reps: 10, sets: 3, description: '하체 강화' },
      { name: 'L-sit 홀드', duration: 15, sets: 4, description: '코어와 삼두근' },
    ],
    cooldown: [
      { name: '걷기', duration: 180, description: '천천히 걷기' },
      { name: '전신 스트레칭', duration: 300, description: '충분한 쿨다운' },
    ],
    contraindicationTags: ['heart_failure', 'hypertension', 'hyperthyroidism'],
    medicationWarnings: ['DEHYDRATION_RISK_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  // Stress Relief Goal
  {
    id: createId('TF', 'stress_relief', 'beginner'),
    category: 'TF',
    goal: 'stress_relief',
    level: 'beginner',
    name: '온도 맞춤 릴렉스',
    nameEn: 'Temperature Fit Relax',
    description: '극한 온도에서도 편안하게 할 수 있는 이완 운동입니다.',
    totalDuration: 20,
    intensity: 'low',
    warmup: [
      { name: '심호흡', duration: 120, description: '깊게 숨을 쉬세요' },
    ],
    main: [
      { name: '목 스트레칭', duration: 120, description: '목 긴장 풀기' },
      { name: '어깨 스트레칭', duration: 120, description: '어깨 긴장 풀기' },
      { name: '고양이-소 자세', reps: 10, description: '척추 이완' },
      { name: '아이 자세', duration: 120, description: '휴식 자세' },
    ],
    cooldown: [
      { name: '시체 자세', duration: 180, description: '완전히 이완' },
      { name: '명상', duration: 180, description: '마음 정리' },
    ],
    contraindicationTags: [],
    medicationWarnings: [],
  },
  {
    id: createId('TF', 'stress_relief', 'intermediate'),
    category: 'TF',
    goal: 'stress_relief',
    level: 'intermediate',
    name: '실내 요가',
    nameEn: 'Indoor Yoga',
    description: '실내에서 즐기는 요가 시퀀스입니다.',
    totalDuration: 30,
    intensity: 'moderate',
    warmup: [
      { name: '태양 경배 A', reps: 3, description: '몸 깨우기' },
    ],
    main: [
      { name: '서서 하는 자세', duration: 360, description: '전사, 삼각형' },
      { name: '균형 자세', duration: 240, description: '나무, 독수리' },
      { name: '앉아서 하는 자세', duration: 240, description: '전굴, 트위스트' },
    ],
    cooldown: [
      { name: '힙 오프너', duration: 180, description: '고관절 스트레칭' },
      { name: '시체 자세', duration: 300, description: '완전한 이완' },
    ],
    contraindicationTags: [],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
  {
    id: createId('TF', 'stress_relief', 'advanced'),
    category: 'TF',
    goal: 'stress_relief',
    level: 'advanced',
    name: '실내 파워 요가',
    nameEn: 'Indoor Power Yoga',
    description: '실내에서 하는 강도 있는 요가입니다.',
    totalDuration: 45,
    intensity: 'moderate',
    warmup: [
      { name: '태양 경배 B', reps: 5, description: '전신 활성화' },
    ],
    main: [
      { name: '전사 플로우', duration: 480, description: '전사 자세 연결' },
      { name: '암 밸런스', duration: 240, description: '까마귀, 사이드 플랭크' },
      { name: '백벤드', duration: 240, description: '가슴 열기' },
      { name: '인버전', duration: 180, description: '어깨서기 또는 물구나무' },
    ],
    cooldown: [
      { name: '힙 오프너', duration: 300, description: '깊은 스트레칭' },
      { name: '시체 자세', duration: 420, description: '완전한 휴식' },
    ],
    contraindicationTags: ['osteoporosis', 'hypertension'],
    medicationWarnings: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
  },
];

// ============================================
// Export All Routines
// ============================================

export const ALL_ROUTINES: RoutineTemplate[] = [
  ...PH_ROUTINES,
  ...SO_ROUTINES,
  ...MB_ROUTINES,
  ...TF_ROUTINES,
];

// Helper functions
export function getRoutinesByCategory(category: ExerciseCategory): RoutineTemplate[] {
  return ALL_ROUTINES.filter(r => r.category === category);
}

export function getRoutinesByGoal(goal: UserGoal): RoutineTemplate[] {
  // Map user goals to exercise goals
  const exerciseGoal = goal === 'weight_management' || goal === 'weight_gain' 
    ? 'muscle_gain' 
    : goal;
  return ALL_ROUTINES.filter(r => r.goal === exerciseGoal);
}

export function getRoutinesByLevel(level: ExerciseLevel): RoutineTemplate[] {
  return ALL_ROUTINES.filter(r => r.level === level);
}

export function getRoutine(
  category: ExerciseCategory,
  goal: UserGoal,
  level: ExerciseLevel
): RoutineTemplate | undefined {
  const exerciseGoal = goal === 'weight_management' || goal === 'weight_gain' 
    ? 'muscle_gain' 
    : goal;
  return ALL_ROUTINES.find(
    r => r.category === category && r.goal === exerciseGoal && r.level === level
  );
}

export function getRoutineById(id: string): RoutineTemplate | undefined {
  return ALL_ROUTINES.find(r => r.id === id);
}
