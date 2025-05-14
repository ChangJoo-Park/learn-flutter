---
title: 레이아웃 위젯
---

Flutter에서 레이아웃 위젯은 화면에 UI 요소를 배치하고 구성하는 데 사용됩니다. 이 장에서는 Flutter의 다양한 레이아웃 위젯과 그 사용법, 그리고 복잡한 레이아웃을 구성하는 방법에 대해 알아보겠습니다.

## Flutter의 레이아웃 시스템

Flutter의 레이아웃 시스템은 위젯 트리를 통해 UI를 구성하며, 부모 위젯이 자식 위젯에게 제약 조건(constraints)을 전달하고 자식 위젯이 이 제약 내에서 자신의 크기를 결정하는 방식으로 작동합니다.

Flutter의 레이아웃 프로세스:

1. 부모 위젯이 자식 위젯에게 최소/최대 너비와 높이 제약을 전달
2. 자식 위젯은 해당 제약 내에서 자신의 크기를 결정
3. 부모 위젯은 자식 위젯의 크기를 기반으로 자식 위젯의 위치를 결정

## 기본 레이아웃 위젯

### Container

`Container`는 Flutter에서 가장 유용한 레이아웃 위젯 중 하나로, 다양한 속성을 통해 레이아웃과 스타일링을 할 수 있습니다.

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
    border: Border.all(color: Colors.blue.shade300),
  ),
  alignment: Alignment.center,
  child: Text(
    'Container',
    style: TextStyle(color: Colors.white, fontSize: 18),
  ),
)
```

**Container 동작 방식:**

- 자식이 없으면 최대한 크게 확장
- 자식이 있으면 자식의 크기에 맞춤
- 명시적인 너비/높이가 설정되면 해당 크기로 고정

### SizedBox

`SizedBox`는 고정된 크기의 상자를 만들거나 위젯 사이에 간격을 추가하는 데 사용됩니다.

```dart
// 고정 크기 박스
SizedBox(
  width: 100,
  height: 50,
  child: Container(color: Colors.red),
)

// 간격 추가
Column(
  children: [
    Text('첫 번째 텍스트'),
    SizedBox(height: 16), // 수직 간격
    Text('두 번째 텍스트'),
  ],
)

// 최대 크기로 확장 (Expanded의 대안)
SizedBox.expand(
  child: Container(color: Colors.blue),
)
```

### Padding

`Padding`은 자식 위젯에 패딩을 추가합니다.

```dart
Padding(
  padding: EdgeInsets.all(16.0),
  child: Text('패딩이 있는 텍스트'),
)
```

## 단일 자식 레이아웃 위젯

### Center

`Center`는 자식 위젯을 컨테이너의 중앙에 배치합니다.

```dart
Center(
  child: Text('중앙에 위치한 텍스트'),
)
```

### Align

`Align`은 자식 위젯을 특정 위치에 정렬합니다.

```dart
Align(
  alignment: Alignment.topRight,
  child: Text('우측 상단에 위치한 텍스트'),
)

// 사용자 정의 정렬 (각 값은 -1.0부터 1.0 사이)
Align(
  alignment: Alignment(0.5, -0.5), // x축 0.5, y축 -0.5 위치
  child: Text('커스텀 위치의 텍스트'),
)
```

### FractionallySizedBox

`FractionallySizedBox`는 부모 위젯의 크기에 상대적인 비율로 크기를 지정합니다.

```dart
Container(
  width: 200,
  height: 200,
  color: Colors.grey,
  child: FractionallySizedBox(
    widthFactor: 0.7, // 부모 너비의 70%
    heightFactor: 0.5, // 부모 높이의 50%
    alignment: Alignment.center,
    child: Container(color: Colors.blue),
  ),
)
```

### AspectRatio

`AspectRatio`는 지정된 가로세로 비율에 맞게 자식 위젯의 크기를 조정합니다.

```dart
Container(
  width: 200,
  color: Colors.grey,
  child: AspectRatio(
    aspectRatio: 16 / 9, // 너비:높이 = 16:9
    child: Container(color: Colors.green),
  ),
)
```

## 다중 자식 레이아웃 위젯

### Row와 Column

`Row`와 `Column`은 Flutter에서 가장 기본적인 다중 자식 레이아웃 위젯입니다:

- `Row`: 자식 위젯을 수평으로 배치
- `Column`: 자식 위젯을 수직으로 배치

```dart
// 수평 배치
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Icon(Icons.star, size: 30),
    Icon(Icons.star, size: 45),
    Icon(Icons.star, size: 30),
  ],
)

