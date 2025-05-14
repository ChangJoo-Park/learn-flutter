---
title: Android / iOS 배포 절차
---

Flutter 앱을 개발한 후 사용자들에게 제공하기 위해 앱 스토어에 배포하는 절차를 알아봅니다. Android와 iOS 플랫폼은 각각 다른 배포 프로세스를 가지고 있습니다.

## 배포 준비 체크리스트

앱 스토어에 제출하기 전에 다음 항목을 먼저 확인하세요:

- [ ] 모든 주요 기능 테스트 완료
- [ ] 앱 아이콘 및 스플래시 스크린 구현
- [ ] 다양한 화면 크기/해상도 테스트
- [ ] 접근성 지원 확인
- [ ] 개인정보 처리방침 준비
- [ ] 앱 스크린샷 및 설명 준비

## Android 앱 배포 절차

### 1. 배포용 키스토어 생성

Android 앱을 서명하기 위한 키스토어(keystore) 파일을 생성해야 합니다. 이 키는 앱 업데이트 시 동일한 키로 서명해야 하므로 안전하게 보관해야 합니다.

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

### 2. 키스토어 설정

`android/app/build.gradle` 파일에 키스토어 정보를 추가합니다. 보안을 위해 다음과 같이 별도의 파일로 관리합니다.

1. `android/key.properties` 파일 생성:

```properties
storePassword=<키스토어 비밀번호>
keyPassword=<키 비밀번호>
keyAlias=upload
storeFile=<키스토어 파일 경로, 예: /Users/username/upload-keystore.jks>
```

2. `android/app/build.gradle` 파일 수정:

```txt
// 파일 상단에 다음 코드 추가
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // 기존 코드 ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // 기타 릴리즈 설정 ...
        }
    }
}
```

### 3. 앱 버전 설정

`pubspec.yaml` 파일에서 앱 버전을 설정합니다.

```yaml
version: 1.0.0+1 # <버전 이름>+<빌드 번호>
```

### 4. 앱 매니페스트 설정

`android/app/src/main/AndroidManifest.xml` 파일에서 필요한 권한과 설정을 확인합니다.

```xml
<manifest ...>
    <!-- 필요한 권한 설정 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 기타 필요한 권한들 -->

    <application
        android:label="앱 이름"
        android:icon="@mipmap/ic_launcher"
        ...>
        <!-- 앱 설정 -->
    </application>
</manifest>
```

### 5. 앱 번들/APK 생성

Google Play는 Android App Bundle(AAB) 형식을 권장합니다.

```bash
# App Bundle 생성 (권장)
flutter build appbundle

# 또는 APK 생성
flutter build apk --release
```

빌드된 파일은 다음 위치에서 찾을 수 있습니다:

- App Bundle: `build/app/outputs/bundle/release/app-release.aab`
- APK: `build/app/outputs/flutter-apk/app-release.apk`

### 6. Google Play Console에 앱 등록

