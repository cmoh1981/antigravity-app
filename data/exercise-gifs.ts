/**
 * Exercise GIF Mappings
 * Maps exercise names to GIF URLs for demonstration
 */

export interface ExerciseGifMapping {
  name: string;
  gifUrl: string;
  description: string;
  tips: string[];
}

// GIF URLs from public exercise demonstration sources
// In production, these should be hosted on your CDN
const BASE_GIF_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

export const EXERCISE_GIFS: Record<string, ExerciseGifMapping> = {
  // 기본 동작들
  '제자리 걷기': {
    name: '제자리 걷기',
    gifUrl: `${BASE_GIF_URL}/high_knees/0.jpg`,
    description: '제자리에서 자연스럽게 걷는 동작으로 몸을 따뜻하게 합니다.',
    tips: [
      '등을 곧게 펴고 자연스럽게 걸어주세요',
      '팔을 자연스럽게 흔들어주세요',
      '무릎을 과하게 들지 마세요'
    ]
  },
  '팔 돌리기': {
    name: '팔 돌리기',
    gifUrl: `${BASE_GIF_URL}/arm_circles/0.jpg`,
    description: '어깨 관절을 풀어주는 동작입니다.',
    tips: [
      '크고 천천히 돌려주세요',
      '앞뒤로 번갈아가며 돌려주세요',
      '어깨에 긴장을 풀어주세요'
    ]
  },
  '점핑잭': {
    name: '점핑잭',
    gifUrl: `${BASE_GIF_URL}/jumping_jacks/0.jpg`,
    description: '전신 유산소 운동으로 심박수를 높입니다.',
    tips: [
      '팔과 다리를 동시에 벌려주세요',
      '가볍게 점프하세요',
      '호흡을 일정하게 유지하세요'
    ]
  },
  '버피': {
    name: '버피',
    gifUrl: `${BASE_GIF_URL}/burpees/0.jpg`,
    description: '전신 근력과 유산소를 동시에 향상시키는 고강도 운동입니다.',
    tips: [
      '플랭크 자세를 정확히 유지하세요',
      '점프할 때 팔을 위로 뻗어주세요',
      '자신의 페이스대로 진행하세요'
    ]
  },
  '푸시업': {
    name: '푸시업',
    gifUrl: `${BASE_GIF_URL}/push_ups/0.jpg`,
    description: '가슴, 어깨, 삼두근을 단련하는 대표적인 상체 운동입니다.',
    tips: [
      '몸을 일직선으로 유지하세요',
      '팔꿈치를 45도 각도로 벌려주세요',
      '가슴이 바닥에 닿을 때까지 내려가세요'
    ]
  },
  '푸시업 (무릎)': {
    name: '푸시업 (무릎)',
    gifUrl: `${BASE_GIF_URL}/knee_push_ups/0.jpg`,
    description: '무릎을 대고 하는 초보자용 푸시업입니다.',
    tips: [
      '무릎에서 어깨까지 일직선을 유지하세요',
      '엉덩이가 올라가지 않게 주의하세요',
      '천천히 올라가고 내려가세요'
    ]
  },
  '스쿼트': {
    name: '스쿼트',
    gifUrl: `${BASE_GIF_URL}/squats/0.jpg`,
    description: '하체 전체를 강화하는 기본 운동입니다.',
    tips: [
      '무릎이 발끝을 넘지 않게 하세요',
      '엉덩이를 뒤로 빼면서 앉으세요',
      '가슴을 펴고 시선은 정면을 보세요'
    ]
  },
  '스쿼트 점프': {
    name: '스쿼트 점프',
    gifUrl: `${BASE_GIF_URL}/jump_squats/0.jpg`,
    description: '스쿼트에 점프를 추가한 고강도 하체 운동입니다.',
    tips: [
      '착지할 때 무릎에 무리가 가지 않게 하세요',
      '점프 전 스쿼트 자세를 정확히 하세요',
      '폭발적으로 점프하세요'
    ]
  },
  '플랭크': {
    name: '플랭크',
    gifUrl: `${BASE_GIF_URL}/plank/0.jpg`,
    description: '코어 근육을 강화하는 정적 운동입니다.',
    tips: [
      '몸을 일직선으로 유지하세요',
      '엉덩이가 올라가거나 내려가지 않게 하세요',
      '복부에 힘을 주고 호흡을 유지하세요'
    ]
  },
  '마운틴 클라이머': {
    name: '마운틴 클라이머',
    gifUrl: `${BASE_GIF_URL}/mountain_climbers/0.jpg`,
    description: '유산소와 코어를 동시에 자극하는 운동입니다.',
    tips: [
      '플랭크 자세를 유지하세요',
      '무릎을 가슴 쪽으로 당겨주세요',
      '빠르게 번갈아가며 실시하세요'
    ]
  },
  '런지': {
    name: '런지',
    gifUrl: `${BASE_GIF_URL}/lunges/0.jpg`,
    description: '하체 근육을 균형있게 발달시키는 운동입니다.',
    tips: [
      '무릎이 발끝을 넘지 않게 하세요',
      '상체를 곧게 유지하세요',
      '뒷무릎이 거의 바닥에 닿을 때까지 내려가세요'
    ]
  },
  '니업': {
    name: '니업',
    gifUrl: `${BASE_GIF_URL}/high_knees/0.jpg`,
    description: '무릎을 높이 올리는 유산소 운동입니다.',
    tips: [
      '무릎을 최대한 높이 올려주세요',
      '빠른 템포로 진행하세요',
      '상체를 곧게 유지하세요'
    ]
  },
  '사이드 스텝': {
    name: '사이드 스텝',
    gifUrl: `${BASE_GIF_URL}/side_steps/0.jpg`,
    description: '좌우로 움직이며 하체를 강화합니다.',
    tips: [
      '무릎을 약간 구부린 상태를 유지하세요',
      '좌우로 빠르게 움직이세요',
      '중심을 낮게 유지하세요'
    ]
  },
  '불가리안 스플릿 스쿼트': {
    name: '불가리안 스플릿 스쿼트',
    gifUrl: `${BASE_GIF_URL}/bulgarian_split_squats/0.jpg`,
    description: '한 다리로 하는 고강도 하체 운동입니다.',
    tips: [
      '뒷발을 의자나 벤치에 올리세요',
      '앞무릎이 발끝을 넘지 않게 하세요',
      '균형을 유지하며 천천히 진행하세요'
    ]
  },
  '딥스 (의자)': {
    name: '딥스 (의자)',
    gifUrl: `${BASE_GIF_URL}/bench_dips/0.jpg`,
    description: '삼두근을 집중적으로 단련하는 운동입니다.',
    tips: [
      '손을 의자 끝에 올리세요',
      '팔꿈치를 뒤로 향하게 하세요',
      '어깨를 으쓱하지 마세요'
    ]
  },
  '박스 점프 (의자)': {
    name: '박스 점프 (의자)',
    gifUrl: `${BASE_GIF_URL}/box_jumps/0.jpg`,
    description: '폭발적인 하체 파워를 키우는 운동입니다.',
    tips: [
      '안정적인 의자나 박스를 사용하세요',
      '부드럽게 착지하세요',
      '무릎을 충분히 구부리고 점프하세요'
    ]
  },
  '터키쉬 겟업': {
    name: '터키쉬 겟업',
    gifUrl: `${BASE_GIF_URL}/turkish_get_ups/0.jpg`,
    description: '전신 안정성과 코어를 강화하는 복합 운동입니다.',
    tips: [
      '천천히 단계별로 진행하세요',
      '무게 없이 동작을 먼저 익히세요',
      '시선은 손을 따라가세요'
    ]
  },
  '다이아몬드 푸시업': {
    name: '다이아몬드 푸시업',
    gifUrl: `${BASE_GIF_URL}/diamond_push_ups/0.jpg`,
    description: '삼두근에 집중하는 고급 푸시업입니다.',
    tips: [
      '손을 다이아몬드 모양으로 모으세요',
      '팔꿈치를 몸에 붙이세요',
      '천천히 컨트롤하며 진행하세요'
    ]
  },
  '피스톨 스쿼트': {
    name: '피스톨 스쿼트',
    gifUrl: `${BASE_GIF_URL}/pistol_squats/0.jpg`,
    description: '한 다리로 하는 고난이도 스쿼트입니다.',
    tips: [
      '균형을 잡기 위해 팔을 앞으로 뻗으세요',
      '처음엔 지지대를 잡고 연습하세요',
      '천천히 내려가고 올라오세요'
    ]
  },
  '핸드스탠드 홀드 (벽)': {
    name: '핸드스탠드 홀드 (벽)',
    gifUrl: `${BASE_GIF_URL}/handstand_wall/0.jpg`,
    description: '어깨와 코어를 강화하는 고급 운동입니다.',
    tips: [
      '벽을 이용해 안전하게 연습하세요',
      '손은 어깨 너비로 벌리세요',
      '코어에 힘을 주고 몸을 곧게 유지하세요'
    ]
  },
  'L-sit 홀드': {
    name: 'L-sit 홀드',
    gifUrl: `${BASE_GIF_URL}/l_sit/0.jpg`,
    description: '코어와 삼두근을 동시에 강화하는 고급 운동입니다.',
    tips: [
      '엉덩이를 바닥에서 들어올리세요',
      '다리를 앞으로 쭉 뻗으세요',
      '어깨를 으쓱하지 마세요'
    ]
  },
  '플랭크 투 푸시업': {
    name: '플랭크 투 푸시업',
    gifUrl: `${BASE_GIF_URL}/plank_to_push_up/0.jpg`,
    description: '플랭크에서 푸시업으로 전환하는 동적 운동입니다.',
    tips: [
      '몸의 흔들림을 최소화하세요',
      '한 팔씩 번갈아가며 진행하세요',
      '코어에 계속 힘을 주세요'
    ]
  },
  '고양이-소 자세': {
    name: '고양이-소 자세',
    gifUrl: `${BASE_GIF_URL}/cat_cow/0.jpg`,
    description: '척추를 부드럽게 움직여주는 요가 동작입니다.',
    tips: [
      '호흡과 함께 천천히 움직이세요',
      '척추를 최대한 구부리고 펴주세요',
      '목도 함께 움직여주세요'
    ]
  },
  '아이 자세': {
    name: '아이 자세',
    gifUrl: `${BASE_GIF_URL}/childs_pose/0.jpg`,
    description: '휴식과 회복을 위한 요가 자세입니다.',
    tips: [
      '무릎을 벌리고 앉으세요',
      '팔을 앞으로 쭉 뻗으세요',
      '깊게 호흡하며 이완하세요'
    ]
  },
  '비둘기 자세': {
    name: '비둘기 자세',
    gifUrl: `${BASE_GIF_URL}/pigeon_pose/0.jpg`,
    description: '고관절을 깊게 스트레칭하는 요가 자세입니다.',
    tips: [
      '한 다리를 앞으로 구부리세요',
      '골반을 바닥과 평행하게 유지하세요',
      '깊게 호흡하며 자세를 유지하세요'
    ]
  },
  '시체 자세': {
    name: '시체 자세',
    gifUrl: `${BASE_GIF_URL}/corpse_pose/0.jpg`,
    description: '완전한 이완을 위한 마무리 자세입니다.',
    tips: [
      '등을 대고 편안하게 누우세요',
      '팔다리를 자연스럽게 벌리세요',
      '온몸의 긴장을 풀어주세요'
    ]
  },
  '전사 자세': {
    name: '전사 자세',
    gifUrl: `${BASE_GIF_URL}/warrior_pose/0.jpg`,
    description: '하체 힘과 균형을 기르는 요가 자세입니다.',
    tips: [
      '앞무릎을 90도로 구부리세요',
      '뒷다리는 쭉 펴주세요',
      '가슴을 펴고 시선은 정면을 보세요'
    ]
  },
  '나무 자세': {
    name: '나무 자세',
    gifUrl: `${BASE_GIF_URL}/tree_pose/0.jpg`,
    description: '균형과 집중력을 키우는 요가 자세입니다.',
    tips: [
      '한 발로 균형을 잡으세요',
      '발바닥을 허벅지 안쪽에 대세요',
      '손을 가슴 앞이나 머리 위로 올리세요'
    ]
  },
  '태양경배': {
    name: '태양경배',
    gifUrl: `${BASE_GIF_URL}/sun_salutation/0.jpg`,
    description: '전신을 깨우는 요가 시퀀스입니다.',
    tips: [
      '호흡과 함께 유연하게 움직이세요',
      '각 자세를 정확히 취하세요',
      '자신의 페이스대로 진행하세요'
    ]
  },
  '코브라 자세': {
    name: '코브라 자세',
    gifUrl: `${BASE_GIF_URL}/cobra_pose/0.jpg`,
    description: '등과 코어를 강화하는 요가 자세입니다.',
    tips: [
      '엎드린 상태에서 상체를 들어올리세요',
      '어깨를 뒤로 당기세요',
      '골반은 바닥에 붙이세요'
    ]
  },
  '하향개 자세': {
    name: '하향개 자세',
    gifUrl: `${BASE_GIF_URL}/downward_dog/0.jpg`,
    description: '전신을 스트레칭하는 기본 요가 자세입니다.',
    tips: [
      '엉덩이를 높이 올리세요',
      '팔과 다리를 쭉 펴주세요',
      '발뒤꿈치를 바닥에 가까이 하세요'
    ]
  },
  '심호흡': {
    name: '심호흡',
    gifUrl: `${BASE_GIF_URL}/deep_breathing/0.jpg`,
    description: '마음을 안정시키고 산소를 공급합니다.',
    tips: [
      '코로 깊게 들이마시세요',
      '입으로 천천히 내쉬세요',
      '배로 호흡하세요'
    ]
  },
  '명상': {
    name: '명상',
    gifUrl: `${BASE_GIF_URL}/meditation/0.jpg`,
    description: '마음을 비우고 집중력을 높입니다.',
    tips: [
      '편안한 자세로 앉으세요',
      '눈을 감고 호흡에 집중하세요',
      '잡념이 들어도 다시 호흡으로 돌아오세요'
    ]
  },
  '걷기': {
    name: '걷기',
    gifUrl: `${BASE_GIF_URL}/walking/0.jpg`,
    description: '가장 기본적인 유산소 운동입니다.',
    tips: [
      '등을 곧게 펴고 걸으세요',
      '팔을 자연스럽게 흔들어주세요',
      '일정한 페이스를 유지하세요'
    ]
  },
  '동적 스트레칭': {
    name: '동적 스트레칭',
    gifUrl: `${BASE_GIF_URL}/dynamic_stretching/0.jpg`,
    description: '관절 가동 범위를 늘리는 워밍업입니다.',
    tips: [
      '천천히 관절을 움직여주세요',
      '통증이 있으면 중단하세요',
      '각 부위를 골고루 움직이세요'
    ]
  },
  '전신 스트레칭': {
    name: '전신 스트레칭',
    gifUrl: `${BASE_GIF_URL}/full_body_stretch/0.jpg`,
    description: '운동 후 근육을 이완시킵니다.',
    tips: [
      '각 스트레칭을 20-30초 유지하세요',
      '반동을 주지 마세요',
      '깊게 호흡하며 진행하세요'
    ]
  }
};

/**
 * Get exercise GIF data by name
 */
export function getExerciseGif(exerciseName: string): ExerciseGifMapping | null {
  return EXERCISE_GIFS[exerciseName] || null;
}

/**
 * Get all available exercise GIFs
 */
export function getAllExerciseGifs(): ExerciseGifMapping[] {
  return Object.values(EXERCISE_GIFS);
}
