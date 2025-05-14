---
title: Flutter 오류 대응법 가이드
---


Flutter 앱을 개발하면서 다양한 오류에 직면할 수 있습니다. 이 문서에서는 자주 발생하는 Flutter 오류들과 그 해결 방법을 소개합니다.

## 개발 환경 오류

### Flutter Doctor 오류

Flutter SDK를 설치한 후에는 항상 `flutter doctor` 명령어를 실행하여 개발 환경을 확인하는 것이 좋습니다.

| 오류 메시지                     | 원인                                                 | 해결 방법                                                                |
| ------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| `Flutter requires Android SDK`  | Android SDK가 설치되지 않았거나 경로가 설정되지 않음 | Android Studio를 설치하거나, Android SDK 경로를 Flutter 환경 변수에 추가 |
| `Android licenses not accepted` | Android 라이선스 동의가 필요함                       | `flutter doctor --android-licenses` 실행 후 동의                         |
| `Xcode not installed`           | iOS 개발을 위한 Xcode가 설치되지 않음 (macOS만 해당) | App Store에서 Xcode 설치                                                 |
| `CocoaPods not installed`       | iOS 종속성 관리 도구가 설치되지 않음                 | `sudo gem install cocoapods` 명령어로 설치                               |

### pubspec.yaml 관련 오류

```
Because every version of flutter_package from sdk depends on intl ^0.17.0 and app depends on intl ^0.18.0, flutter_package from sdk is forbidden.
```

**원인**: 패키지 간 의존성 충돌
**해결 방법**: 패키지 버전을 호환되는 범위로 조정하고 `flutter pub upgrade --major-versions` 실행

## 빌드 오류

### Gradle 관련 오류

```
Gradle task assembleDebug failed with exit code 1
```

**원인**: 다양한 Gradle 구성 문제 발생 가능
**해결 방법**:

1. 안드로이드 폴더에서 `./gradlew clean` 실행
2. `flutter clean` 실행 후 다시 빌드
3. Gradle 버전 확인 및 업데이트

### iOS 빌드 오류

```
[!] CocoaPods could not find compatible versions for pod "Firebase/Core"
```

**원인**: CocoaPods 의존성 충돌
**해결 방법**:

1. iOS 폴더에서 `pod repo update` 실행
2. `pod install --repo-update` 실행
3. `Podfile.lock` 삭제 후 `pod install` 다시 실행

### 코드 서명 오류

```
No provisioning profile matches the specified entitlements
```

**원인**: iOS 앱 서명 설정 문제
**해결 방법**:

1. Xcode를 열고 팀 설정 확인
2. 프로비저닝 프로필 업데이트
3. 앱 ID와 번들 ID가 일치하는지 확인

## 런타임 오류

### 위젯 빌드 오류

#### setState() 오류

```
setState() called after dispose(): _MyWidgetState#a7c89(lifecycle state: defunct, not mounted)
```

**원인**: 위젯이 제거된 후 setState 호출
**해결 방법**:

```dart
// 수정 전
void fetchData() async {
  final data = await apiService.getData();
  setState(() {
    this.data = data;
  });
}

// 수정 후
void fetchData() async {
  final data = await apiService.getData();
  if (mounted) {
    setState(() {
      this.data = data;
    });
  }
}
```

#### RenderFlex 오버플로우

```
A RenderFlex overflowed by 20 pixels on the bottom
```

**원인**: 자식 위젯이 부모 위젯의 제약 조건을 초과
**해결 방법**:

1. `Expanded` 또는 `Flexible` 위젯 사용
2. `SingleChildScrollView`로 스크롤 가능하게 만들기
3. `ConstrainedBox`를 사용하여 최대 크기 제한

```dart
// 오류 발생 코드
Column(
  children: [
    LargeWidget(),
    AnotherLargeWidget(),
  ],
)

// 해결 방법 (스크롤 적용)
SingleChildScrollView(
  child: Column(
    children: [
      LargeWidget(),
      AnotherLargeWidget(),
    ],
  ),
)

// 또는 Expanded 사용 (부모가 Row/Column일 경우)
Column(
  children: [
    Expanded(child: LargeWidget()),
    AnotherWidget(),
  ],
)
```

### 상태 관리 오류

#### Provider 관련 오류

```
Error: Could not find the correct Provider<MyModel> above this Consumer Widget
```

**원인**: Provider가 위젯 트리의 상위에 없음
**해결 방법**: 적절한 위치에 Provider 배치

