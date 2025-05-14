---
title: 위젯 개념과 주요 위젯
---

Flutter의 핵심은 위젯(Widget)입니다. Flutter 애플리케이션은 여러 위젯들로 구성되어 있으며, 위젯은 UI의 구성 요소를 나타냅니다. 이 장에서는 Flutter 위젯의 기본 개념과 위젯 시스템의 작동 방식을 알아보겠습니다.

## 위젯이란?

위젯(Widget)은 Flutter에서 UI를 구성하는 기본 단위입니다. 버튼, 텍스트, 이미지, 레이아웃, 스크롤 등 화면에 보이는 모든 요소는 위젯입니다. Flutter의 철학은 "모든 것이 위젯"이라는 개념에 기반하고 있습니다.

위젯은 다음과 같은 특징을 가지고 있습니다:

1. **불변성(Immutable)**: 위젯은 생성된 후 변경할 수 없습니다. UI를 변경하려면 새로운 위젯을 생성해야 합니다.
2. **계층 구조**: 위젯은 트리 구조로 조직되며, 부모 위젯은 자식 위젯을 포함할 수 있습니다.
3. **선언적 UI**: Flutter는 현재 애플리케이션 상태에 따라 UI가 어떻게 보여야 하는지 선언적으로 정의합니다.
4. **합성(Composition)**: 작은 위젯들을 조합하여 복잡한 UI를 구성합니다.

## Flutter 위젯의 주기

Flutter 위젯은 생성, 구성, 렌더링의 주기를 거칩니다:


1. **위젯 생성**: 위젯 클래스의 인스턴스가 생성됩니다.
2. **빌드 메서드 호출**: 위젯의 `build()` 메서드가 호출되어 위젯 트리를 구성합니다.
3. **요소 트리 생성**: 위젯 트리를 기반으로 Element 트리가 생성되거나 업데이트됩니다.
4. **RenderObject 생성**: Element 트리에 따라 RenderObject 트리가 생성되거나 업데이트됩니다.
5. **화면에 렌더링**: RenderObject 트리를 기반으로 UI가 화면에 렌더링됩니다.
6. **위젯 상태 변경**: 상태 변경 시 위젯이 다시 빌드됩니다.

## 위젯 유형

Flutter 위젯은 크게 두 가지 유형으로 나눌 수 있습니다:

### 1. Stateless 위젯

Stateless 위젯은 내부 상태를 가지지 않는 정적인 위젯입니다. 생성 시 전달받은 속성(properties)만 사용하며, 한 번 빌드되면 변경되지 않습니다. 간단한 UI 요소나 변경이 필요 없는 화면에 적합합니다.

```dart
class GreetingWidget extends StatelessWidget {
  final String name;

  const GreetingWidget({Key? key, required this.name}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text('안녕하세요, $name님!');
  }
}
```

### 2. Stateful 위젯

Stateful 위젯은 내부 상태를 가지고 있으며, 상태가 변경되면 UI가 다시 빌드됩니다. 사용자 입력, 네트워크 응답, 시간 경과 등에 따라 변경되는 UI 요소에 적합합니다.

```dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({Key? key}) : super(key: key);

  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('카운터: $_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text('증가'),
        ),
      ],
    );
  }
}
```

## 위젯 트리

Flutter 애플리케이션의 UI는 위젯 트리로 표현됩니다. 모든 Flutter 앱은 루트 위젯에서 시작하여 자식 위젯들로 구성된 트리 구조를 가집니다.

위젯 트리의 특징:

1. **부모-자식 관계**: 위젯은 하나의 부모와 여러 자식을 가질 수 있습니다.
2. **단방향 데이터 흐름**: 데이터는 부모에서 자식으로 흐릅니다.
3. **렌더링 최적화**: Flutter는 변경된 위젯만 다시 빌드하여 성능을 최적화합니다.

## 위젯의 세 가지 트리

Flutter는 UI 렌더링을 위해 세 가지 트리를 관리합니다:

1. **Widget 트리**: UI의 설계도로, 사용자가 작성한 위젯 클래스의 인스턴스들로 구성됩니다.
2. **Element 트리**: Widget과 RenderObject를 연결하는 중간 계층으로, 위젯의 수명 주기를 관리합니다.
3. **RenderObject 트리**: 실제 화면에 그려지는 객체들을 표현하며, 레이아웃 계산과 페인팅을 담당합니다.

## Flutter 위젯의 구성 방식

Flutter 위젯은 합성(Composition)을 통해 구성됩니다. 작은 위젯들을 조합하여 복잡한 UI를 만들 수 있습니다.

```dart
Scaffold(
  appBar: AppBar(
    title: Text('Flutter 앱'),
    actions: [
      IconButton(
        icon: Icon(Icons.settings),
        onPressed: () {},
      ),
    ],
  ),
  body: Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Hello, Flutter!'),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: () {},
          child: Text('버튼'),
        ),
      ],
    ),
  ),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
)
```

이 예제에서 `Scaffold`, `AppBar`, `Text`, `Center`, `Column` 등 여러 위젯들이 중첩되어 하나의 화면을 구성합니다.

## Flutter 기본 위젯의 분류

