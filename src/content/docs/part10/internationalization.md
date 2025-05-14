---
title: 다국어 지원
---

글로벌 시장에서 앱의 경쟁력을 높이기 위해서는 다양한 언어와 지역 설정을 지원하는 것이 중요합니다. Flutter는 `flutter_localizations` 패키지와 `intl` 패키지를 통해 앱의 다국어 처리(internationalization)와 지역화(localization)를 지원합니다.

## 다국어 처리의 중요성


사용자의 언어로 앱을 제공하면 다음과 같은 장점이 있습니다:

1. **확장된 사용자 기반**: 더 많은 국가와 지역의 사용자에게 다가갈 수 있습니다.
2. **향상된 사용자 경험**: 사용자는 자신의 모국어로 앱을 사용할 때 더 편안함을 느낍니다.
3. **법적 요구사항 충족**: 일부 국가에서는 특정 유형의 앱에 현지어 지원을 요구합니다.
4. **경쟁 우위**: 다국어를 지원하는 앱은 그렇지 않은 앱보다 경쟁 우위를 가질 수 있습니다.

## Flutter 다국어 처리 기본 설정

### 1. 필요한 패키지 추가

`pubspec.yaml` 파일에 필요한 패키지를 추가합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: ^0.17.0

flutter:
  generate: true
```

`generate: true`는 Flutter에게 `l10n.yaml` 파일을 기반으로 지역화 파일을 생성하도록 지시합니다.

### 2. l10n.yaml 파일 생성

프로젝트 루트 디렉토리에 `l10n.yaml` 파일을 생성합니다:

```yaml
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
```

### 3. ARB 파일 생성

`lib/l10n` 디렉토리를 생성하고 기본 언어(영어) ARB 파일을 작성합니다:

```json
// lib/l10n/app_en.arb
{
  "helloWorld": "Hello World",
  "@helloWorld": {
    "description": "The conventional greeting"
  },
  "hello": "Hello {username}",
  "@hello": {
    "description": "A welcome message",
    "placeholders": {
      "username": {
        "type": "String",
        "example": "Bob"
      }
    }
  },
  "itemCount": "{count, plural, =0{No items} =1{1 item} other{{count} items}}",
  "@itemCount": {
    "description": "A plural message",
    "placeholders": {
      "count": {
        "type": "int",
        "format": "compact"
      }
    }
  }
}
```

이제 다른 언어에 대한 ARB 파일도 생성합니다:

```json
// lib/l10n/app_ko.arb
{
  "helloWorld": "안녕 세상",
  "hello": "{username}님 안녕하세요",
  "itemCount": "{count, plural, =0{항목 없음} =1{1개 항목} other{{count}개 항목}}"
}
```

```json
// lib/l10n/app_ja.arb
{
  "helloWorld": "こんにちは世界",
  "hello": "こんにちは、{username}さん",
  "itemCount": "{count, plural, =0{アイテムなし} =1{1 アイテム} other{{count} アイテム}}"
}
```

### 4. 앱에 지역화 대리자 설정

```dart
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      // 지원하는 언어 목록
      supportedLocales: AppLocalizations.supportedLocales,
      // 지역화 대리자
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      // 사용자 기기의 언어 설정을 따름
      localeResolutionCallback: (locale, supportedLocales) {
        for (var supportedLocale in supportedLocales) {
          if (supportedLocale.languageCode == locale?.languageCode &&
              supportedLocale.countryCode == locale?.countryCode) {
            return supportedLocale;
          }
        }
        // 지원하지 않는 언어의 경우 첫 번째 언어로 대체
        return supportedLocales.first;
      },
      home: const MyHomePage(),
    );
  }
}
```

### 5. 지역화된 문자열 사용

```dart
class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.helloWorld),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(localizations.hello('Flutter 사용자')),
            const SizedBox(height: 16),
            Text(localizations.itemCount(5)),
          ],
        ),
      ),
    );
  }
}
```

## 날짜, 시간, 숫자 형식화

`intl` 패키지를 사용하여 날짜, 시간, 숫자 등을 현지화된 형식으로 표시할 수 있습니다.

### 1. 날짜 및 시간 형식화

```dart
import 'package:intl/intl.dart';

class DateTimeFormatExample extends StatelessWidget {
  const DateTimeFormatExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();

    // 현재 로케일에 따른 날짜 형식
    final dateFormat = DateFormat.yMMMMd(Localizations.localeOf(context).toString());
    final timeFormat = DateFormat.jms(Localizations.localeOf(context).toString());