// 수직 배치
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('항목 1'),
    Text('항목 2'),
    Text('항목 3'),
  ],
)
```

**주요 속성**:

- `mainAxisAlignment`: 주축(Row에서는 수평, Column에서는 수직)을 따라 자식 위젯을 정렬
- `crossAxisAlignment`: 교차축을 따라 자식 위젯을 정렬
- `mainAxisSize`: 주축 방향으로 차지할 공간 (기본값: `MainAxisSize.max`)

### Expanded와 Flexible

`Expanded`와 `Flexible`은 자식 위젯이 Row나 Column 내에서 사용 가능한 공간을 차지하도록 합니다:

```dart
Row(
  children: [
    // 1/3의 공간 차지
    Expanded(
      flex: 1,
      child: Container(color: Colors.red),
    ),
    // 2/3의 공간 차지
    Expanded(
      flex: 2,
      child: Container(color: Colors.blue),
    ),
  ],
)

// Flexible vs Expanded
Row(
  children: [
    // 필요한 만큼만 공간 차지 (최소)
    Flexible(
      flex: 1,
      fit: FlexFit.loose, // 기본값
      child: Container(
        width: 50,
        color: Colors.red,
      ),
    ),
    // 사용 가능한 모든 공간 차지 (최대)
    Expanded(
      flex: 1,
      // Expanded는 fit: FlexFit.tight와 동일
      child: Container(color: Colors.blue),
    ),
  ],
)
```

**Expanded vs Flexible**:

- `Expanded`: 항상 사용 가능한 최대 공간을 차지 (`FlexFit.tight`)
- `Flexible`: 자식 위젯이 원하는 크기만큼 공간을 차지하되, 최대 지정된 공간까지 (`FlexFit.loose`)

### Spacer

`Spacer`는 Row나 Column 내에서 빈 공간을 만들 때 사용합니다:

```dart
Row(
  children: [
    Text('좌측'),
    Spacer(), // 가능한 모든 공간을 차지
    Text('우측'),
  ],
)

