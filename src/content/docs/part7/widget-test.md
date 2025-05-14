---
title: 위젯 테스트
---

단위 테스트가 개별 함수나 클래스의 동작을 검증하는 것이라면, 위젯 테스트는 Flutter 위젯의 렌더링과 상호작용을 검증합니다. 이 장에서는 Flutter에서 위젯 테스트를 작성하고 실행하는 방법을 알아보겠습니다.

## 위젯 테스트의 필요성

위젯 테스트를 작성해야 하는 이유는 다음과 같습니다:

1. **UI 일관성 보장**: 변경 사항이 위젯의 외관과 동작에 미치는 영향을 검증합니다.
2. **사용자 상호작용 검증**: 탭, 슬라이드, 스크롤 등 사용자 상호작용이 예상대로 작동하는지 확인합니다.
3. **상태 관리 테스트**: 위젯의 상태 변경이 UI에 올바르게 반영되는지 검증합니다.
4. **통합 검증**: 여러 위젯이 함께 작동할 때의 동작을 검증합니다.
5. **회귀 방지**: UI 변경이 기존 기능을 손상시키지 않는지 확인합니다.

## 위젯 테스트 설정

위젯 테스트는 `flutter_test` 패키지를 사용하며, 이 패키지는 Flutter SDK에 기본으로 포함되어 있습니다. `pubspec.yaml` 파일에 다음과 같이 의존성이 포함되어 있어야 합니다:

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
```

## 기본 위젯 테스트 작성하기

간단한 위젯 테스트 예제를 살펴보겠습니다. 다음은 테스트할 간단한 카운터 앱 위젯입니다:

```dart
// lib/widgets/counter.dart
import 'package:flutter/material.dart';

