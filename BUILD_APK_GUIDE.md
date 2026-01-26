# 📱 APK 빌드 가이드 (Expo Go 없이 직접 설치)

## 🎯 목표
Expo Go 앱 없이 **직접 스마트폰에 설치할 수 있는 APK 파일** 생성

---

## 🚀 빠른 방법: EAS Build (클라우드 빌드)

### 1단계: EAS CLI 설치
```bash
npm install -g eas-cli
```

### 2단계: EAS 로그인
```bash
eas login
```
- Expo 계정으로 로그인 (이메일/비밀번호)

### 3단계: APK 빌드 (개발용)
```bash
cd /home/user/webapp
eas build --platform android --profile preview
```

**빌드 시간:** 약 10-20분  
**결과:** 다운로드 가능한 APK 링크 제공  
**설치:** APK 파일을 스마트폰에 다운로드해서 직접 설치

---

## 💻 로컬 빌드 방법 (Android Studio 필요)

### 필요 사항
- ✅ Android Studio 설치
- ✅ Java JDK 17
- ✅ Android SDK

### 빌드 명령어
```bash
cd /home/user/webapp/android
./gradlew assembleDebug
```

**APK 위치:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 가장 쉬운 방법: EAS Build 추천!

### 장점
✅ 로컬 환경 설정 불필요  
✅ 클라우드에서 자동 빌드  
✅ 다운로드 링크로 바로 설치  
✅ 무료 플랜 사용 가능

### EAS Build 명령어 요약
```bash
# 1. EAS CLI 설치
npm install -g eas-cli

# 2. 로그인
eas login

# 3. 프로젝트 설정 (처음만)
cd /home/user/webapp
eas build:configure

# 4. APK 빌드
eas build --platform android --profile preview

# 5. 빌드 상태 확인
eas build:list
```

---

## 🔗 설치 방법

### APK 파일을 받은 후:

1. **스마트폰에서 APK 다운로드**
2. **파일 관리자에서 APK 파일 탭**
3. **"알 수 없는 출처" 설치 허용** (설정에서)
4. **설치 진행**
5. **앱 실행!** 🎉

---

## ⚡ 현재 상태

✅ **expo-dev-client**: 설치 완료  
✅ **네이티브 프로젝트**: 생성 완료 (`android/` 폴더)  
✅ **빌드 준비**: 완료

---

## 🎯 다음 단계

### Option A: EAS Build (추천!)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```
→ 10-20분 후 APK 다운로드 링크 받음!

### Option B: 로컬 빌드
```bash
cd android
./gradlew assembleDebug
```
→ APK 파일: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 💡 팁

- **개발용 빌드**: `--profile preview` (빠름, 디버깅 가능)
- **배포용 빌드**: `--profile production` (느림, 최적화됨)
- **iOS 빌드**: `eas build --platform ios` (Mac + Apple 개발자 계정 필요)

---

## 🐛 문제 해결

### "Build failed" 에러
```bash
# 클린 빌드 시도
eas build --platform android --profile preview --clear-cache
```

### 로컬 빌드 실패
```bash
# 네이티브 프로젝트 재생성
npx expo prebuild --platform android --clean
```

---

## 📞 도움이 필요하면

1. EAS Build 로그 확인: `eas build:list`
2. Expo 공식 문서: https://docs.expo.dev/build/setup/
3. 로컬 빌드 가이드: https://docs.expo.dev/guides/local-app-development/

---

**추천 방법:** EAS Build가 가장 쉽고 빠릅니다! 🚀