Row(
  children: [
    Text('좌측'),
    Spacer(flex: 1), // 1/3 공간
    Text('중앙'),
    Spacer(flex: 2), // 2/3 공간
    Text('우측'),
  ],
)
```

### Wrap

`Wrap`은 공간이 부족할 때 자식 위젯을 다음 행/열로 넘기는 레이아웃 위젯입니다:

```dart
Wrap(
  spacing: 8.0, // 주축 방향 간격
  runSpacing: 12.0, // 교차축 방향 간격
  alignment: WrapAlignment.center,
  children: [
    Chip(label: Text('Flutter')),
    Chip(label: Text('Dart')),
    Chip(label: Text('Firebase')),
    Chip(label: Text('Android')),
    Chip(label: Text('iOS')),
    Chip(label: Text('Web')),
  ],
)
```

### Stack

`Stack`은 위젯을 서로 겹쳐서 배치할 때 사용합니다:

```dart
Stack(
  alignment: Alignment.center, // 기본 정렬 (positioned가 없는 경우)
  children: [
    // 맨 아래 위젯
    Container(
      width: 300,
      height: 200,
      color: Colors.blue,
    ),
    // 중간 위젯
    Container(
      width: 250,
      height: 150,
      color: Colors.red.withOpacity(0.7),
    ),
    // 맨 위 위젯 (정확한 위치 지정)
    Positioned(
      top: 40,
      left: 40,
      child: Container(
        width: 150,
        height: 100,
        color: Colors.green.withOpacity(0.7),
      ),
    ),
    // 텍스트
    const Text(
      'Stack 예제',
      style: TextStyle(
        color: Colors.white,
        fontSize: 24,
        fontWeight: FontWeight.bold,
      ),
    ),
  ],
)
```

### Positioned

`Positioned` 위젯은 `Stack` 내에서 자식 위젯의 정확한 위치를 지정합니다:

```dart
Stack(
  children: [
    Positioned.fill( // 전체 영역 채우기
      child: Container(color: Colors.grey),
    ),
    Positioned( // 좌표 지정
      top: 20,
      left: 20,
      width: 100,
      height: 100,
      child: Container(color: Colors.red),
    ),
    Positioned(
      bottom: 20,
      right: 20,
      width: 100,
      height: 100,
      child: Container(color: Colors.blue),
    ),
  ],
)
```

다음은 Stack과 Positioned의 레이아웃 방식을 보여주는 다이어그램입니다:

## 스크롤 위젯

### SingleChildScrollView

`SingleChildScrollView`는 단일 자식 위젯을 스크롤 가능하게 만듭니다:

```dart
SingleChildScrollView(
  scrollDirection: Axis.vertical, // 기본값
  child: Column(
    children: List.generate(
      20,
      (index) => Container(
        height: 100,
        margin: EdgeInsets.all(8),
        color: Colors.primaries[index % Colors.primaries.length],
        alignment: Alignment.center,
        child: Text('항목 $index'),
      ),
    ),
  ),
)
```

### ListView

`ListView`는 여러 항목을 스크롤 가능한 목록으로 표시합니다:

```dart
// 기본 ListView
ListView(
  padding: EdgeInsets.all(8),
  children: [
    ListTile(title: Text('항목 1')),
    ListTile(title: Text('항목 2')),
    ListTile(title: Text('항목 3')),
  ],
)

// 빌더 패턴 (효율적인 렌더링)
ListView.builder(
  itemCount: 100,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text('항목 $index'),
    );
  },
)

// 구분선이 있는 ListView
ListView.separated(
  itemCount: 20,
  separatorBuilder: (context, index) => Divider(),
  itemBuilder: (context, index) {
    return ListTile(
      title: Text('항목 $index'),
    );
  },
)
```

### GridView

`GridView`는 여러 항목을 격자 형태로 표시합니다:

```dart
// 기본 그리드
GridView.count(
  crossAxisCount: 3, // 열 개수
  mainAxisSpacing: 4.0, // 세로 간격
  crossAxisSpacing: 4.0, // 가로 간격
  padding: EdgeInsets.all(4.0),
  children: List.generate(
    30,
    (index) => Container(
      color: Colors.primaries[index % Colors.primaries.length],
      child: Center(
        child: Text('$index'),
      ),
    ),
  ),
)

// 빌더 패턴
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    childAspectRatio: 1.5,
    mainAxisSpacing: 10,
    crossAxisSpacing: 10,
  ),
  itemCount: 100,
  itemBuilder: (context, index) {
    return Container(
      color: Colors.blue[(index % 9 + 1) * 100],
      child: Center(
        child: Text('항목 $index'),
      ),
    );
  },
)
```

## 레이아웃 최적화 위젯

### ConstrainedBox

`ConstrainedBox`는 자식 위젯에 추가 제약 조건을 적용합니다:

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
    width: 150, // 100~200 사이로 제한됨
    height: 75, // 50~100 사이로 제한됨
  ),
)
```

### IntrinsicWidth와 IntrinsicHeight

`IntrinsicWidth`와 `IntrinsicHeight`는 자식 위젯의 내부 크기에 맞춰 너비/높이를 조정합니다:

```dart
// 모든 자식의 너비를 최대 너비에 맞춤
IntrinsicWidth(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      Container(
        height: 50,
        width: 100,
        color: Colors.red,
      ),
      Container(
        height: 50,
        width: 150,
        color: Colors.blue,
      ),
      Container(
        height: 50,
        width: 75,
        color: Colors.green,
      ),
    ],
  ),
)
```

