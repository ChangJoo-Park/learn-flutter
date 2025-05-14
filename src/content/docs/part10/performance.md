---
title: 성능 최적화
---

Flutter 앱의 성능은 사용자 경험에 직접적인 영향을 미치는 중요한 요소입니다. 앱이 부드럽게 작동하고, 반응이 빠르며, 자원을 효율적으로 사용할 때 사용자 만족도가 높아집니다. 이 장에서는 Flutter 앱의 성능을 최적화하기 위한 다양한 전략과 기법을 살펴보겠습니다.

## 성능 최적화의 원칙

Flutter 앱 성능 최적화의 기본 원칙은 다음과 같습니다:


1. **계측 먼저, 최적화는 나중에**: 추측이 아닌 측정된 데이터를 기반으로 최적화를 진행합니다.
2. **단순함 유지**: 복잡한 위젯 트리는 성능 문제를 일으킬 수 있습니다.
3. **유지보수성과 균형**: 성능을 위해 코드 가독성과 유지보수성을 희생하지 않습니다.
4. **적절한 추상화 레벨 선택**: 상황에 맞는 수준의 추상화를 사용합니다.

## 성능 측정 도구

최적화 작업을 시작하기 전에 앱의 성능을 측정하고 병목 현상을 파악해야 합니다.

### 1. Flutter DevTools

Flutter DevTools는 앱 성능 분석을 위한 강력한 도구입니다.

```bash
# DevTools 실행
flutter pub global activate devtools
flutter pub global run devtools
```

주요 기능:

- **Flutter Inspector**: 위젯 트리 검사
- **Timeline**: 프레임 렌더링 시간 분석
- **CPU Profiler**: 메서드 실행 시간 분석
- **Memory**: 메모리 사용량 모니터링
- **Performance**: 프레임 레이트 및 UI/GPU 스레드 분석

### 2. 성능 오버레이

개발 중에 실시간으로 성능을 모니터링하려면 성능 오버레이를 사용합니다:

```dart
import 'package:flutter/rendering.dart';

void main() {
  // 성능 오버레이 활성화
  debugPaintSizeEnabled = false;       // 크기 시각화
  debugPaintBaselinesEnabled = false;  // 텍스트 기준선 시각화
  debugPaintPointersEnabled = false;   // 포인터 이벤트 시각화
  debugPaintLayerBordersEnabled = false; // 레이어 경계 시각화
  debugRepaintRainbowEnabled = false;  // 리페인트 영역 시각화

  // 성능 오버레이 표시
  WidgetsApp.showPerformanceOverlay = true;

  runApp(const MyApp());
}
```

### 3. 프로파일 모드에서 실행

프로파일 모드는 디버그 오버헤드 없이 성능을 측정할 수 있게 해줍니다:

```bash
# 프로파일 모드로 앱 실행
flutter run --profile
```

## 빌드 최적화 전략

### 1. const 위젯 사용

상태가 변하지 않는 위젯에는 `const` 생성자를 사용하여 재빌드 비용을 줄입니다:

```dart
// 좋지 않은 예
Widget build(BuildContext context) {
  return Container(
    padding: EdgeInsets.all(8.0),
    color: Colors.blue,
    child: Text('Hello'),
  );
}

// 좋은 예
Widget build(BuildContext context) {
  return const Container(
    padding: EdgeInsets.all(8.0),
    color: Colors.blue,
    child: Text('Hello'),
  );
}
```

### 2. StatefulWidget 대신 StatelessWidget 사용

가능한 경우 `StatefulWidget` 대신 `StatelessWidget`을 사용합니다:

```dart
// 상태가 필요하지 않은 경우 StatelessWidget 사용
class MyWidget extends StatelessWidget {
  final String text;

  const MyWidget({Key? key, required this.text}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(text);
  }
}
```

### 3. Riverpod과 같은 상태 관리 라이브러리 활용

Riverpod은 효율적인 상태 관리와 UI 업데이트를 제공합니다:

```dart
// Riverpod을 사용한 상태 관리
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}

// UI에서 사용
class CounterWidget extends ConsumerWidget {
  const CounterWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);

    return Text('Count: $count');
  }
}
```

### 4. 빌드 메서드 최적화

빌드 메서드를 작게 유지하고 중첩된 함수를 피합니다:

```dart
// 좋지 않은 예: 거대한 빌드 메서드
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: Text('My App')),
    body: ListView(
      children: [
        // 수십 개의 위젯...
      ],
    ),
  );
}

// 좋은 예: 위젯으로 분리
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('My App')),
    body: const MyListView(),
  );
}

// 별도의 위젯으로 분리
class MyListView extends StatelessWidget {
  const MyListView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        // 위젯들...
      ],
    );
  }
}
```

