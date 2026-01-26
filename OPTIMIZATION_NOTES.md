# 최적화 노트

## 🚀 완료된 최적화

### 1. 화면 높이 최적화
- 모든 탭의 패딩 감소 (120px → 90px)
- 헤더 크기 축소 (text-2xl → text-xl)
- 카드 여백 감소 (mb-6 → mb-3, p-4 → p-3)
- 버튼 크기 최적화

### 2. 레이아웃 개선
- 좌우 패딩 감소 (px-6 → px-4)
- 상단 패딩 최소화 (pt-4 → pt-2)
- 카드 border-radius 축소 (16px → 12px)

## ⚠️ 최적화가 필요한 부분

### 1. 이미지 크기 (높은 우선순위)
```
icon.png: 5.3MB ❌ → 목표: <100KB
android-icon-foreground.png: 5.3MB ❌ → 목표: <500KB
splash-icon.png: 5.3MB ❌ → 목표: <1MB
```

**해결 방법:**
- ImageMagick로 압축
- WebP 형식 사용
- 적절한 해상도로 리사이즈

### 2. node_modules 크기
```
현재: 646MB
```

**불필요한 패키지:**
- expo-audio (사용 안 함)
- expo-video (사용 안 함)
- expo-notifications (사용 안 함)
- mysql2 (서버에서만 필요)
- express (서버에서만 필요)

### 3. Bundle 크기 최적화
- Tree shaking 활성화
- Code splitting 고려
- 동적 import 사용

## 📱 네이티브 앱 빌드

### EAS Build 설정
`eas.json` 파일 생성 완료

### 빌드 명령어
```bash
# Android APK
npx eas build --platform android --profile preview

# 로컬 빌드 (더 빠름)
npx expo run:android
```

## 🐛 알려진 문제

### Worklets on Web
**문제:** `react-native-worklets`가 웹에서 작동하지 않음
**영향:** 체크인 버튼 네비게이션 실패
**해결:** 
- ✅ Babel config 수정
- ✅ Worklets stub 생성
- ✅ Metro resolver 커스텀
- ⚠️ 여전히 import.meta 에러 발생

**최종 해결책:** 
네이티브 앱 사용 권장 (웹은 미리보기용)

## 🎯 다음 단계

1. [ ] 이미지 압축 및 최적화
2. [ ] 불필요한 패키지 제거
3. [ ] Android APK 빌드
4. [ ] 실제 기기에서 테스트
5. [ ] 성능 프로파일링

## 📊 목표 지표

- [ ] 앱 초기 로딩: < 3초
- [ ] 번들 크기: < 50MB
- [ ] 메모리 사용: < 200MB
- [ ] 부드러운 60fps 애니메이션