### LayoutBuilder

`LayoutBuilder`는 부모 위젯의 제약 조건에 따라 다른 레이아웃을 구성할 때 사용합니다:

```dart
LayoutBuilder(
  builder: (BuildContext context, BoxConstraints constraints) {
    if (constraints.maxWidth > 600) {
      // 넓은 화면 레이아웃
      return Row(
        children: [
          Expanded(
            flex: 1,
            child: Container(color: Colors.red),
          ),
          Expanded(
            flex: 2,
            child: Container(color: Colors.blue),
          ),
        ],
      );
    } else {
      // 좁은 화면 레이아웃
      return Column(
        children: [
          Container(
            height: 100,
            color: Colors.red,
          ),
          Container(
            height: 200,
            color: Colors.blue,
          ),
        ],
      );
    }
  },
)
```

## 반응형 레이아웃

### MediaQuery

`MediaQuery`는 화면 크기, 기기 방향, 텍스트 배율 등 미디어 정보에 접근할 수 있게 해줍니다:

```dart
Widget build(BuildContext context) {
  final mediaQuery = MediaQuery.of(context);
  final screenWidth = mediaQuery.size.width;
  final screenHeight = mediaQuery.size.height;
  final orientation = mediaQuery.orientation;
  final padding = mediaQuery.padding;
  final isTablet = screenWidth > 600;

  return Scaffold(
    appBar: AppBar(
      title: Text('반응형 레이아웃'),
    ),
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('화면 너비: $screenWidth'),
          Text('화면 높이: $screenHeight'),
          Text('방향: $orientation'),
          Text('상단 패딩: ${padding.top}'),
          Text('기기 타입: ${isTablet ? "태블릿" : "휴대폰"}'),

          SizedBox(height: 20),

          // 반응형 UI
          Container(
            width: screenWidth * 0.8, // 화면 너비의 80%
            height: screenHeight * 0.2, // 화면 높이의 20%
            color: isTablet ? Colors.blue : Colors.green,
            child: Center(
              child: Text(
                isTablet ? '태블릿 레이아웃' : '휴대폰 레이아웃',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}
```

### OrientationBuilder

`OrientationBuilder`는 기기 방향에 따라 다른 레이아웃을 구성할 때 사용합니다:

```dart
OrientationBuilder(
  builder: (context, orientation) {
    return GridView.count(
      // 세로 모드일 때는 2열, 가로 모드일 때는 3열
      crossAxisCount: orientation == Orientation.portrait ? 2 : 3,
      children: List.generate(
        12,
        (index) => Card(
          color: Colors.primaries[index % Colors.primaries.length],
          child: Center(
            child: Text('항목 $index'),
          ),
        ),
      ),
    );
  },
)
```

## 복잡한 레이아웃 예제

다음은 복잡한 레이아웃을 구현하는 예제입니다:

