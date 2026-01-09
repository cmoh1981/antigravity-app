// ============================================
// LLM Adapter
// Template-based fallback + optional LLM integration
// ============================================

import {
  CoachFacts,
  CoachCopy,
  DrugFacts,
  DrugExplainCopy,
  ChatIntent,
  ChatMessage,
  MoodEmoji,
  StressLevel,
  ExerciseCategory,
  CATEGORY_LABELS,
  GOAL_LABELS,
} from '@/types';
import { generateId } from '@/store';

// ============================================
// LLM Provider Interface
// ============================================

export interface LLMProvider {
  generateCoachText(facts: CoachFacts): Promise<CoachCopy>;
  generateDrugExplain(facts: DrugFacts): Promise<DrugExplainCopy>;
  generateChatResponse(message: string, intent: ChatIntent): Promise<string>;
}

// ============================================
// NoLLMProvider - Template-based fallback
// ============================================

export class NoLLMProvider implements LLMProvider {
  async generateCoachText(facts: CoachFacts): Promise<CoachCopy> {
    const greeting = this.getGreeting(facts.todayMood, facts.userName);
    const exerciseMotivation = this.getExerciseMotivation(facts.exerciseCategory, facts.exerciseRoutineName);
    const mealTip = this.getMealTip(facts.goal);
    const sleepAdvice = this.getSleepAdvice(facts.sleepDuration, facts.todayStress);
    const closing = this.getClosing(facts.todayMood);
    
    return {
      greeting,
      exerciseMotivation,
      mealTip,
      sleepAdvice,
      closing,
    };
  }
  
  async generateDrugExplain(facts: DrugFacts): Promise<DrugExplainCopy> {
    return {
      summary: `${facts.name}은(는) 처방받은 대로 복용해주세요.`,
      exerciseNote: facts.tags.length > 0 
        ? '운동 시 주의사항이 있을 수 있어요. 자세한 내용은 약 정보를 확인해주세요.'
        : undefined,
      mealNote: '식사와 관련된 복용 지침은 처방전을 확인해주세요.',
      generalNote: '궁금한 점은 담당 의사나 약사에게 문의해주세요.',
    };
  }
  
  async generateChatResponse(message: string, intent: ChatIntent): Promise<string> {
    return this.getTemplateResponse(intent);
  }
  
  private getGreeting(mood: MoodEmoji, userName?: string): string {
    const name = userName ? `${userName}님` : '회원님';
    
    const greetings: Record<MoodEmoji, string> = {
      '😄': `${name}, 오늘 기분이 정말 좋아 보이시네요! 이 에너지를 운동에 활용해볼까요?`,
      '🙂': `${name}, 안녕하세요! 오늘도 건강한 하루 보내세요.`,
      '😐': `${name}, 오늘 하루 어떠세요? 가벼운 운동이 기분 전환에 도움이 될 거예요.`,
      '😣': `${name}, 힘든 하루인가요? 무리하지 말고 천천히 해요.`,
      '😤': `${name}, 스트레스가 많으신 것 같아요. 운동으로 풀어보는 건 어떨까요?`,
    };
    
    return greetings[mood];
  }
  
  private getExerciseMotivation(category: ExerciseCategory, routineName: string): string {
    const categoryName = CATEGORY_LABELS[category];
    
    const motivations: Record<ExerciseCategory, string> = {
      'PH': `오늘은 실내에서 편안하게 '${routineName}'을 해볼까요? 공기질 걱정 없이 건강하게!`,
      'SO': `맑은 날씨에 딱 맞는 '${routineName}'을 준비했어요. 햇살 아래서 활력을 충전하세요!`,
      'MB': `기분 전환에 좋은 '${routineName}'이에요. 운동하고 나면 기분이 한결 나아질 거예요!`,
      'TF': `오늘 날씨에 맞춘 '${routineName}'을 추천드려요. 무리하지 않는 선에서 건강하게!`,
    };
    
    return motivations[category];
  }
  
  private getMealTip(goal: string): string {
    const tips: Record<string, string> = {
      'diet': '오늘의 식단은 포만감은 높이고 칼로리는 낮추는 데 집중했어요. 천천히 꼭꼭 씹어 드세요!',
      'muscle_gain': '근육 성장을 위해 단백질을 충분히 챙겼어요. 운동 후 30분 내에 단백질을 섭취하면 더 좋아요!',
      'weight_gain': '건강하게 체중을 늘리기 위한 영양 가득 식단이에요. 맛있게 드세요!',
      'weight_management': '균형 잡힌 식단으로 건강한 체중을 유지해요. 규칙적인 식사가 중요해요!',
      'stress_relief': '스트레스 해소에 좋은 영양소를 담았어요. 맛있게 먹는 것도 힐링이에요!',
    };
    
    return tips[goal] || tips['weight_management'];
  }
  
