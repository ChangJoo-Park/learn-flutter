---
title: Codemagic을 활용한 CI/CD 구성
---

Flutter 앱 개발에서 지속적 통합(CI) 및 지속적 배포(CD)는 개발 및 배포 과정을 자동화하여 효율성을 높이고 오류를 줄이는 중요한 요소입니다. Codemagic은 Flutter 앱에 특화된 CI/CD 플랫폼으로, 쉽게 구성하고 사용할 수 있습니다.

## CI/CD 개요

CI/CD는 개발 워크플로우를 개선하기 위한 방법론입니다:

- **지속적 통합(CI)**: 개발자가 코드 변경사항을 주기적으로 통합하고, 자동화된 빌드와 테스트를 통해 빠르게 문제를 발견하는 방식
- **지속적 배포(CD)**: 빌드와 테스트를 통과한 코드를 자동으로 배포 환경에 릴리스하는 방식

## Codemagic 소개

Codemagic은 Flutter 앱 개발을 위해 설계된 CI/CD 플랫폼으로, 다음과 같은 특징을 제공합니다:

- Flutter 전용 빌드 환경
- 다양한 플랫폼(iOS, Android, Web, macOS) 지원
- 간편한 설정과 직관적인 UI
- 자동 버전 관리
- 앱스토어 및 구글 플레이 스토어 자동 배포
- TestFlight, Firebase App Distribution 등 통합
- 빌드 알림(이메일, Slack)

## Codemagic 설정 방법

### 1. 계정 생성 및 프로젝트 연결

