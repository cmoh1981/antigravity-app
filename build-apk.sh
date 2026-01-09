#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 오늘건강 APK 빌드 스크립트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 프로젝트 디렉토리로 이동
cd /home/user/webapp

# EAS CLI 확인
echo "🔍 EAS CLI 확인 중..."
if ! command -v eas &> /dev/null; then
    echo "ℹ️  EAS CLI가 설치되어 있지 않습니다."
    echo "   npx를 사용하여 실행합니다."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Expo 로그인 상태 확인"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npx eas-cli whoami

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  로그인이 필요합니다!"
    echo ""
    echo "다음 명령어로 로그인하세요:"
    echo "  npx eas-cli login"
    echo ""
    echo "Expo 계정이 없다면:"
    echo "  https://expo.dev/signup 에서 무료 가입"
    echo ""
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 APK 빌드 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "빌드 프로필: preview (개발용)"
echo "플랫폼: Android"
echo "예상 시간: 10-20분"
echo ""
echo "빌드 진행 상황은 다음에서 확인 가능:"
echo "  https://expo.dev"
echo ""

read -p "계속하시겠습니까? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔨 빌드 중..."
    echo ""
    npx eas-cli build --platform android --profile preview
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ 빌드 성공!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "다음 단계:"
        echo "1. 위에 표시된 다운로드 링크 복사"
        echo "2. 스마트폰에서 링크 열기"
        echo "3. APK 파일 다운로드"
        echo "4. 파일 관리자에서 APK 설치"
        echo "5. '알 수 없는 출처' 허용 (설정)"
        echo ""
    else
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ 빌드 실패"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "문제 해결:"
        echo "1. 로그를 확인하세요"
        echo "2. https://expo.dev 에서 빌드 로그 확인"
        echo "3. 캐시 삭제 후 재시도:"
        echo "   npx eas-cli build --platform android --profile preview --clear-cache"
        echo ""
    fi
else
    echo ""
    echo "취소되었습니다."
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
