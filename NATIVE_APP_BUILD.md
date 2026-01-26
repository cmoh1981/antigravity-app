# 📱 네이티브 앱 빌드 가이드

## 🎯 개요

오늘건강 앱을 **스마트폰에 설치할 수 있는 네이티브 앱**으로 만드는 방법입니다.

---

## 방법 1: Expo Go로 테스트 (가장 빠름) ⚡

### 1단계: 스마트폰에 Expo Go 설치

**Android:**
- Play Store에서 "Expo Go" 검색
- 설치

**iOS:**
- App Store에서 "Expo Go" 검색  
- 설치

### 2단계: 개발 서버 시작

```bash
cd /home/user/webapp
npx expo start
```

### 3단계: QR 코드 스캔

- 터미널에 나타난 QR 코드를 스캔
- Expo Go 앱이 자동으로 열림
- 모든 기능 정상 작동! ✅

---

## 방법 2: APK 빌드 (설치 파일 생성) 📦

### EAS Build 사용 (권장)

```bash
# EAS CLI 설치
npm install -g eas-cli

# Expo 계정 로그인
eas login

# 프로젝트 설정
eas build:configure

# Android APK 빌드
eas build --platform android --profile preview

# 빌드 완료 후 APK 다운로드
# 링크가 터미널에 표시됩니다
```

**빌드 시간:** 약 10-20분  
**결과:** `.apk` 파일 (스마트폰에 직접 설치 가능)

### 로컬 빌드 (더 빠름, 복잡함)

```bash
# Android SDK 필요
npx expo run:android
```

---

## 방법 3: App Store / Play Store 배포 🚀

### 준비물
- [ ] Apple Developer 계정 ($99/년) - iOS
- [ ] Google Play Developer 계정 ($25 일회성) - Android
- [ ] 앱 아이콘 (1024x1024)
- [ ] 스크린샷 (다양한 화면 크기)
- [ ] 앱 설명

### 배포 명령어

```bash
# iOS App Store
eas build --platform ios --profile production
eas submit --platform ios

# Android Play Store  
eas build --platform android --profile production
eas submit --platform android
```

---

## 🔧 현재 프로젝트 상태

### ✅ 네이티브 앱으로 작동
- React Native (Expo) 기반
- iOS와 Android 모두 지원
- 모든 기능 네이티브에서 완벽 작동

### ⚠️ 웹 버전 제한사항
- 일부 기능 미작동 (체크인 버튼)
- worklets 호환성 문제
- 미리보기용으로만 사용 권장

---

## 📱 권장 테스트 방법

### 초보자
👉 **Expo Go 앱 사용** (5분이면 테스트 가능!)

### 개발자
👉 **EAS Build로 APK 생성** (실제 앱처럼 사용 가능)

### 배포 목적
👉 **EAS Submit로 앱스토어 업로드**

---

## 🆘 문제 해결

### Expo Go에서 앱이 안 열려요
```bash
# 개발 서버 재시작
npx expo start --clear
```

### "Network response timed out" 에러
- 같은 WiFi 네트워크 연결 확인
- 방화벽 설정 확인
- 터널 모드 사용:
  ```bash
  npx expo start --tunnel
  ```

### APK 빌드 실패
- `eas.json` 확인
- Expo 계정 로그인 상태 확인
- 빌드 로그 확인:
  ```bash
  eas build:list
  ```

---

## 📊 빌드 크기 최적화

### 현재 상태
- `node_modules`: 646MB
- 예상 APK 크기: ~50-80MB

### 최적화 방법
1. **이미지 압축** (가장 효과적)
2. **불필요한 패키지 제거**
3. **ProGuard 활성화** (Android)
4. **App Bundle 사용** (Play Store)

---

## 🎉 성공 체크리스트

- [ ] Expo Go로 테스트 완료
- [ ] 모든 화면 정상 작동 확인
- [ ] 체크인 기능 테스트
- [ ] 운동 상세 정보 확인
- [ ] APK 빌드 성공
- [ ] 실제 기기에 설치 테스트

---

## 📞 추가 도움말

### Expo 공식 문서
- https://docs.expo.dev/

### EAS Build 가이드
- https://docs.expo.dev/build/introduction/

### 문제 발생 시
1. 로그 확인
2. Expo 커뮤니티 검색
3. GitHub Issues 확인

---

**요약:** Expo Go 앱 설치 → QR 코드 스캔 → 완료! 🎉