1. [Codemagic 웹사이트](https://codemagic.io/signup)에서 계정 생성
2. GitHub, GitLab, Bitbucket 등 코드 리포지토리 연결
3. Flutter 프로젝트 선택

### 2. 빌드 설정 방법

Codemagic에서는 두 가지 방법으로 빌드를 설정할 수 있습니다:

1. **UI를 통한 설정**: 웹 인터페이스에서 직관적으로 설정
2. **YAML 파일을 통한 설정**: `codemagic.yaml` 파일로 빌드 파이프라인 정의

### UI를 통한 설정

1. 프로젝트 선택 후 "Start your first build" 클릭
2. 빌드 설정 구성:
   - 빌드할 플랫폼 선택 (iOS / Android / Web)
   - Flutter 버전 선택
   - 빌드 트리거 설정 (브랜치, 태그 등)
   - 환경 변수 설정
   - 빌드 스크립트 설정
3. "Start new build" 클릭하여 빌드 시작

### YAML 파일을 통한 설정

프로젝트 루트에 `codemagic.yaml` 파일을 생성합니다:

```yaml
workflows:
  flutter-app:
    name: Flutter App
    environment:
      flutter: stable
      xcode: latest
      cocoapods: default
    cache:
      cache_paths:
        - ~/.pub-cache
        - pubspec.lock
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: "main"
          include: true
    scripts:
      - name: Flutter analyze
        script: flutter analyze
      - name: Flutter test
        script: flutter test
      - name: Build iOS
        script: |
          flutter build ios --release --no-codesign
      - name: Build Android
        script: |
          flutter build appbundle --release
    artifacts:
      - build/ios/ipa/*.ipa
      - build/app/outputs/bundle/release/app-release.aab
```

## 기본 CI/CD 워크플로우 구성

일반적인 Flutter 앱의 CI/CD 워크플로우는 다음과 같습니다:

### 1. 코드 검증 단계

```yaml
scripts:
  - name: Flutter analyze
    script: flutter analyze
  - name: Flutter format check
    script: flutter format --set-exit-if-changed .
  - name: Flutter test
    script: flutter test
```

### 2. 빌드 단계 (Android)

```yaml
scripts:
  - name: Build Android
    script: |
      flutter build apk --release
      flutter build appbundle --release
artifacts:
  - build/app/outputs/flutter-apk/app-release.apk
  - build/app/outputs/bundle/release/app-release.aab
```

### 3. 빌드 단계 (iOS)

```yaml
scripts:
  - name: Set up code signing
    script: |
      echo $IOS_CERTIFICATE | base64 --decode > certificate.p12
      keychain add-certificates --certificate certificate.p12 --password $CERTIFICATE_PASSWORD
      app-store-connect fetch-signing-files $(BUNDLE_ID) --type IOS_APP_STORE --create
      keychain use-signing-files
  - name: Build iOS
    script: |
      flutter build ios --release
      cd ios
      xcodebuild -workspace Runner.xcworkspace -scheme Runner -configuration Release archive -archivePath Runner.xcarchive
      xcodebuild -exportArchive -archivePath Runner.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath ./build
artifacts:
  - build/ios/ipa/*.ipa
```

### 4. 배포 단계

```yaml
publishing:
  app_store_connect:
    api_key: $APP_STORE_CONNECT_PRIVATE_KEY
    key_id: $APP_STORE_CONNECT_KEY_ID
    issuer_id: $APP_STORE_CONNECT_ISSUER_ID
    submit_to_testflight: true
  google_play:
    credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
    track: internal # 또는 alpha, beta, production
```

## 환경별 빌드 구성 (Flavors)

개발, 스테이징, 프로덕션 등 다양한 환경에 맞춰 빌드를 구성할 수 있습니다:

```yaml
workflows:
  development:
    name: Development Build
    environment:
      flutter: stable
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: "develop"
          include: true
    scripts:
      - name: Build Development
        script: flutter build apk --flavor development --target lib/main_development.dart

  staging:
    name: Staging Build
    environment:
      flutter: stable
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: "staging"
          include: true
    scripts:
      - name: Build Staging
        script: flutter build apk --flavor staging --target lib/main_staging.dart

  production:
    name: Production Build
    environment:
      flutter: stable
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: "main"
          include: true
      tag_patterns:
        - pattern: "v*.*.*"
          include: true
    scripts:
      - name: Build Production
        script: flutter build apk --flavor production --target lib/main_production.dart
```

## 환경 변수 및 보안

Codemagic에서는 다음과 같은 방법으로 보안 정보를 관리할 수 있습니다:

### 1. 웹 인터페이스를 통한 환경 변수 설정

1. 프로젝트 설정 > Environment variables 섹션
2. 변수 이름과 값 입력
3. 보안이 필요한 경우 "Secure" 옵션 선택

### 2. YAML 파일에서 환경 변수 참조

```yaml
environment:
  vars:
    APP_ID: com.example.myapp
  flutter: stable
scripts:
  - name: Use environment variable
    script: echo "Building app with ID: $APP_ID"
```

### 3. 암호화된 파일 사용

iOS 인증서나 Google Play 서비스 계정 키와 같은 파일은 암호화하여 사용할 수 있습니다:

```yaml
environment:
  vars:
    ENCRYPTED_KEYSTORE_FILE: Encrypted(...)
scripts:
  - name: Decode keystore
    script: echo $ENCRYPTED_KEYSTORE_FILE | base64 --decode > keystore.jks
```

## 실전 활용 예제

### 예제 1: PR 검증 워크플로우

Pull Request가 생성될 때 코드 품질을 검증하는 워크플로우:

```yaml
workflows:
  pull-request-checks:
    name: Pull Request Checks
    instance_type: mac_mini_m1
    max_build_duration: 30
    environment:
      flutter: stable
    triggering:
      events:
        - pull_request
    scripts:
      - name: Get Flutter packages
        script: flutter pub get
      - name: Flutter analyze
        script: flutter analyze
      - name: Flutter format check
        script: flutter format --dry-run --set-exit-if-changed .
      - name: Flutter test
        script: flutter test --coverage
      - name: Upload coverage reports
        script: |
          # 코드 커버리지 보고서 업로드 스크립트
          bash <(curl -s https://codecov.io/bash)
```

### 예제 2: 완전한 Android 빌드 및 배포 워크플로우

Android 앱을 빌드하고 Google Play에 배포하는 워크플로우:

```yaml
workflows:
  android-workflow:
    name: Android Release
    instance_type: linux
    max_build_duration: 60
    environment:
      android_signing:
        - keystore_reference
      vars:
        PACKAGE_NAME: "com.example.myapp"
        GOOGLE_PLAY_TRACK: internal
      flutter: stable
    triggering:
      events:
        - tag
      tag_patterns:
        - pattern: "v*.*.*"
          include: true
    scripts:
      - name: Set up build number
        script: |
          # 태그에서 버전 추출
          VERSION=$(echo $CM_TAG | cut -d'v' -f2)
          # pubspec.yaml 파일 업데이트
          sed -i "s/version: .*/version: $VERSION/" pubspec.yaml

      - name: Flutter test
        script: flutter test

      - name: Build AAB
        script: |
          flutter build appbundle \
            --release \
            --build-number=$(($(date +%s) / 60))

    artifacts:
      - build/app/outputs/bundle/release/app-release.aab

    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT
        track: $GOOGLE_PLAY_TRACK
        submit_as_draft: false
```

### 예제 3: iOS 및 Android 동시 빌드

iOS와 Android 앱을 동시에 빌드하고 배포하는 워크플로우:

```yaml
workflows:
  ios-android-release:
    name: iOS & Android Release
    instance_type: mac_mini_m1
    max_build_duration: 120
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.myapp
      flutter: stable
    triggering:
      events:
        - tag
      tag_patterns:
        - pattern: "v*.*.*"
          include: true
    scripts:
      - name: Set build number
        script: |
          BUILD_NUMBER=$(($(date +%s) / 60))
          echo "Build number: $BUILD_NUMBER"

      - name: Flutter build iOS
        script: |
          flutter build ios --release \
            --build-number=$BUILD_NUMBER \
            --no-codesign

      - name: Flutter build Android
        script: |
          flutter build appbundle --release \
            --build-number=$BUILD_NUMBER

      - name: iOS code signing and packaging
        script: |
          cd ios
          xcode-project use-profiles
          xcode-project build-ipa \
            --workspace Runner.xcworkspace \
            --scheme Runner

    artifacts:
      - build/ios/ipa/*.ipa
      - build/app/outputs/bundle/release/app-release.aab
      - flutter_drive.log

    publishing:
      app_store_connect:
        api_key: $APP_STORE_CONNECT_KEY
        submit_to_testflight: true
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT
        track: internal
```

## 빌드 성능 최적화 팁

Codemagic에서 빌드 시간을 단축하기 위한 팁:

1. **캐싱 활용**:

   ```yaml
   cache:
     cache_paths:
       - ~/.pub-cache
       - ~/.gradle
       - ~/.cocoapods
   ```

2. **불필요한 스크립트 제거**:
   테스트나 분석이 필요 없는 릴리스 빌드에서는 해당 스크립트 제거

3. **적절한 인스턴스 유형 선택**:

   ```yaml
   workflows:
     my-workflow:
       instance_type: mac_mini_m1 # 더 빠른 M1 인스턴스 사용
   ```

4. **병렬 실행 활용**:
   ```yaml
   scripts:
     - name: Parallel jobs
       script: |
         flutter analyze &
         flutter test &
         wait  # 모든 백그라운드 작업이 완료될 때까지 대기
   ```

## 테스트 자동화 및 품질 관리

### 코드 커버리지 보고

```yaml
scripts:
  - name: Run tests with coverage
    script: |
      flutter test --coverage
      lcov --remove coverage/lcov.info '**/*.g.dart' '**/*.freezed.dart' -o coverage/lcov.info
      genhtml coverage/lcov.info -o coverage/html
artifacts:
  - coverage/html/**
```

### 통합 테스트

```yaml
scripts:
  - name: Integration tests
    script: |
      # 에뮬레이터 시작
      flutter emulators --launch flutter_emulator

      # 통합 테스트 실행
      flutter drive \
        --driver=test_driver/integration_test.dart \
        --target=integration_test/app_test.dart \
        -d flutter_emulator
```

## 결론

Codemagic은 Flutter 앱 개발을 위한 강력한 CI/CD 도구로, 다양한 기능과 유연한 설정으로 개발 및 배포 과정을 효율적으로 자동화할 수 있습니다. 이 가이드에서 소개한 설정과 예제를 활용하여 프로젝트에 맞는 CI/CD 파이프라인을 구축하면 개발 생산성을 크게 향상시킬 수 있습니다.

기본적인 검증 및 빌드 자동화부터 시작해서, 점진적으로 배포 자동화, 테스트 자동화, 품질 관리 등을 추가하며 워크플로우를 개선하는 것이 좋은 접근 방식입니다.
