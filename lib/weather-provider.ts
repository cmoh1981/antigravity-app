// ============================================
// Weather Provider
// Interface + Mock implementation with caching
// ============================================

import { WeatherSnapshot, PerceivedWeatherResult } from '@/types';
import { useAppStore } from '@/store';

// ============================================
// Weather Provider Interface
// ============================================

export interface WeatherProvider {
  getWeather(regionCode: string): Promise<WeatherSnapshot>;
}

// ============================================
// Mock Weather Provider
// Deterministic random based on date and region
// ============================================

export class MockWeatherProvider implements WeatherProvider {
  private readonly TTL_MINUTES = 30;
  
  async getWeather(regionCode: string): Promise<WeatherSnapshot> {
    // Check cache first
    const cached = useAppStore.getState().getWeatherCache(regionCode);
    if (cached) {
      return cached;
    }
    
    // Generate deterministic weather based on date and region
    const weather = this.generateWeather(regionCode);
    
    // Cache the result
    useAppStore.getState().setWeatherCache(regionCode, weather);
    
    return weather;
  }
  
  private generateWeather(regionCode: string): WeatherSnapshot {
    const now = new Date();
    const seed = this.hashCode(`${regionCode}-${now.toDateString()}`);
    
    // Deterministic random based on seed
    const random = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };
    
    // Temperature: 5-35°C based on month
    const month = now.getMonth();
    const baseTemp = this.getBaseTemperature(month);
    const temperature = Math.round(baseTemp + (random(1) * 10 - 5));
    
    // Humidity: 30-90%
    const humidity = Math.round(30 + random(2) * 60);
    
    // Condition based on random
    const conditionRand = random(3);
    let condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
    if (conditionRand < 0.4) {
      condition = 'sunny';
    } else if (conditionRand < 0.7) {
      condition = 'cloudy';
    } else if (conditionRand < 0.9) {
      condition = 'rainy';
    } else {
      condition = temperature < 5 ? 'snowy' : 'rainy';
    }
    
    // Air quality index: 0-200
    const airQualityIndex = Math.round(random(4) * 150);
    
    const expiresAt = new Date(now.getTime() + this.TTL_MINUTES * 60 * 1000);
    
    return {
      regionCode,
      temperature,
      humidity,
      condition,
      airQualityIndex,
      fetchedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  }
  
  private getBaseTemperature(month: number): number {
    // Korean seasonal temperatures (approximate)
    const temps = [0, 2, 8, 14, 19, 24, 27, 28, 23, 16, 9, 3];
    return temps[month];
  }
  
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// ============================================
// Backend Weather Provider (Placeholder)
// ============================================

export class BackendWeatherProvider implements WeatherProvider {
  private readonly baseUrl: string;
  private readonly fallback = new MockWeatherProvider();
  
  constructor(baseUrl: string = '/api/weather') {
    this.baseUrl = baseUrl;
  }
  