Flutter 위젯은 기능에 따라 여러 카테고리로 분류할 수 있습니다:

### 구조적 위젯

애플리케이션의 구조를 정의하는 위젯입니다:

- **MaterialApp**: Material Design 앱의 진입점
- **CupertinoApp**: iOS 스타일 앱의 진입점
- **Scaffold**: 기본 앱 구조 제공 (앱바, 드로워, 바텀 시트 등)
- **AppBar**: 앱 상단의 앱 바

### 시각적 위젯

화면에 콘텐츠를 표시하는 위젯입니다:

- **Text**: 텍스트 표시
- **Image**: 이미지 표시
- **Icon**: 아이콘 표시
- **Card**: 둥근 모서리와 그림자가 있는 카드

### 레이아웃 위젯

위젯들을 배치하고 정렬하는 위젯입니다:

- **Container**: 패딩, 마진, 배경색, 크기 등을 설정할 수 있는 범용 컨테이너
- **Row/Column**: 위젯을 가로/세로로 배열
- **Stack**: 위젯들을 겹쳐서 배치
- **ListView**: 스크롤 가능한 목록

### 입력 위젯

사용자 입력을 받는 위젯입니다:

- **TextField**: 텍스트 입력
- **Checkbox**: 체크박스
- **Radio**: 라디오 버튼
- **Slider**: 슬라이더

### 상호작용 위젯

사용자 상호작용을 처리하는 위젯입니다:

- **GestureDetector**: 다양한 제스처 인식
- **InkWell**: 터치 효과가 있는 영역
- **Draggable**: 드래그 가능한 위젯

### 애니메이션 위젯

애니메이션 효과를 제공하는 위젯입니다:

- **AnimatedContainer**: 속성 변경 시 애니메이션 효과
- **Hero**: 화면 전환 시 애니메이션 효과
- **FadeTransition**: 페이드 인/아웃 효과

## 위젯 속성 전달

Flutter 위젯은 생성자를 통해 속성을 전달받아 UI를 구성합니다:

```dart
Container(
  width: 200,
  height: 100,
  margin: EdgeInsets.all(10),
  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: Colors.black26,
        offset: Offset(0, 2),
        blurRadius: 6,
      ),
    ],
  ),
  child: Center(
    child: Text(
      'Flutter',
      style: TextStyle(
        color: Colors.white,
        fontSize: 24,
        fontWeight: FontWeight.bold,
      ),
    ),
  ),
)
```

이 예제에서 `Container`, `Center`, `Text` 위젯은 각각 다양한 속성(width, height, decoration, style 등)을 전달받아 특정한 모양과 스타일을 가진 UI를 생성합니다.

## 위젯 키(Key)

위젯 키는 Flutter가 위젯 트리에서 위젯을 식별하는 데 사용됩니다. 특히 동적으로 변경되는 위젯 목록에서 중요한 역할을 합니다.

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      key: ValueKey(items[index].id), // 고유 ID를 키로 사용
      title: Text(items[index].title),
    );
  },
)
```

위젯 키의 주요 종류:

- **ValueKey**: 단일 값을 기반으로 한 키
- **ObjectKey**: 객체 식별자를 기반으로 한 키
- **UniqueKey**: 매번 고유한 키를 생성
- **GlobalKey**: 전역적으로 접근 가능한 키, 위젯의 상태에 접근하거나 위젯의 크기/위치를 파악하는 데 사용

## 위젯 제약 조건(Constraints)

Flutter의 레이아웃 시스템은 부모 위젯이 자식 위젯에게 제약 조건(constraints)을 전달하고, 자식 위젯은 이 제약 조건 내에서 자신의 크기를 결정하는 방식으로 작동합니다.

제약 조건은 최소/최대 너비와 높이로 구성되며, 자식 위젯은 이 범위 내에서 크기를 결정합니다:

```dart
ConstrainedBox(
  constraints: BoxConstraints(
    minWidth: 100,
    maxWidth: 200,
    minHeight: 50,
    maxHeight: 100,
  ),
  child: Container(
    color: Colors.blue,
    width: 150, // minWidth와 maxWidth 사이의 값
    height: 75, // minHeight와 maxHeight 사이의 값
  ),
)
```

## 위젯 렌더링 과정

Flutter의 위젯 렌더링 과정은 다음과 같습니다:

1. **레이아웃 단계**: 부모 위젯이 자식 위젯에게 제약 조건을 전달하고, 자식 위젯은 자신의 크기를 결정합니다.
2. **페인팅 단계**: 위젯의 외관이 렌더링됩니다.
3. **합성 단계**: 렌더링된 레이어들이 화면에 합성됩니다.


## 결론

Flutter의 위젯 시스템은 UI 구성을 위한 강력하고 유연한 방법을 제공합니다. "모든 것이 위젯"이라는 철학을 통해 일관된 방식으로 복잡한 UI를 구축할 수 있습니다. 위젯의 불변성, 선언적 특성, 합성 패턴은 Flutter가 효율적이고 예측 가능한 UI 프레임워크가 되는 데 중요한 역할을 합니다.

다음 장에서는 Stateless 위젯과 Stateful 위젯에 대해 더 자세히 알아보겠습니다.
