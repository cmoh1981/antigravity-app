# 📱 Expo Go 연결 가이드

## 현재 상태
✅ Expo 개발 서버 실행 중
✅ 터널 모드 활성화
✅ Metro Bundler 준비 완료

## 🔗 연결 방법

### 방법 1: 로컬 WiFi (추천)

**조건:** 스마트폰과 서버가 같은 WiFi 연결

1. Expo Go 앱 열기
2. "Projects" 또는 "Recently in Development" 탭
3. "antigravity-app" 또는 "webapp" 프로젝트 찾기
4. 탭해서 열기

---

### 방법 2: URL 수동 입력

1. Expo Go 앱 열기
2. 하단 "Enter URL manually" 탭
3. 다음 중 하나 입력:

**로컬 네트워크:**
```
exp://192.168.x.x:8081
```
(실제 IP는 서버 로그에서 확인)

**터널:**
```
exp://[tunnel-url]
```

---

### 방법 3: QR 코드 스캔

터미널에 표시된 QR 코드를:
- **Android:** Expo Go 앱에서 스캔
- **iOS:** 카메라 앱으로 스캔

---

## 🐛 연결 안 될 때

### "Unable to resolve" 에러
```bash
# 서버 재시작
npx expo start --clear
```

### "Network timeout" 에러
```bash
# 터널 모드 사용
npx expo start --tunnel
```

### QR 코드가 안 보일 때
```bash
# QR 코드 다시 표시
npx expo start --qr
```

---

## 📞 현재 서버 정보

- **포트:** 8081
- **모드:** Tunnel (원격 접속 가능)
- **프로토콜:** exp://
- **상태:** ✅ 실행 중

---

## 🎯 연결 성공 후

1. 앱이 로딩됩니다 (처음엔 조금 느릴 수 있음)
2. 흰 화면 → 로고 → 온보딩 화면
3. 목표 선택 화면이 나타나면 성공!

---

## 💡 팁

- 처음 연결 시 번들 다운로드로 1-2분 소요
- 코드 변경 시 자동으로 새로고침
- 폰을 흔들면 개발자 메뉴 열림
- Ctrl+C로 서버 종료

---

**문제 발생 시:** 
서버 로그를 확인하거나 `npx expo start --clear`로 재시작하세요.