class Counter extends StatefulWidget {
  const Counter({Key? key}) : super(key: key);

  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text(
          'Counter Value:',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        Text(
          '$_count',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        ElevatedButton(
          onPressed: _increment,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

이제 이 `Counter` 위젯을 테스트하는 코드를 작성해 보겠습니다:

```dart
// test/widgets/counter_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/widgets/counter.dart';

void main() {
  testWidgets('Counter increments when button is pressed', (WidgetTester tester) async {
    // 위젯 렌더링
    await tester.pumpWidget(const MaterialApp(
      home: Scaffold(
        body: Counter(),
      ),
    ));

    // 초기 상태 확인: 카운터 값이 0인지 확인
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // 버튼 찾기 및 탭 동작 수행
    await tester.tap(find.byType(ElevatedButton));

    // 위젯 리빌드
    await tester.pump();

    // 변경된 상태 확인: 카운터 값이 1로 증가했는지 확인
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

### 중요한 단계 설명

1. **위젯 펌핑(Pumping)**:

   - `await tester.pumpWidget()`: 테스트 환경에 위젯을 렌더링합니다.
   - `await tester.pump()`: 위젯을 리빌드합니다(상태 변경 후 UI 업데이트).

2. **위젯 찾기(Finding)**:

   - `find.text()`: 특정 텍스트를 포함한 위젯을 찾습니다.
   - `find.byType()`: 특정 타입의 위젯을 찾습니다.
   - `find.byKey()`: 특정 키를 가진 위젯을 찾습니다.

3. **상호작용(Interaction)**:

   - `await tester.tap()`: 위젯을 탭합니다.
   - `await tester.drag()`: 드래그 동작을 수행합니다.
   - `await tester.enterText()`: 텍스트 필드에 텍스트를 입력합니다.

4. **검증(Verification)**:
   - `expect(finder, matcher)`: 찾은 위젯이 예상한 상태인지 확인합니다.
   - 일반적인 matcher: `findsOneWidget`, `findsNothing`, `findsNWidgets(n)` 등

## 다양한 위젯 테스트 기법

### 1. 텍스트 입력 테스트

```dart
testWidgets('TextField updates when text is entered', (WidgetTester tester) async {
  final textFieldKey = Key('my-textfield');

  await tester.pumpWidget(MaterialApp(
    home: Scaffold(
      body: TextField(key: textFieldKey),
    ),
  ));

  // 텍스트 입력
  await tester.enterText(find.byKey(textFieldKey), '안녕하세요');
  await tester.pump();

  // 입력된 텍스트 확인
  expect(find.text('안녕하세요'), findsOneWidget);
});
```

### 2. 스크롤 테스트

```dart
testWidgets('ListView can be scrolled', (WidgetTester tester) async {
  await tester.pumpWidget(MaterialApp(
    home: Scaffold(
      body: ListView.builder(
        itemCount: 100,
        itemBuilder: (context, index) => ListTile(
          title: Text('항목 $index'),
        ),
      ),
    ),
  ));

  // 항목 50은 처음에는 화면에 보이지 않음
  expect(find.text('항목 50'), findsNothing);

  // 아래로 스크롤
  await tester.dragUntilVisible(
    find.text('항목 50'),
    find.byType(ListView),
    Offset(0, -500), // 위쪽으로 드래그
  );

  // 스크롤 후 항목 50이 화면에 보임
  expect(find.text('항목 50'), findsOneWidget);
});
```

### 3. 탭과 제스처 테스트

```dart
testWidgets('GestureDetector responds to tap', (WidgetTester tester) async {
  bool tapped = false;

  await tester.pumpWidget(MaterialApp(
    home: Scaffold(
      body: GestureDetector(
        onTap: () {
          tapped = true;
        },
        child: Container(
          width: 100,
          height: 100,
          color: Colors.blue,
        ),
      ),
    ),
  ));

  // 초기 상태
  expect(tapped, false);

  // 탭 수행
  await tester.tap(find.byType(Container));

  // 탭 후 상태
  expect(tapped, true);
});
```

### 4. 애니메이션 테스트

```dart
testWidgets('Animation completes correctly', (WidgetTester tester) async {
  await tester.pumpWidget(MaterialApp(
    home: MyAnimatedWidget(),
  ));

  // 애니메이션 시작 전 상태 확인
  final initialTransform = tester.widget<Transform>(find.byType(Transform)).transform;

  // 애니메이션 트리거
  await tester.tap(find.byType(ElevatedButton));

  // 애니메이션의 중간 프레임 확인 (300ms)
  await tester.pump(Duration(milliseconds: 300));

  // 애니메이션 완료까지 기다림
  await tester.pumpAndSettle();

  // 애니메이션 완료 후 상태 확인
  final finalTransform = tester.widget<Transform>(find.byType(Transform)).transform;

  // 초기값과 최종값이 다른지 확인
  expect(initialTransform, isNot(equals(finalTransform)));
});
```

### 5. 네비게이션 테스트

```dart
testWidgets('Navigation works correctly', (WidgetTester tester) async {
  await tester.pumpWidget(MaterialApp(
    routes: {
      '/': (context) => HomeScreen(),
      '/details': (context) => DetailScreen(),
    },
  ));

  // 홈 화면에서 시작
  expect(find.text('홈 화면'), findsOneWidget);
  expect(find.text('상세 화면'), findsNothing);

  // 상세 버튼 탭
  await tester.tap(find.byType(ElevatedButton));
  await tester.pumpAndSettle(); // 화면 전환 애니메이션 완료까지 기다림

  // 상세 화면으로 이동했는지 확인
  expect(find.text('홈 화면'), findsNothing);
  expect(find.text('상세 화면'), findsOneWidget);
});
```

## StatefulWidget 테스트

StatefulWidget의 경우 내부 상태와 라이프사이클 메서드를 테스트해야 할 수 있습니다:

```dart
testWidgets('StatefulWidget lifecycle and state updates', (WidgetTester tester) async {
  final myWidgetKey = GlobalKey<MyWidgetState>();

  await tester.pumpWidget(MaterialApp(
    home: MyWidget(key: myWidgetKey),
  ));

  // 직접 상태에 접근
  final state = myWidgetKey.currentState!;

  // 초기 상태 확인
  expect(state.counter, 0);

  // 상태 업데이트 메서드 호출
  state.incrementCounter();
  await tester.pump();

  // 업데이트된 상태 확인
  expect(state.counter, 1);
  expect(find.text('1'), findsOneWidget);
});
```

## 임의의 시간이 지난 후 상태 테스트

일정 시간이 지난 후 위젯 상태를 확인하고 싶을 때는 `pump`와 `pumpAndSettle` 메서드를 활용합니다:

```dart
testWidgets('Timer updates UI after delay', (WidgetTester tester) async {
  await tester.pumpWidget(MaterialApp(
    home: TimerWidget(),
  ));

  // 초기 상태
  expect(find.text('대기 중...'), findsOneWidget);

  // 3초 경과를 시뮬레이션
  await tester.pump(Duration(seconds: 3));

  // 업데이트된 상태
  expect(find.text('완료!'), findsOneWidget);
});
```

## 비동기 작업 테스트

API 호출과 같은 비동기 작업을 포함하는 위젯을 테스트하려면 모킹(mocking)을 사용해야 합니다:

```dart
testWidgets('Widget loads data from API', (WidgetTester tester) async {
  // Mock API 서비스 설정
  final mockService = MockApiService();
  when(mockService.fetchData()).thenAnswer((_) async => {'name': '홍길동'});

  await tester.pumpWidget(MaterialApp(
    home: DataWidget(apiService: mockService),
  ));

  // 초기 로딩 상태
  expect(find.byType(CircularProgressIndicator), findsOneWidget);

  // 데이터 로딩 완료를 기다림
  await tester.pumpAndSettle();

  // 로딩된 데이터 확인
  expect(find.text('홍길동'), findsOneWidget);
});
```

## 테스트 그룹화 및 셋업

관련 테스트를 그룹화하고 공통 설정을 추출할 수 있습니다:

```dart
void main() {
  group('Counter Widget Tests', () {
    late Widget testWidget;

    setUp(() {
      testWidget = MaterialApp(
        home: Scaffold(
          body: Counter(),
        ),
      );
    });

    testWidgets('renders initial state correctly', (WidgetTester tester) async {
      await tester.pumpWidget(testWidget);
      expect(find.text('0'), findsOneWidget);
    });

    testWidgets('increments counter when button is pressed', (WidgetTester tester) async {
      await tester.pumpWidget(testWidget);
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      expect(find.text('1'), findsOneWidget);
    });
  });
}
```

## 테스트에서 키 활용하기

테스트에서 위젯을 더 쉽게 찾기 위해 위젯에 키(Key)를 할당하는 것이 좋습니다:

```dart
// lib/screens/login_screen.dart
class LoginScreen extends StatelessWidget {
  // 키 상수 정의
  static const kEmailFieldKey = Key('email-field');
  static const kPasswordFieldKey = Key('password-field');
  static const kLoginButtonKey = Key('login-button');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          TextField(key: kEmailFieldKey, decoration: InputDecoration(labelText: 'Email')),
          TextField(key: kPasswordFieldKey, decoration: InputDecoration(labelText: 'Password')),
          ElevatedButton(
            key: kLoginButtonKey,
            onPressed: () {},
            child: Text('Login'),
          ),
        ],
      ),
    );
  }
}

