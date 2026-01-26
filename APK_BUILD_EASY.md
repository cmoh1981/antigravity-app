# 📱 APK 빌드 - 가장 쉬운 방법

## 🎯 로컬에서 빌드하기는 복잡합니다!

로컬 빌드에는 다음이 필요합니다:
- ❌ Android SDK 설치 (몇 GB)
- ❌ Java 17 설정
- ❌ Android Studio 설정
- ❌ 빌드 시간 30분+

---

## ✨ **추천: EAS Build (클라우드 빌드)**

### 장점:
✅ **로컬 설정 불필요** - 클라우드에서 빌드  
✅ **무료 플랜 사용 가능** - Expo 계정만 있으면 OK  
✅ **10-20분 완료** - 자동으로 빌드  
✅ **APK 다운로드 링크** - 바로 설치 가능

---

## 🚀 EAS Build 사용 방법

### 1단계: Expo 계정 만들기
https://expo.dev/signup 에서 무료 가입

### 2단계: 컴퓨터에서 로그인
```bash
cd /home/user/webapp
npx eas-cli login
```
- 이메일과 비밀번호 입력

### 3단계: APK 빌드
```bash
npx eas-cli build --platform android --profile preview
```

### 4단계: 빌드 완료 기다리기
- ⏰ 약 10-20분 소요
- 진행 상황: https://expo.dev 에서 확인 가능

### 5단계: APK 다운로드
- 빌드 완료 후 다운로드 링크 제공
- 스마트폰에서 링크 열기
- APK 파일 다운로드 & 설치

---

## 📋 빌드 명령어 요약

```bash
# 프로젝트로 이동
cd /home/user/webapp

# EAS CLI 로그인 (처음만)
npx eas-cli login

# APK 빌드 (개발용)
npx eas-cli build --platform android --profile preview

# 빌드 상태 확인
npx eas-cli build:list

# 최신 빌드 상태
npx eas-cli build:view --latest
```

---

## 🎯 빌드 프로필 설명

### preview (추천!)
```bash
npx eas-cli build --platform android --profile preview
```
- ✅ 개발/테스트용
- ✅ 빠른 빌드
- ✅ 디버깅 가능
- 📦 APK 파일 생성

### production (배포용)
```bash
npx eas-cli build --platform android --profile production
```
- 🚀 Play Store 배포용
- ⏰ 빌드 시간 길음
- 🔒 서명 필요
- 📦 APK 또는 AAB 생성

---

## 💡 **대안: PWA 설치 (더 간단!)**

APK 빌드 대신 PWA로 설치하는 것이 더 빠릅니다:

1. 스마트폰 브라우저에서 열기:
   ```
   https://8081-i6ol2h43loy8vue46xort-5c13a017.sandbox.novita.ai
   ```

2. 브라우저 메뉴 → "홈 화면에 추가"

3. 완료! 🎉

**PWA vs APK:**
- PWA: ✅ 30초, 설치 파일 불필요, 자동 업데이트
- APK: ⏰ 20분+, Expo 계정 필요, 수동 업데이트

---

## 🐛 문제 해결

### "Not logged in" 에러
```bash
npx eas-cli login
```

### "Build failed" 에러
```bash
# 캐시 삭제 후 재빌드
npx eas-cli build --platform android --profile preview --clear-cache
```

### 로그인이 안 됨
- Expo 계정 만들기: https://expo.dev/signup
- 이메일 확인 후 다시 시도

---

## 📞 추가 도움

- **EAS Build 문서**: https://docs.expo.dev/build/setup/
- **Expo 대시보드**: https://expo.dev
- **빌드 로그**: https://expo.dev/accounts/[your-account]/projects/antigravity-app/builds

---

## 🎯 결론

**가장 쉬운 방법 순서:**

1. **PWA 설치** (30초) ⭐⭐⭐⭐⭐
   → 스마트폰 브라우저에서 "홈 화면에 추가"

2. **EAS Build** (20분) ⭐⭐⭐⭐
   → `npx eas-cli build --platform android --profile preview`

3. **로컬 빌드** (1시간+) ⭐
   → Android SDK 설치 필요 (추천 안 함)

**추천: PWA 먼저 시도! 안 되면 EAS Build 사용!** 🚀