## 렌더링 최적화

### 1. RepaintBoundary 사용

자주 변경되는 위젯을 `RepaintBoundary`로 감싸 다시 그리는 영역을 제한합니다:

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 정적 배경
        const BackgroundWidget(),

        // 자주 업데이트되는 위젯은 RepaintBoundary로 감싸기
        RepaintBoundary(
          child: AnimatedWidget(),
        ),
      ],
    );
  }
}
```

### 2. 이미지 캐싱

이미지를 효율적으로 로드하고 캐싱하려면 `cached_network_image` 패키지를 사용합니다:

```dart
import 'package:cached_network_image/cached_network_image.dart';

CachedNetworkImage(
  imageUrl: 'https://example.com/image.jpg',
  placeholder: (context, url) => const CircularProgressIndicator(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
)
```

### 3. BuildContext 확장으로 MediaQuery 최적화

`MediaQuery.of(context)`를 반복 호출하는 대신 확장 함수를 사용합니다:

```dart
extension BuildContextExtensions on BuildContext {
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  Size get screenSize => mediaQuery.size;
  double get screenWidth => screenSize.width;
  double get screenHeight => screenSize.height;
  EdgeInsets get viewPadding => mediaQuery.viewPadding;
  EdgeInsets get viewInsets => mediaQuery.viewInsets;
}

// 사용 예시
Widget build(BuildContext context) {
  final width = context.screenWidth;
  return SizedBox(width: width * 0.8);
}
```

### 4. 리스트 최적화

긴 리스트를 렌더링할 때는 `ListView.builder`를 사용합니다:

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index].title),
    );
  },
)
```

매우 긴 리스트에는 `ListView.builder` 대신 `ListView.separated`를 사용하여 분리선을 효율적으로 추가할 수 있습니다:

```dart
ListView.separated(
  itemCount: items.length,
  separatorBuilder: (context, index) => const Divider(),
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index].title),
    );
  },
)
```

### 5. const 생성자 사용

가능한 한 많은 위젯에 `const` 생성자를 사용하세요:

```dart
// 바람직하지 않은 예
Widget build(BuildContext context) {
  return Padding(
    padding: EdgeInsets.all(8.0),
    child: Icon(Icons.star),
  );
}

// 바람직한 예
Widget build(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(8.0),
    child: Icon(Icons.star),
  );
}
```

## 메모리 최적화

### 1. 대형 객체 캐싱

자주 사용되는 대형 객체는 캐싱하여 재사용합니다:

```dart
class ImageCache {
  static final Map<String, Image> _cache = {};

  static Image getImage(String url) {
    if (_cache.containsKey(url)) {
      return _cache[url]!;
    }

    final image = Image.network(url);
    _cache[url] = image;
    return image;
  }

  static void clearCache() {
    _cache.clear();
  }
}
```

### 2. 해제 패턴

`StatefulWidget`에서 리소스를 적절히 해제합니다:

```dart
class MyWidget extends StatefulWidget {
  const MyWidget({Key? key}) : super(key: key);

  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late AnimationController _controller;
  late StreamSubscription _subscription;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
    _subscription = someStream.listen((_) {});
  }

  @override
  void dispose() {
    // 리소스 해제
    _controller.dispose();
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### 3. 이미지 크기 최적화

네트워크 이미지를 로드할 때 적절한 크기로 리사이징합니다:

```dart
Image.network(
  'https://example.com/large_image.jpg?width=300&height=200',
  width: 300,
  height: 200,
  fit: BoxFit.cover,
)
```

## 비동기 작업 최적화

### 1. Future와 FutureBuilder 사용

비동기 데이터 로딩은 `FutureBuilder`를 사용합니다:

```dart
FutureBuilder<List<Item>>(
  future: _fetchItems(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    } else if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    } else if (snapshot.hasData) {
      final items = snapshot.data!;
      return ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) => ItemWidget(item: items[index]),
      );
    } else {
      return const Text('No data');
    }
  },
)
```

### 2. 컴퓨팅 집약적 작업 격리

무거운 연산은 별도의 isolate에서 실행합니다:

```dart
import 'dart:isolate';

Future<List<int>> computeFactorials(List<int> numbers) async {
  final receivePort = ReceivePort();

  await Isolate.spawn(_factorialIsolate, {
    'sendPort': receivePort.sendPort,
    'numbers': numbers,
  });

  return await receivePort.first as List<int>;
}