1. [Google Play Console](https://play.google.com/console)에 로그인합니다.
2. "새 앱 만들기"를 선택합니다.
3. 앱 정보(이름, 언어, 앱/게임 여부, 유료/무료 여부)를 입력합니다.
4. 개인정보 처리방침 URL을 제공합니다.
5. 다음 정보를 등록합니다:
   - 앱 카테고리 및 태그
   - 연락처 정보
   - 스크린샷, 프로모션 이미지, 앱 아이콘
   - 앱 설명(짧은 설명 및 전체 설명)

### 7. 앱 번들 업로드

1. "앱 릴리즈" > "프로덕션" 트랙 선택
2. "새 릴리즈 만들기" 클릭
3. 생성한 App Bundle(.aab) 파일 업로드
4. 릴리즈 노트 작성
5. 검토 후 출시

### 8. 출시 및 검토

Google Play 검토 프로세스는 보통 몇 시간에서 며칠까지 소요될 수 있습니다. 검토 완료 후 앱이 출시됩니다.

## iOS 앱 배포 절차

### 1. Apple Developer Program 가입

iOS 앱을 App Store에 배포하려면 연간 $99의 비용으로 [Apple Developer Program](https://developer.apple.com/programs/)에 가입해야 합니다.

### 2. Xcode에서 인증서 및 프로비저닝 프로필 설정

1. Xcode 열기: `open ios/Runner.xcworkspace`
2. "Signing & Capabilities" 탭에서 팀 선택 및 자동 서명 활성화
3. 번들 ID 설정 (고유한 식별자, 예: com.yourcompany.appname)

### 3. 앱 버전 및 빌드 번호 설정

`pubspec.yaml` 파일에서 버전을 설정합니다:

```yaml
version: 1.0.0+1 # <버전 이름>+<빌드 번호>
```

iOS 특정 버전은 Xcode의 Runner 프로젝트 설정이나 `ios/Runner/Info.plist` 파일에서도 확인/수정할 수 있습니다.

### 4. iOS 앱 설정

`ios/Runner/Info.plist` 파일에서 필요한 설정을 확인합니다:

```xml
<key>CFBundleDisplayName</key>
<string>앱 이름</string>

<!-- 필요한 권한 설명 추가 -->
<key>NSCameraUsageDescription</key>
<string>카메라 사용 이유 설명</string>
```

### 5. 앱 아이콘 설정

`ios/Runner/Assets.xcassets/AppIcon.appiconset`에 다양한 크기의 앱 아이콘을 추가합니다.

### 6. 릴리즈 빌드 생성

```bash
flutter build ios --release
```

### 7. Xcode에서 Archive 생성

1. Xcode에서 "Product" > "Destination" > "Any iOS Device" 선택
2. "Product" > "Archive" 선택
3. Archive가 완료되면 Xcode Organizer가 자동으로 열립니다

### 8. TestFlight를 통한 테스트 (선택 사항)

TestFlight를 통해 앱을 테스터에게 배포하여 최종 테스트를 진행할 수 있습니다.

1. Xcode Organizer에서 Archive 선택
2. "Distribute App" > "App Store Connect" > "Upload" 선택
3. 앱 배포 옵션 설정 (자동 서명 권장)
4. 업로드 완료 후 [App Store Connect](https://appstoreconnect.apple.com/)에서 TestFlight 구성
5. 내부 및 외부 테스터 추가

### 9. App Store Connect에서 앱 정보 설정

1. [App Store Connect](https://appstoreconnect.apple.com/)에 로그인
2. "내 앱" > "+" > "새로운 앱" 선택
3. 다음 정보 입력:
   - 앱 이름, 기본 언어, 번들 ID
   - SKU (내부 추적용 고유 ID)
   - 사용자 액세스 설정

### 10. 앱 정보 등록

1. App Store 정보 탭에서 다음 항목 작성:
   - 프로모션 텍스트 (최대 170자)
   - 설명 (최대 4,000자)
   - 키워드 (최대 100자)
   - 지원 URL 및 마케팅 URL
   - 스크린샷 (다양한 기기 크기별)
   - 앱 미리보기 영상 (선택 사항)
   - 앱 아이콘 (1024x1024 픽셀)
   - 연령 등급
   - 개인정보 처리방침 URL
   - 가격 및 가용성

### 11. 앱 심사 제출

1. "앱 버전" 섹션에서 제출할 빌드 선택
2. 필요한 수출 규정 준수 정보 제공
3. "심사를 위해 제출" 클릭

### 12. 앱 심사 및 출시

Apple의 앱 심사는 보통 1-3일 소요됩니다. 거부될 경우 이유가 제공되며, 수정 후 재제출할 수 있습니다. 승인되면 "출시 준비됨" 상태가 되고, 수동 또는 자동으로 출시할 수 있습니다.

## CI/CD를 활용한 자동화 배포

배포 과정을 자동화하기 위해 CI/CD 도구를 활용할 수 있습니다. 대표적인 도구로는 Codemagic, Fastlane, GitHub Actions 등이 있습니다.

### Codemagic 활용 예시

`codemagic.yaml` 파일 구성:

```yaml
workflows:
  android-workflow:
    name: Android Release
    environment:
      vars:
        KEYSTORE_PATH: /tmp/keystore.jks
        FCI_KEYSTORE_FILE: Encrypted(...) # 키스토어 파일 암호화
      flutter: stable
    scripts:
      - name: Set up keystore
        script: echo $FCI_KEYSTORE_FILE | base64 --decode > $KEYSTORE_PATH
      - name: Build AAB
        script: flutter build appbundle --release
    artifacts:
      - build/app/outputs/bundle/release/app-release.aab
    publishing:
      google_play:
        credentials: Encrypted(...) # Google Play API 키
        track: internal # 또는 alpha, beta, production

  ios-workflow:
    name: iOS Release
    environment:
      flutter: stable
      xcode: latest
      cocoapods: default
    scripts:
      - name: Build iOS
        script: flutter build ios --release --no-codesign
      - name: Set up code signing
        script: |
          keychain initialize
          app-store-connect fetch-signing-files $(BUNDLE_ID) --type IOS_APP_STORE
          keychain add-certificates
          xcode-project use-profiles
      - name: Build IPA
        script: xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        api_key: Encrypted(...) # App Store Connect API 키
        submit_to_testflight: true
```

## 배포 관련 팁

### 앱 크기 최적화

- 사용하지 않는 리소스 제거
- 이미지 최적화 및 압축
- ProGuard/R8 활성화 (Android)

### 버전 관리 전략

Semantic Versioning(SemVer) 규칙을 따르는 것이 좋습니다:

- `MAJOR.MINOR.PATCH+BUILD_NUMBER`
  - MAJOR: 호환되지 않는 API 변경
  - MINOR: 호환되는 기능 추가
  - PATCH: 버그 수정
  - BUILD_NUMBER: 앱 스토어용 빌드 번호 (매 배포마다 증가)

### 단계적 출시

대규모 업데이트는 단계적으로 출시하는 것이 좋습니다:

1. 내부 테스트 → 2. 알파/베타 테스트 → 3. 제한된 사용자 그룹 → 4. 전체 출시

## Flutter 배포 관련 자주 묻는 질문

### Q: 앱이 너무 큰데 어떻게 크기를 줄일 수 있나요?

A: `flutter build apk --split-per-abi`로 ABI별 분할, 미사용 리소스 제거, 이미지 최적화, 코드 축소(R8/ProGuard) 활성화 등을 시도해보세요.

### Q: 앱이 심사에서 거부됐어요. 어떻게 해야 하나요?

A: 거부 사유를 주의 깊게 읽고, 해당 문제를 수정한 후 재제출하세요. 명확하지 않은 경우 Apple/Google의 개발자 지원에 문의하세요.

### Q: iOS와 Android 배포 중 어떤 것을 먼저 해야 하나요?

A: 일반적으로 iOS 심사가 더 오래 걸리므로 iOS를 먼저 제출하고, 이후 Android를 제출하는 것이 효율적입니다.

## 결론

앱 배포는 Flutter 개발 과정의 중요한 마무리 단계입니다. 이 가이드를 통해 Android와 iOS 플랫폼에 앱을 성공적으로 배포하는 전체 과정을 이해할 수 있습니다. 각 플랫폼의 요구사항과 프로세스를 잘 파악하고, CI/CD 도구를 활용하면 효율적이고 안정적인 배포가 가능합니다.
