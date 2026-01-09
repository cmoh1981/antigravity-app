// ============================================
// Antigravity App - Zustand Store
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  DailyCheckIn,
  PlanOfDay,
  MealLog,
  MedicationEntry,
  ChatMessage,
  AppSettings,
  WeatherSnapshot,
  UserGoal,
  Disease,
  InBodyMetrics,
  SleepProfile,
} from '@/types';

// ============================================
// Store Interface
// ============================================

interface AppStore {
  // State
  isOnboarded: boolean;
  userProfile: UserProfile | null;
  todayCheckIn: DailyCheckIn | null;
  todayPlan: PlanOfDay | null;
  mealLogs: MealLog[];
  medications: MedicationEntry[];
  chatHistory: ChatMessage[];
  settings: AppSettings;
  weatherCache: Record<string, WeatherSnapshot>;

  // Onboarding Actions
  setOnboarded: (value: boolean) => void;
  
  // Profile Actions
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateGoal: (goal: UserGoal) => void;
  updateInBody: (inBody: InBodyMetrics) => void;
  updateDiseases: (diseases: Disease[]) => void;
  updateSleepProfile: (sleepProfile: SleepProfile) => void;
  
  // Check-in Actions
  setTodayCheckIn: (checkIn: DailyCheckIn) => void;
  clearTodayCheckIn: () => void;
  
  // Plan Actions
  setTodayPlan: (plan: PlanOfDay) => void;
  invalidateTodayPlan: () => void;
  
  // Meal Log Actions
  addMealLog: (log: MealLog) => void;
  updateMealLog: (id: string, updates: Partial<MealLog>) => void;
  deleteMealLog: (id: string) => void;
  getMealLogsForDate: (date: string) => MealLog[];
  
  // Medication Actions
  addMedication: (med: MedicationEntry) => void;
  updateMedication: (id: string, updates: Partial<MedicationEntry>) => void;
  deleteMedication: (id: string) => void;
  
  // Chat Actions
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  
  // Settings Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleLLMCoach: () => void;
  
  // Weather Cache Actions
  setWeatherCache: (regionCode: string, weather: WeatherSnapshot) => void;
  getWeatherCache: (regionCode: string) => WeatherSnapshot | null;
  clearExpiredWeatherCache: () => void;
  
  // Reset
  resetStore: () => void;
}

// ============================================
// Default Values
// ============================================

const defaultSettings: AppSettings = {
  enableLLMCoach: false,
  theme: 'system',
  notifications: true,
  language: 'ko',
};

const initialState = {
  isOnboarded: false,
  userProfile: null,
  todayCheckIn: null,
  todayPlan: null,
  mealLogs: [],
  medications: [],
  chatHistory: [],
  settings: defaultSettings,
  weatherCache: {},
};

// ============================================
// Store Implementation
// ============================================

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      ...initialState,

      // Onboarding Actions
      setOnboarded: (value) => set({ isOnboarded: value }),

      // Profile Actions
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      updateUserProfile: (updates) => set((state) => ({
        userProfile: state.userProfile
          ? { ...state.userProfile, ...updates, updatedAt: new Date().toISOString() }
          : null,
      })),
      
      updateGoal: (goal) => set((state) => ({
        userProfile: state.userProfile
          ? { ...state.userProfile, goal, updatedAt: new Date().toISOString() }
          : null,
      })),
      
      updateInBody: (inBody) => set((state) => ({
        userProfile: state.userProfile
          ? { ...state.userProfile, inBody, updatedAt: new Date().toISOString() }
          : null,
      })),
      
      updateDiseases: (diseases) => set((state) => ({
        userProfile: state.userProfile
          ? { ...state.userProfile, diseases, updatedAt: new Date().toISOString() }
          : null,
      })),
      
      updateSleepProfile: (sleepProfile) => set((state) => ({
        userProfile: state.userProfile
          ? { ...state.userProfile, sleepProfile, updatedAt: new Date().toISOString() }
          : null,
      })),

      // Check-in Actions
      setTodayCheckIn: (checkIn) => set({ todayCheckIn: checkIn }),
      clearTodayCheckIn: () => set({ todayCheckIn: null }),

      // Plan Actions
      setTodayPlan: (plan) => set({ todayPlan: plan }),
      
      invalidateTodayPlan: () => set((state) => ({
        todayPlan: state.todayPlan
          ? { ...state.todayPlan, invalidatedAt: new Date().toISOString() }
          : null,
      })),

      // Meal Log Actions
      addMealLog: (log) => set((state) => ({
        mealLogs: [...state.mealLogs, log],
      })),
      
      updateMealLog: (id, updates) => set((state) => ({
        mealLogs: state.mealLogs.map((log) =>
          log.id === id ? { ...log, ...updates } : log
        ),
      })),
      
      deleteMealLog: (id) => set((state) => ({
        mealLogs: state.mealLogs.filter((log) => log.id !== id),
      })),
      
      getMealLogsForDate: (date) => {
        return get().mealLogs.filter((log) => log.date === date);
      },

      // Medication Actions
      addMedication: (med) => set((state) => ({
        medications: [...state.medications, med],
      })),
      
      updateMedication: (id, updates) => set((state) => ({
        medications: state.medications.map((med) =>
          med.id === id ? { ...med, ...updates } : med
        ),
      })),
      
      deleteMedication: (id) => set((state) => ({
        medications: state.medications.filter((med) => med.id !== id),
      })),

      // Chat Actions
      addChatMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, message],
      })),
      
      clearChatHistory: () => set({ chatHistory: [] }),

      // Settings Actions
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),
      
      toggleLLMCoach: () => set((state) => ({
        settings: { ...state.settings, enableLLMCoach: !state.settings.enableLLMCoach },
      })),

      // Weather Cache Actions
      setWeatherCache: (regionCode, weather) => set((state) => ({
        weatherCache: { ...state.weatherCache, [regionCode]: weather },
      })),
      
      getWeatherCache: (regionCode) => {
        const cached = get().weatherCache[regionCode];
        if (!cached) return null;
        
        // Check if expired
        if (new Date(cached.expiresAt) < new Date()) {
          return null;
        }
        return cached;
      },
      
      clearExpiredWeatherCache: () => set((state) => {
        const now = new Date();
        const validCache: Record<string, WeatherSnapshot> = {};
        
        Object.entries(state.weatherCache).forEach(([key, value]) => {
          if (new Date(value.expiresAt) > now) {
            validCache[key] = value;
          }
        });
        
        return { weatherCache: validCache };
      }),

      // Reset
      resetStore: () => set(initialState),
    }),
    {
      name: 'antigravity-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        userProfile: state.userProfile,
        todayCheckIn: state.todayCheckIn,
        todayPlan: state.todayPlan,
        mealLogs: state.mealLogs,
        medications: state.medications,
        settings: state.settings,
        // Note: weatherCache and chatHistory are not persisted
      }),
    }
  )
);

// ============================================
// Selector Hooks (for stable references)
// ============================================

export const useIsOnboarded = () => useAppStore((state) => state.isOnboarded);
export const useUserProfile = () => useAppStore((state) => state.userProfile);
export const useTodayCheckIn = () => useAppStore((state) => state.todayCheckIn);
export const useTodayPlan = () => useAppStore((state) => state.todayPlan);
export const useMealLogs = () => useAppStore((state) => state.mealLogs);
export const useMedications = () => useAppStore((state) => state.medications);
export const useSettings = () => useAppStore((state) => state.settings);
export const useChatHistory = () => useAppStore((state) => state.chatHistory);

// ============================================
// Utility Functions
// ============================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayDate();
}
