---
title: 상태 관리 입문
---

Flutter 앱을 개발하면서 가장 중요한 개념 중 하나는 '상태 관리(State Management)'입니다. 이 장에서는 Flutter에서의 상태 관리 개념과 다양한 상태 관리 방법에 대해 알아보겠습니다.

## 상태(State)란 무엇인가?

상태는 앱의 동작 중에 변할 수 있는 데이터를 의미합니다. 사용자 입력, 네트워크 응답, 시간 경과 등에 따라 앱의 UI가 변경되어야 할 때, 이러한 변경사항을 관리하는 데이터를 '상태'라고 합니다.

Flutter에서 상태는 크게 다음과 같이 분류할 수 있습니다:


### 1. 임시 상태(Ephemeral State)

- 단일 위젯 내에서만 사용되는 간단한 상태
- UI의 일시적인 변화를 관리 (예: 버튼 눌림 상태, 입력 필드 포커스 등)
- `StatefulWidget`과 `setState()`로 쉽게 관리 가능

### 2. 앱 상태(App State)

- 앱의 여러 부분에서 공유되는 데이터
- 장기적으로 유지되어야 하는 정보 (예: 사용자 설정, 인증 토큰, 쇼핑 카트 내용)
- 전역적으로 접근 가능해야 하며, 효율적인 관리가 필요
- 상태 관리 라이브러리(Provider, Riverpod, Bloc 등)를 활용하여 관리

## 상태 관리가 중요한 이유

상태 관리는 다음과 같은 이유로 중요합니다:

1. **UI 일관성**: 상태 변화에 따라 UI가 일관되게 업데이트되어야 함
2. **코드 구조화**: 앱의 상태 로직과 UI 로직을 분리하여 유지보수성 향상
3. **성능 최적화**: 필요한 부분만 효율적으로 다시 빌드하여 성능 개선
4. **확장성**: 앱의 규모가 커져도 상태를 효과적으로 관리할 수 있는 구조 필요


## 상태 관리 방식의 진화

Flutter에서의 상태 관리는 다음과 같이 진화해 왔습니다:

### 1. StatefulWidget과 setState()

Flutter의 기본적인 상태 관리 메커니즘입니다. 간단한 상태를 위젯 내부에서 관리합니다.

```dart
class CounterWidget extends StatefulWidget {
  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _count = 0;

  void _incrementCount() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('카운트: $_count'),
        ElevatedButton(
          onPressed: _incrementCount,
          child: Text('증가'),
        ),
      ],
    );
  }
}
```

특징:

- 장점: 간단하고 직관적
- 단점: 깊은 위젯 트리에서 상태 전달이 어려움(Prop drilling)

### 2. InheritedWidget

Flutter의 내장 메커니즘으로, 위젯 트리 아래로 데이터를 효율적으로 전달합니다.

```dart
class CounterInheritedWidget extends InheritedWidget {
  final int count;
  final Function incrementCount;

  CounterInheritedWidget({
    required this.count,
    required this.incrementCount,
    required Widget child,
  }) : super(child: child);

  @override
  bool updateShouldNotify(CounterInheritedWidget oldWidget) {
    return count != oldWidget.count;
  }

  static CounterInheritedWidget of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<CounterInheritedWidget>()!;
  }
}
```

특징:

- 장점: 위젯 트리를 통한 데이터 전파
- 단점: 직접 구현하기 복잡함

### 3. Provider 패턴

InheritedWidget을 래핑한 패키지로, 더 사용하기 쉬운 API를 제공합니다.

```dart
// 상태 클래스
class CounterModel with ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// Provider 설정
ChangeNotifierProvider(
  create: (context) => CounterModel(),
  child: MyApp(),
),

// 데이터 사용
Consumer<CounterModel>(
  builder: (context, counter, child) {
    return Text('카운트: ${counter.count}');
  },
)
```

특징:

- 장점: 사용하기 쉽고 직관적
- 단점: 복잡한 상태 관리에는 한계가 있음

### 4. 현대적 상태 관리 솔루션

현재는 다양한 상태 관리 라이브러리가 존재합니다:

- **Riverpod**: Provider의 개선 버전으로, 컴파일 타임 안전성 및 테스트 용이성 강화
- **Bloc/Cubit**: 비즈니스 로직을 명확하게 분리하는 패턴
- **GetX**: 간편한 API와 다양한 기능을 제공하는 프레임워크
- **MobX**: 반응형 프로그래밍 기반의 상태 관리
- **Redux**: 예측 가능한 상태 컨테이너

## 상태 관리 선택 가이드

어떤 상태 관리 솔루션을 선택해야 할까요? 다음 요소를 고려하세요:

1. **앱 복잡도**: 단순한 앱은 setState()나 Provider로도 충분할 수 있음
2. **팀 경험**: 팀이 이미 익숙한 솔루션이 있다면 고려
3. **학습 곡선**: 일부 솔루션은 배우기 어려울 수 있음
4. **성능 요구사항**: 대규모 앱의 경우 성능 최적화된 솔루션 필요
5. **테스트 용이성**: 상태 로직의 테스트 용이성도 중요한 고려사항

## 이 장의 다음 섹션들

이 장의 나머지 부분에서는 Flutter의 다양한 상태 관리 방법을 자세히 다룰 것입니다:

1. **setState와 ValueNotifier**: Flutter의 기본 상태 관리 메커니즘
2. **InheritedWidget과 Provider**: 위젯 트리를 통한 상태 공유
3. **Riverpod**: 현대적인 상태 관리 솔루션
4. **TodoList 실습**: 실제 애플리케이션에 상태 관리 적용하기

## 요약

- 상태 관리는 Flutter 애플리케이션 개발에서 핵심 개념
- 상태는 임시 상태와 앱 상태로 분류됨
- 다양한 상태 관리 솔루션이 존재하며, 앱의 복잡도와 요구사항에 따라 선택
- 효과적인 상태 관리는 유지보수성, 성능, 확장성을 향상시킴

다음 섹션에서는 Flutter의 기본 상태 관리 메커니즘인 `setState()`와 `ValueNotifier`에 대해 자세히 알아보겠습니다.