void _factorialIsolate(Map<String, dynamic> data) {
  final SendPort sendPort = data['sendPort'];
  final List<int> numbers = data['numbers'];

  final results = numbers.map(_factorial).toList();

  Isolate.exit(sendPort, results);
}

int _factorial(int n) {
  int result = 1;
  for (int i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// 사용 예시
final results = await computeFactorials([5, 10, 15]);
```

더 간단한 방법은 Flutter의 `compute` 함수를 사용하는 것입니다:

```dart
import 'package:flutter/foundation.dart';

Future<int> calculateFactorial(int n) async {
  return compute(_factorial, n);
}

int _factorial(int n) {
  int result = 1;
  for (int i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```

## 네트워크 최적화

### 1. 요청 캐싱

네트워크 요청 결과를 캐싱하여 중복 요청을 방지합니다:

```dart
class ApiCache {
  static final Map<String, dynamic> _cache = {};
  static final Map<String, DateTime> _timestamps = {};
  static const Duration _maxAge = Duration(minutes: 10);

  static Future<T> get<T>(
    String url,
    Future<T> Function() fetchFunction,
  ) async {
    final now = DateTime.now();

    // 캐시된 데이터가 있고 유효기간 내인지 확인
    if (_cache.containsKey(url) && _timestamps.containsKey(url)) {
      final timestamp = _timestamps[url]!;
      if (now.difference(timestamp) < _maxAge) {
        return _cache[url] as T;
      }
    }

    // 데이터 가져오기
    final result = await fetchFunction();

    // 캐시에 저장
    _cache[url] = result;
    _timestamps[url] = now;

    return result;
  }

  static void clear() {
    _cache.clear();
    _timestamps.clear();
  }
}

// 사용 예시
final data = await ApiCache.get(
  'https://api.example.com/data',
  () => dio.get('https://api.example.com/data'),
);
```

### 2. 지연 로딩 및 페이징

대량의 데이터를 한 번에 로드하지 않고 페이징 처리합니다:

```dart
class PaginatedListView extends StatefulWidget {
  const PaginatedListView({Key? key}) : super(key: key);

  @override
  _PaginatedListViewState createState() => _PaginatedListViewState();
}

class _PaginatedListViewState extends State<PaginatedListView> {
  final List<Item> _items = [];
  int _page = 1;
  bool _isLoading = false;
  bool _hasMore = true;
  final int _pageSize = 20;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _loadMore();

    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent * 0.8) {
        if (!_isLoading && _hasMore) {
          _loadMore();
        }
      }
    });
  }

  Future<void> _loadMore() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final newItems = await fetchItems(_page, _pageSize);

      setState(() {
        _page++;
        _items.addAll(newItems);
        _isLoading = false;
        _hasMore = newItems.length == _pageSize;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _scrollController,
      itemCount: _items.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index < _items.length) {
          return ItemWidget(item: _items[index]);
        } else {
          return const Center(child: CircularProgressIndicator());
        }
      },
    );
  }
}
```

## 앱 시작 시간 최적화

### 1. 지연 초기화

앱 시작 시 모든 리소스를 로드하지 않고 필요할 때 초기화합니다:

```dart
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const HomePage(),
      onGenerateRoute: (settings) {
        // 라우트가 처음 요청될 때만 초기화
        if (settings.name == '/heavy_page') {
          return MaterialPageRoute(
            builder: (context) => const HeavyResourcePage(),
          );
        }
        return null;
      },
    );
  }
}
```

### 2. 유지 상태 최소화

`main.dart`에서 무거운 상태를 초기화하지 않습니다:

```dart
// 지양할 방법
void main() {
  // 무거운 초기화
  final complexData = loadComplexData();
  runApp(MyApp(data: complexData));
}

// 권장 방법
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FutureBuilder<ComplexData>(
        future: loadComplexData(), // 비동기적으로 데이터 로드
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const SplashScreen();
          }
          return HomePage(data: snapshot.data);
        },
      ),
    );
  }
}
```

## Flutter 웹 최적화

### 1. 초기 로드 최적화

Flutter 웹 앱의 초기 로드 시간을 개선합니다:

```dart
// index.html에 스플래시 스크린 추가
<div id="splash">
  <style>
    #splash {
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #3498db;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
  <div class="loader"></div>
</div>
```

### 2. 코드 분할

대규모 웹 앱의 경우 코드 분할을 통해 초기 로드 크기를 줄입니다:

```dart
// 지연 로드 라이브러리
@JS('loadLibrary')
external Future<void> loadMyLibrary();

