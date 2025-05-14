---
title: 빌드 모드 (debug / profile / release)
---

Flutter는 세 가지 주요 빌드 모드를 제공합니다. 각 모드는 개발 과정의 다른 단계에서 사용되며, 각기 다른 최적화와 기능을 제공합니다.

## 빌드 모드 개요

Flutter의 빌드 모드는 다음과 같습니다:

## Debug 모드

Debug 모드는 개발 과정에서 주로 사용하는 모드입니다.

### 특징

- **Hot Reload/Restart**: 코드 변경 사항을 빠르게 확인할 수 있습니다.
- **디버깅 도구**: 콘솔 로그, 디버거 연결, 인스펙터 등 개발 도구 사용 가능합니다.
- **확인용 배너**: 앱 우측 상단에 DEBUG 배너가 표시됩니다.
- **비최적화 빌드**: 성능이 최적화되지 않고 디버깅 정보가 포함되어 있습니다.

### 실행 방법

```bash
# 명시적으로 debug 모드로 실행
flutter run --debug

# 기본값이므로 일반적으로 다음과 같이 실행
flutter run
```

### 사용 시나리오

- 앱 개발 및 기능 테스트
- 코드 디버깅
- UI 구현 및 확인

## Profile 모드

Profile 모드는 성능 분석과 프로파일링을 위한 모드입니다.

### 특징

- **성능 트래킹**: Timeline, DevTools 등을 통한 성능 측정 가능
- **일부 디버깅 비활성화**: Hot Reload, 일부 디버깅 기능은 비활성화
- **실제 성능과 유사**: Release 모드와 유사한 성능 특성을 가지지만, 프로파일링 도구 사용 가능
- **Flutter Inspector**: UI 레이아웃 및 렌더링 분석 가능

### 실행 방법

```bash
flutter run --profile
```

> **주의**: Profile 모드는 에뮬레이터/시뮬레이터에서 정확한 성능 측정이 어려우므로 실제 기기에서 실행하는 것이 좋습니다.

### 사용 시나리오

- 앱 성능 분석
- 병목 현상 파악
- 메모리 사용량 및 프레임 드롭 확인
- 실제 기기에서의 사용자 경험 검증

## Release 모드

Release 모드는 최종 사용자에게 배포하기 위한 최적화된 빌드 모드입니다.

### 특징

- **최적화된 성능**: 모든 성능 최적화 기능 활성화
- **코드 최소화**: 사용하지 않는 코드 제거 및 최소화
- **디버깅 기능 비활성화**: 모든 디버깅 도구와 코드 제거
- **R8/ProGuard (Android)**: 코드 축소, 난독화 및 최적화

### 실행 방법

```bash
flutter run --release
```

### 빌드 방법

```bash
# Android APK 빌드
flutter build apk --release

# Android App Bundle 빌드
flutter build appbundle --release

# iOS 빌드
flutter build ios --release
```

### 사용 시나리오

- 앱 스토어 제출
- 사용자 배포
- 최종 성능 테스트
- 배포 전 검증

## 모드 간 비교

| 기능             | Debug | Profile | Release |
| ---------------- | ----- | ------- | ------- |
| 성능 최적화      | ❌    | ✅      | ✅      |
| 코드 크기 최적화 | ❌    | ✅      | ✅      |
| Hot Reload       | ✅    | ❌      | ❌      |
| 디버거 연결      | ✅    | 제한적  | ❌      |
| 성능 오버헤드    | 높음  | 낮음    | 없음    |
| 앱 크기          | 큼    | 중간    | 작음    |
| 프로파일링 도구  | ✅    | ✅      | ❌      |
| Assert 문 실행   | ✅    | ❌      | ❌      |

## 모드 전환 시 주의사항

### Debug에서 Release로 전환 시 확인 사항

1. **assert 문**: Debug 모드에서만, Release 모드에서는 무시됩니다.
2. **환경 변수**: kDebugMode, kProfileMode, kReleaseMode 플래그를 사용한 조건부 코드 확인
3. **로그 출력**: 불필요한 print() 문 제거 검토

```dart
// 빌드 모드에 따른 조건부 코드 예시
if (kDebugMode) {
  print('이 메시지는 Debug 모드에서만 출력됩니다');
} else if (kProfileMode) {
  // 프로파일 모드 특화 코드
} else if (kReleaseMode) {
  // 릴리즈 모드 특화 코드
}
```

4. **플랫폼 채널**: 네이티브 코드와의 통신이 제대로 작동하는지 확인
5. **타이밍 차이**: 디버그 모드보다 릴리즈 모드에서 실행 속도가 빠를 수 있음을 고려

## 빌드 모드 활용 팁

### 다양한 모드 테스트

개발 과정에서 정기적으로 Profile 및 Release 모드로 앱을 테스트하여 실제 사용자 경험을 확인하는 것이 좋습니다.

### 조건부 코드 작성

```dart
// 개발 중에만 필요한 코드
if (kDebugMode) {
  // 개발 환경에서만 사용할 추가 기능
  enableDevFeatures();
}

// 릴리즈에서만 활성화할 코드
if (kReleaseMode) {
  // 분석 도구 초기화 등
  initializeAnalytics();
}
```

### Flavor와 함께 사용

빌드 모드는 Flavor(제품 환경)와 함께 사용하여 개발, 스테이징, 프로덕션 환경을 구분할 수 있습니다.

```
Debug + Dev Flavor = 개발 환경 테스트
Profile + Staging Flavor = 스테이징 성능 테스트
Release + Production Flavor = 최종 배포 빌드
```

## 결론

Flutter의 세 가지 빌드 모드(Debug, Profile, Release)는 각각 다른 목적으로 사용되며, 개발 과정의 다양한 단계에서 활용됩니다. 개발 중에는 Debug 모드를 사용하여 빠른 반복 개발을, 성능 테스트에는 Profile 모드를, 최종 배포에는 Release 모드를 사용하는 것이 권장됩니다. 각 모드의 특성을 이해하고 적절히 활용하면 효율적인 개발과 최적화된 앱 배포가 가능합니다.
