# 🎉 오늘건강 앱 - 시작 가이드

## 📱 앱을 스마트폰에 설치하는 3가지 방법

---

## ✨ **방법 1: PWA 설치 (가장 쉬움! 30초)**

### 📱 지금 바로 설치:

1. **스마트폰에서 브라우저 열기** (Chrome 또는 Safari)

2. **이 주소 입력:**
   ```
   https://8081-i6ol2h43loy8vue46xort-5c13a017.sandbox.novita.ai
   ```

3. **브라우저 메뉴 → "홈 화면에 추가"**
   - **Android (Chrome)**: 메뉴 ⋮ → "홈 화면에 추가"
   - **iPhone (Safari)**: 공유 □↑ → "홈 화면에 추가"

4. **완료!** 🎉

### 장점:
- ✅ 30초 안에 완료
- ✅ 설치 파일 불필요
- ✅ 자동 업데이트
- ✅ 앱처럼 작동

---

## 🚀 **방법 2: APK 빌드 (네이티브 앱, 20분)**

### 필요한 것:
- Expo 계정 (무료): https://expo.dev/signup
- 터미널 접근

### 빌드 방법:

#### Option A: 자동 스크립트 사용
```bash
cd /home/user/webapp
./build-apk.sh
```

#### Option B: 수동 명령어
```bash
cd /home/user/webapp

# 1. 로그인
npx eas-cli login

# 2. APK 빌드
npx eas-cli build --platform android --profile preview

# 3. 빌드 완료 후 다운로드 링크 확인
```

### 빌드 후:
1. 다운로드 링크 복사
2. 스마트폰에서 링크 열기
3. APK 다운로드 & 설치
4. "알 수 없는 출처" 허용

**예상 시간:** 10-20분

---

## 💻 **방법 3: 웹으로 바로 접속**

### 설치 없이 사용:
```
https://8081-i6ol2h43loy8vue46xort-5c13a017.sandbox.novita.ai
```

스마트폰 브라우저에서 위 링크를 열면 바로 사용 가능!

---

## 📊 방법 비교

| 방법 | 시간 | 설치 | 장점 | 추천도 |
|------|------|------|------|--------|
| **PWA** | 30초 | 불필요 | 가장 쉬움 | ⭐⭐⭐⭐⭐ |
| **APK** | 20분 | APK 파일 | 네이티브 성능 | ⭐⭐⭐⭐ |
| **웹** | 즉시 | 불필요 | 빠른 테스트 | ⭐⭐⭐ |

---

## 🎯 추천 순서

1. **PWA 설치 시도** ← 가장 추천!
2. 안 되면 → **웹으로 바로 접속**
3. 네이티브 필요 시 → **APK 빌드**

---

## 📚 상세 가이드

프로젝트에 다음 문서들이 있습니다:

### 설치 관련:
- **`BUILD_INSTRUCTIONS.txt`** - 빠른 참조 가이드
- **`SIMPLE_INSTALL_GUIDE.md`** - PWA 설치 상세 가이드
- **`APK_BUILD_EASY.md`** - APK 빌드 상세 가이드
- **`BUILD_APK_GUIDE.md`** - 기술 가이드

### 개발 관련:
- **`README_MOBILE.md`** - 모바일 앱 전체 가이드
- **`NATIVE_APP_BUILD.md`** - 네이티브 빌드 가이드
- **`OPTIMIZATION_NOTES.md`** - 최적화 노트
- **`EXPO_CONNECTION_GUIDE.md`** - Expo Go 연결 가이드

---

## 🔗 중요 링크

- **앱 URL**: https://8081-i6ol2h43loy8vue46xort-5c13a017.sandbox.novita.ai
- **GitHub**: https://github.com/cmoh1981/antigravity-app
- **Pull Request**: https://github.com/cmoh1981/antigravity-app/pull/1
- **Expo 가입**: https://expo.dev/signup

---

## ✅ 앱 기능

### 완료된 기능:
- ✅ 온보딩 (목표 설정, 신체 정보 등)
- ✅ 홈 화면 (운동/식단/수면 계획)
- ✅ 36가지 운동 (설명, GIF, 팁, 주의사항)
- ✅ 운동 상세 모달 (ℹ️ 버튼 또는 이미지 탭)
- ✅ 식단 추천
- ✅ 리포트 화면
- ✅ 설정 화면
- ✅ 다크 모드
- ✅ 모바일 최적화 (터치, 제스처)
- ✅ PWA 기능 (오프라인 지원)

### 현재 이슈:
- ⚠️ "오늘의 컨디션 체크하기" 버튼 - 웹에서 작동 안 함 (네이티브 앱에서는 작동)

---

## 🎊 지금 시작하세요!

### 가장 빠른 방법:

1. 📱 스마트폰 브라우저 열기
2. 🌐 주소 입력: `https://8081-i6ol2h43loy8vue46xort-5c13a017.sandbox.novita.ai`
3. ⋮ 메뉴 → "홈 화면에 추가"
4. 🎉 완료!

**30초면 됩니다!** 🚀

---

## 🐛 문제가 있나요?

### PWA 설치 버튼이 안 보여요
- Chrome 또는 Safari 사용 확인
- HTTPS 주소인지 확인

### 화면이 짤려요
- 최신 코드로 수정 완료
- 페이지 새로고침 (F5)

### APK 빌드가 안 돼요
- Expo 계정 확인
- `npx eas-cli login` 먼저 실행
- 상세 가이드: `APK_BUILD_EASY.md` 참조

---

## 💬 피드백

문제가 있거나 제안사항이 있으면:
- GitHub Issues: https://github.com/cmoh1981/antigravity-app/issues
- Pull Request: https://github.com/cmoh1981/antigravity-app/pull/1

---

**즐거운 건강 관리 되세요!** 💪✨