```dart
// 수정 전 (문제가 되는 구조)
Widget build(BuildContext context) {
  return Consumer<MyModel>(
    builder: (context, model, child) {
      return Text(model.data);
    },
  );
}

// 수정 후 (올바른 구조)
Widget build(BuildContext context) {
  return ChangeNotifierProvider(
    create: (_) => MyModel(),
    child: Consumer<MyModel>(
      builder: (context, model, child) {
        return Text(model.data);
      },
    ),
  );
}
```

#### Riverpod 관련 오류

```
ProviderNotFoundException: No provider found for providerHash:xxx
```

**원인**: ProviderScope 범위 밖에서 provider에 접근 시도
**해결 방법**: 앱 루트에 ProviderScope 추가

```dart
void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}
```

### 네트워크 관련 오류

#### CORS 오류 (웹)

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**원인**: 웹 버전에서 CORS 정책 위반
**해결 방법**:

1. 서버 측에서 적절한 CORS 헤더 설정
2. 개발 시에는 Chrome을 `--disable-web-security` 옵션으로 실행
3. 프록시 서버 사용

#### 인증서 오류

```
HandshakeException: Handshake error in client
```

**원인**: SSL 인증서 문제
**해결 방법**:

```dart
// 주의: 프로덕션 앱에서는 사용하지 않는 것이 좋습니다
HttpClient client = HttpClient()
  ..badCertificateCallback =
      (X509Certificate cert, String host, int port) => true;
```

### 비동기 처리 오류

#### FutureBuilder 에러

```
type 'Future<dynamic>' is not a subtype of type 'Future<List<String>>'
```

**원인**: Future의 타입 불일치
**해결 방법**: 명시적 타입 지정

```dart
// 수정 전
Future fetchData() async {
  // ...
  return data;
}

// 수정 후
Future<List<String>> fetchData() async {
  // ...
  return data;
}
```

#### 스트림 오류

```
Bad state: Stream has already been listened to
```

**원인**: 단일 구독 스트림에 여러 번 구독 시도
**해결 방법**: `Stream.asBroadcastStream()` 사용 또는 `StreamController`에서 `broadcast: true` 설정

## 플랫폼별 오류

### Android 특정 오류

#### 다중 DEX 문제

```
Execution failed for task ':app:mergeDebugResources'. > java.lang.OutOfMemoryError
```

**원인**: 메서드 수가 DEX 제한을 초과
**해결 방법**: `android/app/build.gradle`에 멀티덱스 활성화

```gradle
android {
  defaultConfig {
    multiDexEnabled true
  }
}

dependencies {
  implementation 'androidx.multidex:multidex:2.0.1'
}
```

#### 권한 관련 오류

```
PlatformException: Permission denied
```

**원인**: 필요한 권한이 설정되지 않음
**해결 방법**: `AndroidManifest.xml`에 필요한 권한 추가 및 런타임 권한 요청 구현

```xml
<manifest>
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.CAMERA" />
  <!-- 필요한 권한 추가 -->
</manifest>
```

### iOS 특정 오류

#### Info.plist 관련 오류

```
This app has crashed because it attempted to access privacy-sensitive data without a usage description.
```

**원인**: 필요한 권한 설명이 Info.plist에 없음
**해결 방법**: `ios/Runner/Info.plist`에 관련 설명 추가

```xml
<key>NSCameraUsageDescription</key>
<string>이 앱은 프로필 사진 등록을 위해 카메라에 접근합니다.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>이 앱은 사진 업로드를 위해 갤러리에 접근합니다.</string>
```

#### 미니멈 iOS 버전 오류

```
The iOS deployment target is set to 8.0, but the range of supported deployment target versions is 9.0 to 14.0.
```

**원인**: 지원되지 않는 iOS 최소 버전 설정
**해결 방법**: `ios/Podfile` 및 Xcode 프로젝트 설정에서 최소 버전 업데이트

```ruby
# Podfile
platform :ios, '12.0'
```

## Web 특정 오류

### 자바스크립트 오류

```
TypeError: Cannot read property 'X' of undefined
```

**원인**: 웹용 플러그인이 올바르게 초기화되지 않음
**해결 방법**: 플랫폼 조건부 코드 사용

```dart
import 'package:flutter/foundation.dart' show kIsWeb;

if (kIsWeb) {
  // 웹 전용 코드
} else {
  // 모바일 전용 코드
}
```

### 웹 리소스 로딩 오류

```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```

**원인**: 광고 차단기가 리소스 로딩 차단
**해결 방법**: 리소스 URL 패턴 변경 또는 필수 리소스임을 사용자에게 알림

