// ============================================
// Internal Drug Dataset
// Deterministic facts for medication handling
// ============================================

import { MedicationTag } from '@/types';

export interface DrugInfo {
  id: string;
  nameKo: string;
  nameEn: string;
  category: string;
  tags: MedicationTag[];
  commonUse: string;
  exerciseNote?: string;
  mealNote?: string;
  generalNote?: string;
}

// ============================================
// Drug Database
// ============================================

export const DRUG_DATABASE: DrugInfo[] = [
  // 혈압약 (Antihypertensives)
  {
    id: 'drug-001',
    nameKo: '아테놀롤',
    nameEn: 'Atenolol',
    category: '베타차단제',
    tags: ['DROWSINESS_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
    commonUse: '고혈압, 협심증 치료',
    exerciseNote: '운동 시 심박수 반응이 둔화될 수 있어요. 자각적 운동 강도를 기준으로 해주세요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '갑자기 중단하지 마세요.',
  },
  {
    id: 'drug-002',
    nameKo: '암로디핀',
    nameEn: 'Amlodipine',
    category: '칼슘채널차단제',
    tags: ['ORTHOSTATIC_DIZZINESS_POSSIBLE'],
    commonUse: '고혈압, 협심증 치료',
    exerciseNote: '급격한 자세 변화 시 어지러울 수 있어요. 천천히 일어나세요.',
    mealNote: '자몽주스와 함께 복용하지 마세요.',
    generalNote: '발목 부종이 생길 수 있어요.',
  },
  {
    id: 'drug-003',
    nameKo: '로사르탄',
    nameEn: 'Losartan',
    category: 'ARB',
    tags: ['ORTHOSTATIC_DIZZINESS_POSSIBLE', 'DEHYDRATION_RISK_POSSIBLE'],
    commonUse: '고혈압 치료',
    exerciseNote: '탈수에 주의하세요. 운동 전후 충분히 수분을 섭취해주세요.',
    mealNote: '칼륨이 많은 음식(바나나, 오렌지 등)을 과다 섭취하지 마세요.',
    generalNote: '기침이 적은 편이에요.',
  },
  
  // 당뇨약 (Antidiabetics)
  {
    id: 'drug-004',
    nameKo: '메트포르민',
    nameEn: 'Metformin',
    category: '비구아나이드',
    tags: [],
    commonUse: '제2형 당뇨병 치료',
    exerciseNote: '운동은 혈당 조절에 도움이 돼요. 저혈당 증상에 주의하세요.',
    mealNote: '식사와 함께 복용하면 위장 불편감이 줄어요.',
    generalNote: '과도한 음주를 피하세요.',
  },
  {
    id: 'drug-005',
    nameKo: '글리메피리드',
    nameEn: 'Glimepiride',
    category: '설포닐우레아',
    tags: ['DROWSINESS_POSSIBLE'],
    commonUse: '제2형 당뇨병 치료',
    exerciseNote: '공복 운동 시 저혈당 위험이 있어요. 간식을 준비하세요.',
    mealNote: '아침 식사와 함께 복용하세요.',
    generalNote: '저혈당 증상(떨림, 식은땀)을 알아두세요.',
  },
  {
    id: 'drug-006',
    nameKo: '시타글립틴',
    nameEn: 'Sitagliptin',
    category: 'DPP-4 억제제',
    tags: [],
    commonUse: '제2형 당뇨병 치료',
    exerciseNote: '운동은 혈당 조절에 좋아요. 평소처럼 운동하셔도 돼요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '저혈당 위험이 낮은 약이에요.',
  },
  
  // 고지혈증약 (Statins)
  {
    id: 'drug-007',
    nameKo: '아토르바스타틴',
    nameEn: 'Atorvastatin',
    category: '스타틴',
    tags: ['DROWSINESS_POSSIBLE'],
    commonUse: '고지혈증 치료',
    exerciseNote: '근육통이 생기면 운동 강도를 낮추고 의사와 상담하세요.',
    mealNote: '자몽주스와 함께 복용하지 마세요.',
    generalNote: '저녁에 복용하면 효과가 좋아요.',
  },
  {
    id: 'drug-008',
    nameKo: '로수바스타틴',
    nameEn: 'Rosuvastatin',
    category: '스타틴',
    tags: ['DROWSINESS_POSSIBLE'],
    commonUse: '고지혈증 치료',
    exerciseNote: '근육통이 생기면 운동 강도를 낮추세요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '정기적인 간 기능 검사가 필요해요.',
  },
  
  // 갑상선약 (Thyroid medications)
  {
    id: 'drug-009',
    nameKo: '레보티록신',
    nameEn: 'Levothyroxine',
    category: '갑상선호르몬',
    tags: [],
    commonUse: '갑상선기능저하증 치료',
    exerciseNote: '약이 안정되면 평소처럼 운동하셔도 돼요.',
    mealNote: '공복에 복용하고 30분 후 식사하세요. 칼슘, 철분제와 4시간 간격을 두세요.',
    generalNote: '매일 같은 시간에 복용하세요.',
  },
  {
    id: 'drug-010',
    nameKo: '메티마졸',
    nameEn: 'Methimazole',
    category: '항갑상선제',
    tags: [],
    commonUse: '갑상선기능항진증 치료',
    exerciseNote: '갑상선 기능이 안정될 때까지 고강도 운동을 피하세요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '정기적인 혈액 검사가 필요해요.',
  },
  
  // 진통제/소염제 (Pain relievers)
  {
    id: 'drug-011',
    nameKo: '이부프로펜',
    nameEn: 'Ibuprofen',
    category: 'NSAIDs',
    tags: ['BLEEDING_RISK_CAUTION', 'DEHYDRATION_RISK_POSSIBLE'],
    commonUse: '통증, 염증 완화',
    exerciseNote: '탈수에 주의하세요. 충분히 수분을 섭취해주세요.',
    mealNote: '식사와 함께 복용하면 위장 자극이 줄어요.',
    generalNote: '장기 복용 시 위장 출혈 위험이 있어요.',
  },
  {
    id: 'drug-012',
    nameKo: '아세트아미노펜',
    nameEn: 'Acetaminophen',
    category: '해열진통제',
    tags: [],
    commonUse: '통증, 발열 완화',
    exerciseNote: '평소처럼 운동하셔도 돼요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '하루 최대 용량을 지키세요. 음주를 피하세요.',
  },
  
  // 항응고제 (Anticoagulants)
  {
    id: 'drug-013',
    nameKo: '와파린',
    nameEn: 'Warfarin',
    category: '항응고제',
    tags: ['BLEEDING_RISK_CAUTION'],
    commonUse: '혈전 예방',
    exerciseNote: '충돌이나 낙상 위험이 있는 운동을 피하세요.',
    mealNote: '비타민K가 많은 음식(녹색 채소)을 일정하게 섭취하세요.',
    generalNote: '정기적인 INR 검사가 필요해요.',
  },
  {
    id: 'drug-014',
    nameKo: '아스피린',
    nameEn: 'Aspirin',
    category: '항혈소판제',
    tags: ['BLEEDING_RISK_CAUTION'],
    commonUse: '심혈관 질환 예방',
    exerciseNote: '충돌 위험이 있는 운동에 주의하세요.',
    mealNote: '식사와 함께 복용하면 위장 자극이 줄어요.',
    generalNote: '출혈 증상에 주의하세요.',
  },
  {
    id: 'drug-015',
    nameKo: '리바록사반',
    nameEn: 'Rivaroxaban',
    category: 'NOAC',
    tags: ['BLEEDING_RISK_CAUTION'],
    commonUse: '혈전 예방',
    exerciseNote: '낙상 위험이 있는 운동을 피하세요.',
    mealNote: '식사와 함께 복용하세요.',
    generalNote: '정기적인 신장 기능 검사가 필요해요.',
  },
  
  // 수면제/진정제 (Sleep aids)
  {
    id: 'drug-016',
    nameKo: '졸피뎀',
    nameEn: 'Zolpidem',
    category: '수면제',
    tags: ['DROWSINESS_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
    commonUse: '불면증 치료',
    exerciseNote: '복용 후 8시간 이내에는 운동을 피하세요.',
    mealNote: '공복에 복용하면 효과가 빨라요.',
    generalNote: '취침 직전에 복용하세요.',
  },
  {
    id: 'drug-017',
    nameKo: '알프라졸람',
    nameEn: 'Alprazolam',
    category: '벤조디아제핀',
    tags: ['DROWSINESS_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
    commonUse: '불안, 공황장애 치료',
    exerciseNote: '졸음이 올 수 있어요. 운동 시 주의하세요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '갑자기 중단하지 마세요.',
  },
  
  // 이뇨제 (Diuretics)
  {
    id: 'drug-018',
    nameKo: '푸로세미드',
    nameEn: 'Furosemide',
    category: '루프이뇨제',
    tags: ['DEHYDRATION_RISK_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
    commonUse: '부종, 고혈압 치료',
    exerciseNote: '탈수에 특히 주의하세요. 운동 전후 충분히 수분을 섭취해주세요.',
    mealNote: '아침에 복용하면 야간 소변을 줄일 수 있어요.',
    generalNote: '칼륨 수치를 정기적으로 확인하세요.',
  },
  {
    id: 'drug-019',
    nameKo: '하이드로클로로티아지드',
    nameEn: 'Hydrochlorothiazide',
    category: '티아지드이뇨제',
    tags: ['DEHYDRATION_RISK_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
    commonUse: '고혈압, 부종 치료',
    exerciseNote: '더운 날씨에 운동할 때 탈수에 주의하세요.',
    mealNote: '아침에 복용하세요.',
    generalNote: '햇빛에 민감해질 수 있어요.',
  },
  
  // 항히스타민제 (Antihistamines)
  {
    id: 'drug-020',
    nameKo: '세티리진',
    nameEn: 'Cetirizine',
    category: '항히스타민제',
    tags: ['DROWSINESS_POSSIBLE'],
    commonUse: '알레르기 증상 완화',
    exerciseNote: '졸음이 올 수 있어요. 운동 시 주의하세요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '1세대보다 졸음이 적어요.',
  },
  {
    id: 'drug-021',
    nameKo: '디펜히드라민',
    nameEn: 'Diphenhydramine',
    category: '항히스타민제',
    tags: ['DROWSINESS_POSSIBLE', 'ORTHOSTATIC_DIZZINESS_POSSIBLE'],
    commonUse: '알레르기, 수면 보조',
    exerciseNote: '졸음이 심할 수 있어요. 복용 후 운동을 피하세요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '운전이나 기계 조작을 피하세요.',
  },
  
  // 위장약 (GI medications)
  {
    id: 'drug-022',
    nameKo: '오메프라졸',
    nameEn: 'Omeprazole',
    category: 'PPI',
    tags: [],
    commonUse: '위산 과다, 역류성 식도염 치료',
    exerciseNote: '평소처럼 운동하셔도 돼요.',
    mealNote: '식사 30분 전에 복용하세요.',
    generalNote: '장기 복용 시 마그네슘, 비타민B12 수치를 확인하세요.',
  },
  {
    id: 'drug-023',
    nameKo: '란소프라졸',
    nameEn: 'Lansoprazole',
    category: 'PPI',
    tags: [],
    commonUse: '위궤양, 역류성 식도염 치료',
    exerciseNote: '평소처럼 운동하셔도 돼요.',
    mealNote: '식사 전에 복용하세요.',
    generalNote: '정해진 기간만 복용하세요.',
  },
  
  // 골다공증약 (Osteoporosis medications)
  {
    id: 'drug-024',
    nameKo: '알렌드로네이트',
    nameEn: 'Alendronate',
    category: '비스포스포네이트',
    tags: [],
    commonUse: '골다공증 치료',
    exerciseNote: '체중 부하 운동이 뼈 건강에 좋아요.',
    mealNote: '아침 공복에 물 한 컵과 함께 복용하고 30분간 눕지 마세요.',
    generalNote: '주 1회 복용하는 제형이 많아요.',
  },
  
  // 항우울제 (Antidepressants)
  {
    id: 'drug-025',
    nameKo: '에스시탈로프람',
    nameEn: 'Escitalopram',
    category: 'SSRI',
    tags: ['DROWSINESS_POSSIBLE'],
    commonUse: '우울증, 불안장애 치료',
    exerciseNote: '운동은 기분 개선에 도움이 돼요. 규칙적으로 운동하세요.',
    mealNote: '식사와 관계없이 복용할 수 있어요.',
    generalNote: '효과가 나타나기까지 2-4주가 걸려요.',
  },
  {
    id: 'drug-026',
    nameKo: '세르트랄린',
    nameEn: 'Sertraline',
    category: 'SSRI',
    tags: ['DROWSINESS_POSSIBLE'],
    commonUse: '우울증, 불안장애 치료',
    exerciseNote: '운동은 치료에 도움이 돼요.',
    mealNote: '식사와 함께 복용하면 위장 불편감이 줄어요.',
    generalNote: '갑자기 중단하지 마세요.',
  },
];

// ============================================
// Helper Functions
// ============================================

export function searchDrugs(query: string): DrugInfo[] {
  const lowerQuery = query.toLowerCase();
  return DRUG_DATABASE.filter(
    drug =>
      drug.nameKo.toLowerCase().includes(lowerQuery) ||
      drug.nameEn.toLowerCase().includes(lowerQuery) ||
      drug.category.toLowerCase().includes(lowerQuery)
  );
}

export function getDrugById(id: string): DrugInfo | undefined {
  return DRUG_DATABASE.find(drug => drug.id === id);
}

export function getDrugByName(name: string): DrugInfo | undefined {
  const lowerName = name.toLowerCase();
  return DRUG_DATABASE.find(
    drug =>
      drug.nameKo.toLowerCase() === lowerName ||
      drug.nameEn.toLowerCase() === lowerName
  );
}

export function getDrugsByTag(tag: MedicationTag): DrugInfo[] {
  return DRUG_DATABASE.filter(drug => drug.tags.includes(tag));
}

export function getDrugsByCategory(category: string): DrugInfo[] {
  return DRUG_DATABASE.filter(drug => drug.category === category);
}

// Get all unique categories
export function getAllCategories(): string[] {
  return [...new Set(DRUG_DATABASE.map(drug => drug.category))];
}