    return Column(
      children: [
        Text('날짜: ${dateFormat.format(now)}'),
        Text('시간: ${timeFormat.format(now)}'),
      ],
    );
  }
}
```

### 2. 숫자 형식화

```dart
import 'package:intl/intl.dart';

class NumberFormatExample extends StatelessWidget {
  const NumberFormatExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context).toString();
    final number = 1234567.89;

    // 일반 숫자 형식
    final numberFormat = NumberFormat.decimalPattern(locale);
    // 통화 형식
    final currencyFormat = NumberFormat.currency(
      locale: locale,
      symbol: '₩', // 한국 원화 기호
    );
    // 백분율 형식
    final percentFormat = NumberFormat.percentPattern(locale);

    return Column(
      children: [
        Text('숫자: ${numberFormat.format(number)}'),
        Text('통화: ${currencyFormat.format(number)}'),
        Text('백분율: ${percentFormat.format(number / 100)}'),
      ],
    );
  }
}
```

## 언어 선택 기능 구현

사용자가 앱 내에서 언어를 변경할 수 있도록 하려면 `Provider` 또는 `Riverpod`을 사용하여 언어 설정을 관리할 수 있습니다.

### 1. 언어 설정 상태 관리 (Riverpod 사용)

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';

// 언어 설정을 저장하기 위한 키
const String languagePreferenceKey = 'language_code';

// 로케일 상태를 관리하는 프로바이더
@riverpod
class LocaleNotifier extends _$LocaleNotifier {
  @override
  Locale build() {
    // 기본값으로 디바이스 로케일 또는 영어 사용
    return const Locale('en');
  }

  // 앱 초기화 시 저장된 언어 설정 불러오기
  Future<void> loadSavedLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final languageCode = prefs.getString(languagePreferenceKey);

    if (languageCode != null) {
      state = Locale(languageCode);
    }
  }

  // 언어 변경 함수
  Future<void> setLocale(String languageCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(languagePreferenceKey, languageCode);

    state = Locale(languageCode);
  }
}
```

### 2. 앱에 언어 설정 적용

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 현재 로케일 가져오기
    final locale = ref.watch(localeNotifierProvider);

    // 앱 시작 시 저장된 로케일 불러오기
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(localeNotifierProvider.notifier).loadSavedLocale();
    });

    return MaterialApp(
      title: 'Flutter Demo',
      // 현재 선택된 로케일 적용
      locale: locale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const LanguageSelectionPage(),
    );
  }
}
```

### 3. 언어 선택 페이지

```dart
class LanguageSelectionPage extends ConsumerWidget {
  const LanguageSelectionPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final localizations = AppLocalizations.of(context)!;
    final currentLocale = ref.watch(localeNotifierProvider);

    // 지원하는 언어 목록
    final supportedLanguages = [
      {'code': 'en', 'name': 'English'},
      {'code': 'ko', 'name': '한국어'},
      {'code': 'ja', 'name': '日本語'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.helloWorld),
      ),
      body: ListView.builder(
        itemCount: supportedLanguages.length,
        itemBuilder: (context, index) {
          final language = supportedLanguages[index];
          final isSelected = currentLocale.languageCode == language['code'];

          return ListTile(
            title: Text(language['name']!),
            trailing: isSelected ? const Icon(Icons.check) : null,
            onTap: () {
              ref.read(localeNotifierProvider.notifier)
                 .setLocale(language['code']!);
            },
          );
        },
      ),
    );
  }
}
```

## 리소스 지역화

텍스트 외에도 이미지, 아이콘 등의 리소스도 지역화할 수 있습니다.

### 1. 이미지 지역화

```dart
// 로케일에 따라 다른 이미지 로드
class LocalizedImage extends StatelessWidget {
  const LocalizedImage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context);

    // 언어 코드에 따라 다른 이미지 경로 반환
    String getLocalizedImagePath() {
      switch (locale.languageCode) {
        case 'ko':
          return 'assets/images/banner_ko.png';
        case 'ja':
          return 'assets/images/banner_ja.png';
        default:
          return 'assets/images/banner_en.png';
      }
    }

    return Image.asset(getLocalizedImagePath());
  }
}
```

## 양방향 텍스트 지원 (RTL/LTR)

아랍어나 히브리어와 같은 오른쪽에서 왼쪽으로 쓰는 언어(RTL)를 지원해야 할 경우 고려해야 할 사항입니다.

```dart
// MaterialApp 설정
MaterialApp(
  // RTL 언어 지원
  supportedLocales: const [
    Locale('en'), // 영어 (LTR)
    Locale('ko'), // 한국어 (LTR)
    Locale('ar'), // 아랍어 (RTL)
    Locale('he'), // 히브리어 (RTL)
  ],
)