// test/screens/login_screen_test.dart
testWidgets('Login form submits with email and password', (WidgetTester tester) async {
  await tester.pumpWidget(MaterialApp(home: LoginScreen()));

  // 키를 사용하여 위젯 찾기
  await tester.enterText(find.byKey(LoginScreen.kEmailFieldKey), 'user@example.com');
  await tester.enterText(find.byKey(LoginScreen.kPasswordFieldKey), 'password123');
  await tester.tap(find.byKey(LoginScreen.kLoginButtonKey));
  await tester.pump();

  // 검증 로직...
});
```

## 골든 테스트 (시각적 회귀 테스트)

골든 테스트는 위젯의 외관이 예상과 일치하는지 확인하는 테스트입니다:

```dart
testWidgets('MyWidget looks correct', (WidgetTester tester) async {
  await tester.pumpWidget(MaterialApp(
    theme: ThemeData.light(),
    home: MyWidget(),
  ));

  await expectLater(
    find.byType(MyWidget),
    matchesGoldenFile('my_widget_light.png'),
  );

  // 다크 테마에서도 확인
  await tester.pumpWidget(MaterialApp(
    theme: ThemeData.dark(),
    home: MyWidget(),
  ));

  await expectLater(
    find.byType(MyWidget),
    matchesGoldenFile('my_widget_dark.png'),
  );
});
```

## 팁과 베스트 프랙티스

1. **작은 위젯부터 테스트하기**: 복잡한 화면 대신 재사용 가능한 작은 위젯부터 테스트하세요.

2. **모킹 활용하기**: 외부 종속성(API, 데이터베이스 등)은 모킹하여 테스트하세요.

3. **테스트 가능성을 고려한 설계**: 위젯을 설계할 때 테스트 가능성을 고려하세요. 종속성 주입을 활용하면 테스트가 쉬워집니다.

4. **모든 상호작용 후 pump() 호출하기**: 상태 변경 후에는 항상 `tester.pump()`를 호출하여 UI를 업데이트하세요.

5. **키 활용하기**: 복잡한 UI에서는 위젯을 쉽게 찾을 수 있도록 키를 할당하세요.

6. **다양한 시나리오 테스트하기**: 정상 경로뿐만 아니라 오류 경로, 경계 조건도 테스트하세요.

## Riverpod 통합 위젯 테스트

Riverpod를 사용하는 경우 테스트 설정 방법:

```dart
testWidgets('CounterWidget with Riverpod', (WidgetTester tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        // 프로바이더 오버라이드
        counterProvider.overrideWithValue(10),
      ],
      child: MaterialApp(
        home: CounterWidget(),
      ),
    ),
  );

  // 오버라이드된 값으로 위젯이 렌더링되었는지 확인
  expect(find.text('10'), findsOneWidget);

  // 상호작용 및 추가 검증
  await tester.tap(find.byType(ElevatedButton));
  await tester.pump();

  // 상태 업데이트 확인
  expect(find.text('11'), findsOneWidget);
});
```

## 결론

위젯 테스트는 Flutter 앱의 UI가 예상대로 동작하는지 확인하는 중요한 단계입니다. 단위 테스트와 통합 테스트를 함께 사용하여 앱의 모든 측면을 테스트하는 것이 좋습니다. 위젯 테스트를 통해 UI 변경이 기존 기능을 손상시키지 않고, 사용자 상호작용이 올바르게 처리됨을 보장할 수 있습니다.

다음 장에서는 통합 테스트(Integration Test)에 대해 알아보겠습니다. 통합 테스트는 위젯 테스트보다 더 넓은 범위에서 앱의 여러 부분이 함께 작동하는 방식을 테스트합니다.