## 내부적인 패키지 오류

### 플러그인 호환성 문제

```
MissingPluginException(No implementation found for method X on channel Y)
```

**원인**: 플러그인 초기화 문제 또는 플랫폼 지원 부재
**해결 방법**:

1. 앱 재시작
2. `flutter clean` 실행 후 다시 빌드
3. 플러그인 호환성 확인 및 조건부 코드 작성

### 패키지 버전 충돌

```
Undefined name 'X'. (The name X isn't a type and can't be used in a declaration)
```

**원인**: API 변경으로 인한 코드 호환성 문제
**해결 방법**:

1. 패키지 버전 확인 및 호환되는 버전 사용
2. 최신 API에 맞게 코드 업데이트
3. 코드 마이그레이션 가이드 참조

## 메모리 관련 오류

### 메모리 누수

#### 컨트롤러 누수

```
A Timer still exists even after the widget tree was disposed.
```

**원인**: dispose 메서드에서 타이머, 컨트롤러 등을 해제하지 않음
**해결 방법**:

```dart
class _MyWidgetState extends State<MyWidget> {
  AnimationController _controller;
  Timer _timer;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
    _timer = Timer.periodic(Duration(seconds: 1), (_) => update());
  }

  @override
  void dispose() {
    _controller.dispose(); // 컨트롤러 해제
    _timer.cancel(); // 타이머 취소
    super.dispose();
  }
}
```

#### 대용량 이미지 메모리 문제

```
Out of memory: Bytes allocation failed
```

**원인**: 과도한 메모리 사용
**해결 방법**:

1. 이미지 캐싱 라이브러리 사용 (cached_network_image)
2. 적절한 크기의 이미지 로드 (ResizeImage 또는 서버 측 리사이징)
3. 메모리에 저장하는 데이터 제한

## 코드 품질 오류

### 린트 오류

```
The parameter 'onPressed' is required
```

**원인**: 필수 매개변수 누락
**해결 방법**: 코드 분석 도구가 지적한 문제 해결

### 성능 이슈

#### 과도한 빌드 호출

**원인**: 불필요한 위젯 리빌드로 인한 성능 저하
**해결 방법**:

1. `const` 생성자 사용
2. 상태 변경을 더 작은 위젯으로 분리
3. `RepaintBoundary`를 사용하여 리페인트 영역 제한

```dart
// 개선 전
ListView.builder(
  itemBuilder: (context, index) {
    return MyListItem(data: items[index]);
  }
)

// 개선 후
ListView.builder(
  itemBuilder: (context, index) {
    return RepaintBoundary(
      child: const MyListItem(data: items[index]),
    );
  }
)
```

## 디버깅 도구

### Flutter DevTools

Flutter DevTools는 Flutter 앱 개발 시 강력한 디버깅 도구입니다. 다음과 같은 기능을 제공합니다:

1. **Inspector**: 위젯 트리 분석 및 레이아웃 디버깅
2. **Performance**: 프레임 드롭 분석
3. **Memory**: 메모리 사용량 및 누수 확인
4. **Network**: 네트워크 요청 모니터링
5. **Logging**: 로그 확인 및 필터링

### 효과적인 로깅 전략

효과적인 로깅은 문제를 빠르게 파악하는 데 도움이 됩니다:

1. **로깅 레벨 구분**:

   ```dart
   import 'package:logger/logger.dart';

   final logger = Logger(
     printer: PrettyPrinter(),
   );

   // 다양한 로깅 레벨 사용
   logger.v("Verbose log");
   logger.d("Debug log");
   logger.i("Info log");
   logger.w("Warning log");
   logger.e("Error log");
   ```

2. **예외 처리**:
   ```dart
   try {
     // 위험한 작업
   } catch (e, stackTrace) {
     logger.e("오류 발생", error: e, stackTrace: stackTrace);
   }
   ```

## 결론

Flutter 앱 개발 중 발생하는 대부분의 오류는 체계적인 접근 방식으로 해결할 수 있습니다. 문제를 정확히 이해하고, 검색 엔진이나 Stack Overflow 같은 자료를 활용하며, 필요하다면 Flutter 이슈 트래커나 커뮤니티에 도움을 요청하세요.

오류 메시지를 무시하지 말고, 로그를 주의 깊게 읽고 분석하는 습관을 들이면 문제 해결 능력이 크게 향상됩니다. 또한 정기적으로 Flutter와 종속성을 최신 상태로 유지하는 것도 많은 문제를 예방할 수 있는 좋은 방법입니다.