// RTL/LTR을 고려한 UI 구성
class BidirectionalAwareWidget extends StatelessWidget {
  const BidirectionalAwareWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 현재 텍스트 방향 확인
    final isRTL = Directionality.of(context) == TextDirection.rtl;

    return Row(
      children: [
        // RTL에서는 아이콘과 텍스트 순서가 반대가 됨
        if (!isRTL) const Icon(Icons.arrow_back),
        const SizedBox(width: 8),
        const Text('뒤로 가기'),
        if (isRTL) const Icon(Icons.arrow_back),
      ],
    );
  }
}
```

## 다국어 앱 테스트

다국어 앱을 효과적으로 테스트하려면 다음 사항을 고려해야 합니다:

1. **모든 지원 언어 테스트**: 각 지원 언어로 앱을 실행하고 모든 화면을 확인합니다.
2. **자동 테스트 작성**: 주요 언어 전환 기능에 대한 위젯 테스트를 작성합니다.
3. **텍스트 오버플로우 확인**: 같은 문장이라도 언어에 따라 길이가 다를 수 있습니다.
4. **문화적 고려사항 테스트**: 날짜, 시간, 숫자 형식 등이 각 문화권에 맞게 표시되는지 확인합니다.

```dart
// 위젯 테스트 예시
testWidgets('지원하는 모든 언어로 앱을 렌더링할 수 있어야 함', (WidgetTester tester) async {
  for (final locale in AppLocalizations.supportedLocales) {
    await tester.pumpWidget(
      MaterialApp(
        locale: locale,
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        home: const MyHomePage(),
      ),
    );

    // 번역된 문자열이 올바르게 표시되는지 확인
    expect(find.byType(MyHomePage), findsOneWidget);
    await expectLater(find.byType(MyHomePage), matchesGoldenFile('home_page_${locale.languageCode}.png'));
  }
});
```

## 다국어 처리 모범 사례

### 1. 번역 키 구성

```json
// 좋은 예시: 명확한 키와 컨텍스트
{
  "auth.login.button": "로그인",
  "auth.login.email.label": "이메일",
  "auth.login.password.label": "비밀번호",
  "feed.empty.message": "표시할 게시물이 없습니다"
}

// 피해야 할 예시: 모호한 키
{
  "login": "로그인",
  "email": "이메일",
  "password": "비밀번호",
  "empty": "표시할 게시물이 없습니다"
}
```

### 2. 복수형 처리

```dart
// 복수형 처리 예시
String getItemText(int count) {
  return localizations.itemCount(count);
}

// ARB 파일 설정
// app_en.arb
{
  "itemCount": "{count, plural, =0{No items} =1{1 item} other{{count} items}}",
  "@itemCount": {
    "description": "A plural message",
    "placeholders": {
      "count": {
        "type": "int"
      }
    }
  }
}

// app_ko.arb
{
  "itemCount": "{count, plural, =0{항목 없음} =1{1개 항목} other{{count}개 항목}}"
}
```

### 3. 문맥 제공

```dart
// ARB 파일에 문맥 추가
{
  "save": "저장",
  "@save": {
    "description": "General action to save current changes"
  },

  "save_photo": "저장",
  "@save_photo": {
    "description": "Button to save a photo to gallery"
  }
}
```

### 4. 하드코딩 피하기

```dart
// 잘못된 예시: 하드코딩된 문자열
Text('로그인');

// 올바른 예시: 번역 사용
Text(localizations.login);
```

## 결론

Flutter에서 다국어 처리는 앱의 글로벌 도달 범위를 확장하는 중요한 기능입니다. `flutter_localizations`와 `intl` 패키지를 사용하면 앱을 여러 언어로 쉽게 제공할 수 있으며, 사용자에게 더 나은 경험을 제공할 수 있습니다.

효과적인 다국어 처리를 위해서는 초기 단계부터 국제화를 고려한 설계가 중요하며, 번역 키의 체계적인 관리, 복수형 처리, 문맥 제공 등의 모범 사례를 따라야 합니다.

다음 장에서는 Flutter 앱의 성능을 최적화하는 방법에 대해 알아보겠습니다.