```dart
// 프로필 화면 예제
Scaffold(
  appBar: AppBar(
    title: Text('프로필'),
    actions: [
      IconButton(
        icon: Icon(Icons.settings),
        onPressed: () {},
      ),
    ],
  ),
  body: SingleChildScrollView(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 프로필 헤더
        Container(
          height: 200,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: NetworkImage('https://example.com/banner.jpg'),
              fit: BoxFit.cover,
            ),
          ),
          child: Stack(
            children: [
              // 프로필 정보가 있는 바닥 패널
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  height: 80,
                  color: Colors.black45,
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        radius: 30,
                        backgroundImage: NetworkImage('https://example.com/avatar.jpg'),
                      ),
                      SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '홍길동',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '@hong',
                              style: TextStyle(
                                color: Colors.white70,
                              ),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {},
                        child: Text('팔로우'),
                        style: ElevatedButton.styleFrom(
                          primary: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        // 통계 섹션
        Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatColumn('게시물', '125'),
              _buildStatColumn('팔로워', '1.2K'),
              _buildStatColumn('팔로잉', '384'),
            ],
          ),
        ),

        Divider(),

        // 소개 섹션
        Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '소개',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 8),
              Text(
                '안녕하세요, Flutter 개발자 홍길동입니다. '
                'UI/UX 디자인과 앱 개발에 관심이 많습니다. '
                '함께 일하고 싶으시면 연락주세요!',
              ),
            ],
          ),
        ),

        Divider(),

        // 갤러리 섹션
        Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '갤러리',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              GridView.builder(
                shrinkWrap: true, // SingleChildScrollView 내에서 사용하기 위해 필요
                physics: NeverScrollableScrollPhysics(), // 중첩 스크롤 방지
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 4,
                  crossAxisSpacing: 4,
                ),
                itemCount: 9,
                itemBuilder: (context, index) {
                  return Container(
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage('https://picsum.photos/id/${index + 10}/200'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    ),
  ),
);

// 헬퍼 함수
Column _buildStatColumn(String label, String value) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text(
        value,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      SizedBox(height: 4),
      Text(
        label,
        style: TextStyle(
          color: Colors.grey,
        ),
      ),
    ],
  );
}
```

위젯 구조:

## 레이아웃 디버깅

### 문제 식별하기

Flutter는 레이아웃 디버깅을 위한 여러 도구를 제공합니다:

1. **디버그 페인팅 옵션**: `debugPaintSizeEnabled`를 활성화하여 레이아웃 경계 시각화:

```dart
import 'package:flutter/rendering.dart';

void main() {
  debugPaintSizeEnabled = true; // 레이아웃 경계 표시
  runApp(MyApp());
}
```

2. **LayoutBuilder 사용**: 현재 제약 조건 출력하기:

```dart
LayoutBuilder(
  builder: (context, constraints) {
    print('Width: ${constraints.maxWidth}, Height: ${constraints.maxHeight}');
    return YourWidget();
  },
)
```

3. **Flutter DevTools**: 위젯 검사기(Widget Inspector)를 사용하여 위젯 트리와 속성 확인

### 공통 문제 해결

#### 1. Unbounded 높이 오류

```
Vertical viewport was given unbounded height.
```

이 오류는 높이 제약이 없는 상태에서 ListView나 Column 등을 사용할 때 발생합니다.

해결 방법:

```dart
// 해결 방법 1: Container로 크기 제한
Container(
  height: 300,
  child: ListView(/* ... */),
)

// 해결 방법 2: Expanded 사용 (Column 내부에서)
Column(
  children: [
    // 다른 위젯들...
    Expanded(
      child: ListView(/* ... */),
    ),
  ],
)

// 해결 방법 3: shrinkWrap 사용 (성능에 주의)
ListView(
  shrinkWrap: true,
  children: [/* ... */],
)
```

#### 2. Column이 화면을 넘어감

```dart
// 잘못된 방법
Column(
  children: [많은 위젯들...], // 내용이 화면을 넘어가면 오류 발생
)

// 해결 방법
SingleChildScrollView(
  child: Column(
    children: [많은 위젯들...],
  ),
)
```

## 결론

Flutter의 레이아웃 시스템은 유연하고 강력하여 복잡한 UI를 구현할 수 있게 해줍니다. 다양한 레이아웃 위젯을 조합하여 원하는 디자인을 실현할 수 있습니다.

레이아웃 위젯 선택 시 고려할 사항:

1. **위젯의 목적**: 단일 자식? 다중 자식? 스크롤이 필요한가?
2. **배치 방식**: 수평? 수직? 겹침? 격자?
3. **크기 조절**: 고정 크기? 유연한 크기? 비율?
4. **반응형**: 화면 크기나 방향에 따라 조정이 필요한가?

적절한 레이아웃 위젯을 선택하고 조합하면 모든 화면 크기와 방향에 최적화된 UI를 만들 수 있습니다.

다음 파트에서는 Flutter의 상태 관리에 대해 알아보겠습니다.
