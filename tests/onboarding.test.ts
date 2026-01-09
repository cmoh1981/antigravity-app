// Onboarding Flow Tests
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';

// Define onboarding steps
const ONBOARDING_STEPS = [
  { id: 'welcome', title: '환영', required: true },
  { id: 'goal', title: '목표 선택', required: true },
  { id: 'body', title: '신체 정보', required: true },
  { id: 'diseases', title: '건강 상태', required: false },
  { id: 'sleep', title: '수면 프로필', required: false },
  { id: 'medication', title: '복용 약물', required: false },
  { id: 'premium', title: '프리미엄 안내', required: false },
  { id: 'complete', title: '완료', required: true },
] as const;

type OnboardingStepId = typeof ONBOARDING_STEPS[number]['id'];

interface OnboardingProgress {
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  startedAt: string;
  completedAt: string | null;
}

// Helper function to create initial progress
function createInitialProgress(): OnboardingProgress {
  return {
    currentStep: 'welcome',
    completedSteps: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

// Helper function to complete a step
function completeStep(
  progress: OnboardingProgress,
  stepId: OnboardingStepId
): OnboardingProgress {
  if (progress.completedSteps.includes(stepId)) {
    return progress;
  }
  
  const newCompletedSteps = [...progress.completedSteps, stepId];
  const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === stepId);
  const nextStep = ONBOARDING_STEPS[currentIndex + 1];
  
  return {
    ...progress,
    completedSteps: newCompletedSteps,
    currentStep: nextStep?.id || 'complete',
    completedAt: stepId === 'complete' ? new Date().toISOString() : null,
  };
}

// Helper function to check if onboarding is complete
function isOnboardingComplete(progress: OnboardingProgress): boolean {
  const requiredSteps = ONBOARDING_STEPS.filter(s => s.required).map(s => s.id);
  return requiredSteps.every(stepId => progress.completedSteps.includes(stepId));
}

// Helper function to get progress percentage
function getProgressPercentage(progress: OnboardingProgress): number {
  const totalSteps = ONBOARDING_STEPS.length;
  const completedCount = progress.completedSteps.length;
  return Math.round((completedCount / totalSteps) * 100);
}

// Helper function to get current step index (1-based)
function getCurrentStepIndex(progress: OnboardingProgress): number {
  const index = ONBOARDING_STEPS.findIndex(s => s.id === progress.currentStep);
  return index + 1;
}

describe('Onboarding Steps Configuration', () => {
  it('should have 8 onboarding steps', () => {
    expect(ONBOARDING_STEPS.length).toBe(8);
  });

  it('should have required steps: welcome, goal, body, complete', () => {
    const requiredSteps = ONBOARDING_STEPS.filter(s => s.required).map(s => s.id);
    expect(requiredSteps).toContain('welcome');
    expect(requiredSteps).toContain('goal');
    expect(requiredSteps).toContain('body');
    expect(requiredSteps).toContain('complete');
  });

  it('should have optional steps: diseases, sleep, medication, premium', () => {
    const optionalSteps = ONBOARDING_STEPS.filter(s => !s.required).map(s => s.id);
    expect(optionalSteps).toContain('diseases');
    expect(optionalSteps).toContain('sleep');
    expect(optionalSteps).toContain('medication');
    expect(optionalSteps).toContain('premium');
  });
});

describe('Onboarding Progress Tracking', () => {
  let progress: OnboardingProgress;

  beforeEach(() => {
    progress = createInitialProgress();
  });

  it('should start at welcome step with no completed steps', () => {
    expect(progress.currentStep).toBe('welcome');
    expect(progress.completedSteps).toHaveLength(0);
    expect(progress.completedAt).toBeNull();
  });

  it('should track step completion', () => {
    progress = completeStep(progress, 'welcome');
    expect(progress.completedSteps).toContain('welcome');
    expect(progress.currentStep).toBe('goal');
  });

  it('should advance through all steps in order', () => {
    const stepOrder: OnboardingStepId[] = ['welcome', 'goal', 'body', 'diseases', 'sleep', 'medication', 'premium', 'complete'];
    
    for (const stepId of stepOrder) {
      progress = completeStep(progress, stepId);
      expect(progress.completedSteps).toContain(stepId);
    }
    
    expect(progress.completedSteps).toHaveLength(8);
  });

  it('should not duplicate completed steps', () => {
    progress = completeStep(progress, 'welcome');
    progress = completeStep(progress, 'welcome'); // Try to complete again
    
    const welcomeCount = progress.completedSteps.filter(s => s === 'welcome').length;
    expect(welcomeCount).toBe(1);
  });

  it('should set completedAt when final step is completed', () => {
    const stepOrder: OnboardingStepId[] = ['welcome', 'goal', 'body', 'diseases', 'sleep', 'medication', 'premium', 'complete'];
    
    for (const stepId of stepOrder) {
      progress = completeStep(progress, stepId);
    }
    
    expect(progress.completedAt).not.toBeNull();
  });
});

describe('Onboarding Completion Check', () => {
  let progress: OnboardingProgress;

  beforeEach(() => {
    progress = createInitialProgress();
  });

  it('should return false when no steps are completed', () => {
    expect(isOnboardingComplete(progress)).toBe(false);
  });

  it('should return false when only some required steps are completed', () => {
    progress = completeStep(progress, 'welcome');
    progress = completeStep(progress, 'goal');
    expect(isOnboardingComplete(progress)).toBe(false);
  });

  it('should return true when all required steps are completed', () => {
    // Complete all required steps
    progress = completeStep(progress, 'welcome');
    progress = completeStep(progress, 'goal');
    progress = completeStep(progress, 'body');
    progress = completeStep(progress, 'complete');
    
    expect(isOnboardingComplete(progress)).toBe(true);
  });

  it('should return true even if optional steps are skipped', () => {
    // Complete only required steps
    progress.completedSteps = ['welcome', 'goal', 'body', 'complete'];
    expect(isOnboardingComplete(progress)).toBe(true);
  });
});

describe('Onboarding Progress Percentage', () => {
  let progress: OnboardingProgress;

  beforeEach(() => {
    progress = createInitialProgress();
  });

  it('should return 0% when no steps are completed', () => {
    expect(getProgressPercentage(progress)).toBe(0);
  });

  it('should return correct percentage for partial completion', () => {
    progress = completeStep(progress, 'welcome'); // 1/8 = 12.5% -> 13%
    expect(getProgressPercentage(progress)).toBe(13);
    
    progress = completeStep(progress, 'goal'); // 2/8 = 25%
    expect(getProgressPercentage(progress)).toBe(25);
  });

  it('should return 100% when all steps are completed', () => {
    const stepOrder: OnboardingStepId[] = ['welcome', 'goal', 'body', 'diseases', 'sleep', 'medication', 'premium', 'complete'];
    
    for (const stepId of stepOrder) {
      progress = completeStep(progress, stepId);
    }
    
    expect(getProgressPercentage(progress)).toBe(100);
  });
});

describe('Current Step Index', () => {
  let progress: OnboardingProgress;

  beforeEach(() => {
    progress = createInitialProgress();
  });

  it('should return 1 for welcome step', () => {
    expect(getCurrentStepIndex(progress)).toBe(1);
  });

  it('should return correct index after advancing', () => {
    progress = completeStep(progress, 'welcome');
    expect(getCurrentStepIndex(progress)).toBe(2); // goal

    progress = completeStep(progress, 'goal');
    expect(getCurrentStepIndex(progress)).toBe(3); // body
  });
});