  private getSleepAdvice(duration: number, stress: StressLevel): string {
    if (stress === 'high') {
      return `오늘은 ${duration}시간 정도 푹 주무세요. 스트레스가 높을 때는 충분한 수면이 최고의 보약이에요.`;
    }
    
    return `오늘 권장 수면 시간은 ${duration}시간이에요. 규칙적인 수면 습관이 건강의 기본이에요!`;
  }
  
  private getClosing(mood: MoodEmoji): string {
    const closings: Record<MoodEmoji, string> = {
      '😄': '오늘도 활기찬 하루 보내세요! 화이팅! 💪',
      '🙂': '오늘 하루도 건강하게 보내세요! 😊',
      '😐': '조금씩 움직이다 보면 기분도 좋아질 거예요. 응원할게요!',
      '😣': '무리하지 마시고, 오늘은 자신을 위한 시간을 가져보세요. 🤗',
      '😤': '스트레스는 운동으로 날려버려요! 당신은 잘하고 있어요. 💪',
    };
    
    return closings[mood];
  }
  
  private getTemplateResponse(intent: ChatIntent): string {
    const responses: Record<ChatIntent, string> = {
      'exercise_question': '운동에 대해 궁금하신 점이 있으시군요! 오늘의 운동 계획을 확인해보시고, 더 자세한 내용은 운동 탭에서 확인하실 수 있어요.',
      'meal_question': '식단에 대한 질문이시네요! 오늘의 식단 추천을 확인해보시고, 개인 상황에 맞게 조절해주세요.',
      'sleep_question': '수면에 대해 궁금하시군요! 오늘의 수면 권장 시간을 확인해보세요. 규칙적인 수면 습관이 중요해요.',
      'motivation': '당신은 정말 잘하고 있어요! 꾸준함이 가장 중요해요. 오늘도 조금씩 나아가고 있는 거예요. 💪',
      'general_health': '건강에 대한 궁금증이 있으시군요! 이 앱은 일반적인 건강 관리를 도와드리지만, 구체적인 건강 문제는 전문가와 상담해주세요.',
      'medication_change': '죄송합니다. 약 복용에 대한 변경이나 조언은 드릴 수 없어요. 반드시 담당 의사나 약사와 상담해주세요.',
      'medication_dosage': '죄송합니다. 약 용량에 대한 조언은 드릴 수 없어요. 처방전을 따르시고, 궁금한 점은 담당 의사나 약사에게 문의해주세요.',
      'medication_interaction': '죄송합니다. 약물 상호작용에 대한 판단은 드릴 수 없어요. 반드시 담당 의사나 약사와 상담해주세요.',
      'diagnosis': '죄송합니다. 의료 진단은 드릴 수 없어요. 증상이 있으시면 병원을 방문해주세요.',
      'treatment': '죄송합니다. 치료에 대한 조언은 드릴 수 없어요. 전문 의료진과 상담해주세요.',
    };
    
    return responses[intent];
  }
}

// ============================================
// OnDeviceLLMProvider - Stub for future integration
// ============================================

export class OnDeviceLLMProvider implements LLMProvider {
  // TODO: Integrate with llama.cpp, MLC, or vendor SDK
  // This is a stub that falls back to NoLLMProvider
  
  private fallback = new NoLLMProvider();
  
  async generateCoachText(facts: CoachFacts): Promise<CoachCopy> {
    // TODO: Implement actual on-device LLM call
    // const prompt = this.buildCoachPrompt(facts);
    // const response = await this.callOnDeviceLLM(prompt);
    // const validated = this.validateCoachOutput(response);
    // if (!validated) return this.fallback.generateCoachText(facts);
    // return validated;
    
    return this.fallback.generateCoachText(facts);
  }
  
  async generateDrugExplain(facts: DrugFacts): Promise<DrugExplainCopy> {
    // TODO: Implement actual on-device LLM call with strict validation
    // IMPORTANT: LLM must only explain facts, never give medical advice
    
    return this.fallback.generateDrugExplain(facts);
  }
  
  async generateChatResponse(message: string, intent: ChatIntent): Promise<string> {
    // TODO: Implement actual on-device LLM call with intent validation
    
    return this.fallback.generateChatResponse(message, intent);
  }
  
  // Prompt templates for future implementation
  private buildCoachPrompt(facts: CoachFacts): string {
    return `
당신은 건강 코치입니다. 다음 정보를 바탕으로 따뜻하고 격려하는 메시지를 작성해주세요.

사용자 정보:
- 목표: ${GOAL_LABELS[facts.goal]}
- 오늘 기분: ${facts.todayMood}
- 스트레스: ${facts.todayStress}
- 오늘의 운동: ${facts.exerciseRoutineName}
- 권장 수면: ${facts.sleepDuration}시간

주의사항:
- 의료적 조언을 하지 마세요
- 약 복용에 대해 언급하지 마세요
- 진단이나 치료를 제안하지 마세요
- 한국어로 친근하게 작성해주세요
    `.trim();
  }
}