  async getWeather(regionCode: string): Promise<WeatherSnapshot> {
    // Check cache first
    const cached = useAppStore.getState().getWeatherCache(regionCode);
    if (cached) {
      return cached;
    }
    
    try {
      // TODO: Implement actual API call
      // const response = await fetch(`${this.baseUrl}?region=${regionCode}`);
      // if (!response.ok) throw new Error('Weather API error');
      // const data = await response.json();
      // useAppStore.getState().setWeatherCache(regionCode, data);
      // return data;
      
      // For now, fall back to mock
      return this.fallback.getWeather(regionCode);
    } catch (error) {
      console.warn('Weather API failed, using fallback:', error);
      return this.fallback.getWeather(regionCode);
    }
  }
}

// ============================================
// Perceived Weather Classifier
// Camera-based weather classification (stub)
// ============================================

export interface PerceivedWeatherClassifier {
  classify(imageUri: string): Promise<PerceivedWeatherResult>;
}

export class MockPerceivedWeatherClassifier implements PerceivedWeatherClassifier {
  async classify(imageUri: string): Promise<PerceivedWeatherResult> {
    // TODO: Implement actual image analysis
    // This could use brightness histogram or ML model
    
    // For now, return neutral probabilities
    return {
      sunnyProb: 0.33,
      cloudyProb: 0.34,
      rainyProb: 0.33,
    };
  }
}

export class BrightnessBasedClassifier implements PerceivedWeatherClassifier {
  async classify(imageUri: string): Promise<PerceivedWeatherResult> {
    // TODO: Implement brightness histogram analysis
    // 1. Load image
    // 2. Calculate average brightness
    // 3. Classify based on brightness thresholds
    
    // Placeholder implementation
    // In a real implementation, we would:
    // - Use expo-image-manipulator to get pixel data
    // - Calculate histogram
    // - Use thresholds to determine weather
    
    return {
      sunnyProb: 0.5,
      cloudyProb: 0.3,
      rainyProb: 0.2,
    };
  }
}

// ============================================
// Factory Functions
// ============================================

let weatherProviderInstance: WeatherProvider | null = null;
let classifierInstance: PerceivedWeatherClassifier | null = null;

export function getWeatherProvider(): WeatherProvider {
  if (!weatherProviderInstance) {
    // Use mock provider for MVP
    // Switch to BackendWeatherProvider when backend is ready
    weatherProviderInstance = new MockWeatherProvider();
  }
  return weatherProviderInstance;
}

export function getPerceivedWeatherClassifier(): PerceivedWeatherClassifier {
  if (!classifierInstance) {
    classifierInstance = new MockPerceivedWeatherClassifier();
  }
  return classifierInstance;
}

// ============================================
// Korean Region Codes
// ============================================

export interface Region {
  code: string;
  name: string;
  parent?: string;
}

export const KOREAN_REGIONS: Region[] = [
  // 서울
  { code: '11010', name: '종로구', parent: '서울' },
  { code: '11020', name: '중구', parent: '서울' },
  { code: '11030', name: '용산구', parent: '서울' },
  { code: '11040', name: '성동구', parent: '서울' },
  { code: '11050', name: '광진구', parent: '서울' },
  { code: '11060', name: '동대문구', parent: '서울' },
  { code: '11070', name: '중랑구', parent: '서울' },
  { code: '11080', name: '성북구', parent: '서울' },
  { code: '11090', name: '강북구', parent: '서울' },
  { code: '11100', name: '도봉구', parent: '서울' },
  { code: '11110', name: '노원구', parent: '서울' },
  { code: '11120', name: '은평구', parent: '서울' },
  { code: '11130', name: '서대문구', parent: '서울' },
  { code: '11140', name: '마포구', parent: '서울' },
  { code: '11150', name: '양천구', parent: '서울' },
  { code: '11160', name: '강서구', parent: '서울' },
  { code: '11170', name: '구로구', parent: '서울' },
  { code: '11180', name: '금천구', parent: '서울' },
  { code: '11190', name: '영등포구', parent: '서울' },
  { code: '11200', name: '동작구', parent: '서울' },
  { code: '11210', name: '관악구', parent: '서울' },
  { code: '11220', name: '서초구', parent: '서울' },
  { code: '11230', name: '강남구', parent: '서울' },
  { code: '11240', name: '송파구', parent: '서울' },
  { code: '11250', name: '강동구', parent: '서울' },
  
  // 경기
  { code: '41010', name: '수원시', parent: '경기' },
  { code: '41020', name: '성남시', parent: '경기' },
  { code: '41030', name: '고양시', parent: '경기' },
  { code: '41040', name: '용인시', parent: '경기' },
  { code: '41050', name: '부천시', parent: '경기' },
  { code: '41060', name: '안산시', parent: '경기' },
  { code: '41070', name: '안양시', parent: '경기' },
  { code: '41080', name: '남양주시', parent: '경기' },
  { code: '41090', name: '화성시', parent: '경기' },
  { code: '41100', name: '평택시', parent: '경기' },
  
  // 부산
  { code: '21010', name: '중구', parent: '부산' },
  { code: '21020', name: '서구', parent: '부산' },
  { code: '21030', name: '동구', parent: '부산' },
  { code: '21040', name: '영도구', parent: '부산' },
  { code: '21050', name: '부산진구', parent: '부산' },
  { code: '21060', name: '동래구', parent: '부산' },
  { code: '21070', name: '남구', parent: '부산' },
  { code: '21080', name: '북구', parent: '부산' },
  { code: '21090', name: '해운대구', parent: '부산' },
  { code: '21100', name: '사하구', parent: '부산' },
  
  // 대구
  { code: '22010', name: '중구', parent: '대구' },
  { code: '22020', name: '동구', parent: '대구' },
  { code: '22030', name: '서구', parent: '대구' },
  { code: '22040', name: '남구', parent: '대구' },
  { code: '22050', name: '북구', parent: '대구' },
  { code: '22060', name: '수성구', parent: '대구' },
  { code: '22070', name: '달서구', parent: '대구' },
  
  // 인천
  { code: '23010', name: '중구', parent: '인천' },
  { code: '23020', name: '동구', parent: '인천' },
  { code: '23030', name: '미추홀구', parent: '인천' },
  { code: '23040', name: '연수구', parent: '인천' },
  { code: '23050', name: '남동구', parent: '인천' },
  { code: '23060', name: '부평구', parent: '인천' },
  { code: '23070', name: '계양구', parent: '인천' },
  { code: '23080', name: '서구', parent: '인천' },
  
  // 광주
  { code: '24010', name: '동구', parent: '광주' },
  { code: '24020', name: '서구', parent: '광주' },
  { code: '24030', name: '남구', parent: '광주' },
  { code: '24040', name: '북구', parent: '광주' },
  { code: '24050', name: '광산구', parent: '광주' },
  
  // 대전
  { code: '25010', name: '동구', parent: '대전' },
  { code: '25020', name: '중구', parent: '대전' },
  { code: '25030', name: '서구', parent: '대전' },
  { code: '25040', name: '유성구', parent: '대전' },
  { code: '25050', name: '대덕구', parent: '대전' },
  
  // 울산
  { code: '26010', name: '중구', parent: '울산' },
  { code: '26020', name: '남구', parent: '울산' },
  { code: '26030', name: '동구', parent: '울산' },
  { code: '26040', name: '북구', parent: '울산' },
  { code: '26050', name: '울주군', parent: '울산' },
  
  // 세종
  { code: '29010', name: '세종시', parent: '세종' },
  
  // 제주
  { code: '39010', name: '제주시', parent: '제주' },
  { code: '39020', name: '서귀포시', parent: '제주' },
];

export function searchRegions(query: string): Region[] {
  const lowerQuery = query.toLowerCase();
  return KOREAN_REGIONS.filter(
    region => 
      region.name.toLowerCase().includes(lowerQuery) ||
      (region.parent && region.parent.toLowerCase().includes(lowerQuery))
  );
}

export function getRegionByCode(code: string): Region | undefined {
  return KOREAN_REGIONS.find(region => region.code === code);
}