// 필요할 때 라이브러리 로드
ElevatedButton(
  onPressed: () async {
    await loadMyLibrary();
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const HeavyFeaturePage()),
    );
  },
  child: const Text('Load Feature'),
)
```

## 특정 상황에 대한 최적화

### 1. 텍스트 렌더링 최적화

텍스트가 많은 앱에서는 텍스트 렌더링을 최적화합니다:

```dart
// 정적 텍스트에 const 사용
const Text('Static text that never changes')

// 긴 텍스트는 RichText로 분할
RichText(
  text: TextSpan(
    style: DefaultTextStyle.of(context).style,
    children: <TextSpan>[
      const TextSpan(text: 'First part of text. '),
      TextSpan(
        text: 'Important part. ',
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
      const TextSpan(text: 'Last part of text.'),
    ],
  ),
)
```

### 2. 애니메이션 최적화

애니메이션 성능을 향상시킵니다:

```dart
// 단순한 애니메이션에는 암시적 애니메이션 사용
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeInOut,
  width: _expanded ? 200 : 100,
  height: _expanded ? 200 : 100,
  color: _expanded ? Colors.blue : Colors.red,
)

// 복잡한 애니메이션은 Tween 사용
TweenAnimationBuilder<double>(
  tween: Tween<double>(begin: 0, end: _progress),
  duration: const Duration(milliseconds: 500),
  builder: (context, value, child) {
    return CircularProgressIndicator(value: value);
  },
)
```

## Flutter 프로파일링 및 디버깅

### 1. Flutter Performance 프로파일링

앱 성능을 분석하려면 다음 단계를 따릅니다:

1. 프로파일 모드에서 앱 실행: `flutter run --profile`
2. DevTools 연결
3. Performance 탭에서 타임라인 레코딩
4. 병목 현상 분석

### 2. Flutter Doctor

잠재적인 개발 환경 문제를 확인합니다:

```bash
flutter doctor -v
```

### 3. 메모리 누수 감지

메모리 누수를 찾기 위해 DevTools의 Memory 탭을 사용합니다:

1. Memory 탭 열기
2. 앱 실행 중에 스냅샷 수집
3. 여러 작업 후 두 번째 스냅샷 수집
4. 스냅샷 비교하여 누수 식별

## Flutter 성능 체크리스트

효율적인 앱 개발을 위한 체크리스트:

### 1. 빌드 최적화

- [ ] 가능한 한 모든 위젯에 `const` 생성자 사용
- [ ] 큰 위젯 트리를 작은 위젯으로 분할
- [ ] 긴 리스트에 `ListView.builder` 사용
- [ ] 가능한 경우 `StatelessWidget` 사용

### 2. 렌더링 최적화

- [ ] 자주 변경되는 위젯에 `RepaintBoundary` 사용
- [ ] 이미지에 `cached_network_image` 사용
- [ ] 오프스크린 렌더링 방지 (큰 페이지에 `ListView` 대신 `ListView.builder` 사용)
- [ ] 복잡한 그래픽에 `CustomPainter` 대신 사전 렌더링된 이미지 사용

### 3. 메모리 관리

- [ ] 리소스 제대로 해제 (`dispose` 메서드 구현)
- [ ] 이미지 크기 최적화
- [ ] 대용량 데이터 로드에 페이징 적용
- [ ] 앱 수명 주기에 적절히 대응하여 리소스 관리

### 4. 상태 관리

- [ ] 효율적인 상태 관리 라이브러리 사용 (Riverpod 등)
- [ ] 불필요한 상태 리빌드 방지
- [ ] 중첩된 Provider 최소화

### 5. 네트워크 요청

- [ ] 요청 캐싱 구현
- [ ] 이미지 및 데이터 사전 로드
- [ ] 대량 데이터에 페이징 적용
- [ ] 오프라인 기능 지원

## 결론

Flutter 앱의 성능을 최적화하는 것은 지속적인 과정입니다. 초기 단계부터 성능을 고려하고, 정기적으로 성능을 측정하며, 사용자 경험을 저하시키는 병목 현상을 해결해야 합니다.

최적화 작업을 시작하기 전에 항상 측정을 통해 실제 성능 문제를 식별하고, 코드 복잡성과 성능 사이에서 균형을 유지하는 것이 중요합니다. Flutter DevTools와 프로파일링 기능을 활용하여 앱의 성능을 정기적으로 모니터링하고 개선하세요.

다음 장에서는 Flutter 앱 개발에 유용한 추천 패키지들에 대해 알아보겠습니다.