// ============================================
// Intent Router
// ============================================

const BLOCKED_INTENTS: ChatIntent[] = [
  'medication_change',
  'medication_dosage',
  'medication_interaction',
  'diagnosis',
  'treatment',
];

const BLOCKED_KEYWORDS = [
  '약 끊', '약을 끊', '약 중단', '복용 중단',
  '용량 변경', '용량을 변경', '용량 조절', '용량을 조절',
  '약 바꿔', '약을 바꿔', '약 변경', '약을 변경',
  '같이 먹어도', '함께 복용', '병용',
  '진단', '병명', '무슨 병',
  '치료', '처방', '수술',
];

export function classifyIntent(message: string): ChatIntent {
  const lowerMessage = message.toLowerCase();
  
  // Check for blocked keywords first
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      if (keyword.includes('용량')) return 'medication_dosage';
      if (keyword.includes('끊') || keyword.includes('중단') || keyword.includes('바꿔') || keyword.includes('변경')) return 'medication_change';
      if (keyword.includes('같이') || keyword.includes('함께') || keyword.includes('병용')) return 'medication_interaction';
      if (keyword.includes('진단') || keyword.includes('병명') || keyword.includes('병')) return 'diagnosis';
      if (keyword.includes('치료') || keyword.includes('처방') || keyword.includes('수술')) return 'treatment';
    }
  }
  
  // Check for allowed intents
  if (lowerMessage.includes('운동') || lowerMessage.includes('스트레칭') || lowerMessage.includes('루틴')) {
    return 'exercise_question';
  }
  
  if (lowerMessage.includes('식단') || lowerMessage.includes('음식') || lowerMessage.includes('먹') || lowerMessage.includes('식사')) {
    return 'meal_question';
  }
  
  if (lowerMessage.includes('수면') || lowerMessage.includes('잠') || lowerMessage.includes('자')) {
    return 'sleep_question';
  }
  
  if (lowerMessage.includes('힘들') || lowerMessage.includes('지쳐') || lowerMessage.includes('응원') || lowerMessage.includes('화이팅')) {
    return 'motivation';
  }
  
  return 'general_health';
}

export function isBlockedIntent(intent: ChatIntent): boolean {
  return BLOCKED_INTENTS.includes(intent);
}

// ============================================
// Output Validators
// ============================================

const UNSAFE_PATTERNS = [
  /약.*중단/,
  /복용.*중단/,
  /용량.*변경/,
  /용량.*조절/,
  /약.*바꾸/,
  /처방/,
  /진단/,
  /치료/,
  /수술/,
  /식전|식후.*복용/,
  /공복.*복용/,
  /mg|밀리그램/,
];

export function validateLLMOutput(output: string): boolean {
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(output)) {
      return false;
    }
  }
  return true;
}

// ============================================
// Refusal Templates
// ============================================

export const REFUSAL_TEMPLATES = {
  medication_change: '죄송합니다. 약 복용의 시작, 중단, 변경에 대한 조언은 드릴 수 없어요. 이런 결정은 반드시 담당 의사나 약사와 상담해주세요. 🏥',
  medication_dosage: '죄송합니다. 약 용량에 대한 조언은 드릴 수 없어요. 처방받은 대로 복용하시고, 궁금한 점은 담당 의사나 약사에게 문의해주세요. 💊',
  medication_interaction: '죄송합니다. 약물 상호작용은 전문적인 판단이 필요해요. 여러 약을 함께 복용하실 때는 반드시 약사에게 확인해주세요. 👨‍⚕️',
  diagnosis: '죄송합니다. 의료 진단은 드릴 수 없어요. 증상이 걱정되시면 병원을 방문해주세요. 건강이 최우선이에요! 🏥',
  treatment: '죄송합니다. 치료에 대한 조언은 전문 의료진만 드릴 수 있어요. 병원에서 상담받아보시는 것을 권해드려요. 👩‍⚕️',
};

// ============================================
// Chat Handler
// ============================================

export async function handleChatMessage(
  message: string,
  provider: LLMProvider
): Promise<ChatMessage> {
  const intent = classifyIntent(message);
  
  let response: string;
  let blocked = false;
  
  if (isBlockedIntent(intent)) {
    response = REFUSAL_TEMPLATES[intent as keyof typeof REFUSAL_TEMPLATES];
    blocked = true;
  } else {
    response = await provider.generateChatResponse(message, intent);
    
    // Validate output
    if (!validateLLMOutput(response)) {
      response = await new NoLLMProvider().generateChatResponse(message, intent);
    }
  }
  
  return {
    id: generateId(),
    role: 'assistant',
    content: response,
    intent,
    blocked,
    createdAt: new Date().toISOString(),
  };
}

// ============================================
// Factory
// ============================================

export function createLLMProvider(enableLLM: boolean): LLMProvider {
  if (enableLLM) {
    return new OnDeviceLLMProvider();
  }
  return new NoLLMProvider();
}
