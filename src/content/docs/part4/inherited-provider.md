---
title: InheritedWidget과 Provider
---

이 장에서는 Flutter의 위젯 트리를 통해 상태를 공유하는 방법인 `InheritedWidget`과 이를 기반으로 한 `Provider` 패키지에 대해 알아보겠습니다. 이 방식들은 상태 관리를 위한 중요한 도구로, 위젯 트리 전체에 걸쳐 데이터를 효율적으로 공유할 수 있게 해줍니다.

## InheritedWidget 이해하기

`InheritedWidget`은 Flutter 프레임워크에 내장된 위젯으로, 위젯 트리의 하위 항목들에게 데이터를 효율적으로 전달할 수 있게 합니다. 특히 위젯 트리 깊숙한 곳에 있는 위젯이 상위 위젯의 데이터에 접근해야 할 때 매우 유용합니다.

### InheritedWidget의 작동 원리

1. **데이터 저장**: InheritedWidget은 공유하려는 데이터를 저장합니다.
2. **위젯 트리 전파**: 이 데이터는 위젯 트리 아래로 자동으로 전파됩니다.
3. **컨텍스트 접근**: 하위 위젯들은 BuildContext를 통해 상위의 InheritedWidget에 접근할 수 있습니다.
4. **변경 알림**: InheritedWidget이 업데이트되면, 이에 의존하는 모든 위젯들이 자동으로 재빌드됩니다.

### InheritedWidget 구현하기

간단한 테마 데이터를 공유하는 InheritedWidget을 구현해 보겠습니다:

```dart
class ThemeData {
  final Color primaryColor;
  final Color secondaryColor;
  final double fontSize;

  const ThemeData({
    required this.primaryColor,
    required this.secondaryColor,
    required this.fontSize,
  });
}

class ThemeInherited extends InheritedWidget {
  final ThemeData themeData;

  const ThemeInherited({
    Key? key,
    required this.themeData,
    required Widget child,
  }) : super(key: key, child: child);

  // of 메서드: 하위 위젯에서 ThemeInherited 인스턴스를 찾는 정적 메서드
  static ThemeInherited of(BuildContext context) {
    final ThemeInherited? result =
        context.dependOnInheritedWidgetOfExactType<ThemeInherited>();
    assert(result != null, 'ThemeInherited를 찾을 수 없습니다.');
    return result!;
  }

  // 위젯이 업데이트되었을 때 하위 위젯들에게 알릴지 결정하는 메서드
  @override
  bool updateShouldNotify(ThemeInherited oldWidget) {
    return themeData.primaryColor != oldWidget.themeData.primaryColor ||
        themeData.secondaryColor != oldWidget.themeData.secondaryColor ||
        themeData.fontSize != oldWidget.themeData.fontSize;
  }
}
```

### InheritedWidget 사용하기

위에서 만든 ThemeInherited 위젯을 사용하는 방법:

```dart
// 앱의 루트에 InheritedWidget 설정
void main() {
  runApp(
    ThemeInherited(
      themeData: ThemeData(
        primaryColor: Colors.blue,
        secondaryColor: Colors.green,
        fontSize: 16.0,
      ),
      child: MyApp(),
    ),
  );
}

// 하위 위젯에서 데이터 접근
class ThemedText extends StatelessWidget {
  final String text;

  const ThemedText({Key? key, required this.text}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // InheritedWidget에서 테마 데이터 가져오기
    final theme = ThemeInherited.of(context).themeData;

    return Text(
      text,
      style: TextStyle(
        color: theme.primaryColor,
        fontSize: theme.fontSize,
      ),
    );
  }
}
```

### InheritedWidget의 한계

InheritedWidget은 강력하지만 몇 가지 제한사항이 있습니다:

1. **상태 변경 메커니즘 없음**: 데이터를 공유할 수 있지만, 변경할 수 있는 메커니즘은 제공하지 않습니다.
2. **복잡한 구현**: 직접 구현하려면 상용구 코드가 많이 필요합니다.
3. **변경 관리 번거로움**: 상태 변경 시 새 InheritedWidget을 생성하고 위젯 트리를 다시 빌드해야 합니다.

이러한 한계를 해결하기 위해 Provider 패키지가 개발되었습니다.

## Provider 패키지

Provider는 InheritedWidget을 기반으로 구축된 상태 관리 패키지로, 코드를 단순화하고 상태 관리를 더 쉽게 만들어줍니다.

### Provider의 주요 특징

1. **편리한 API**: InheritedWidget을 직접 구현하는 것보다 간단한 API 제공
2. **여러 Provider 유형**: 다양한 사용 사례에 맞는 여러 종류의 Provider 제공
3. **상태 변경 통합**: 상태 변경 메커니즘이 내장되어 있음
4. **의존성 주입**: 테스트와 재사용을 위한 의존성 주입 패턴 지원

### Provider 패키지 설치

pubspec.yaml 파일에 provider 패키지를 추가합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.5 # 최신 버전을 확인하세요
```

### Provider의 종류

Provider 패키지는 다양한 종류의 Provider를 제공합니다:

1. **Provider**: 가장 기본적인 Provider로, 변경되지 않는 데이터를 제공
2. **ChangeNotifierProvider**: ChangeNotifier를 사용하여 변경 가능한 상태를 관리
3. **FutureProvider**: Future로부터 값을 제공
4. **StreamProvider**: Stream으로부터 값을 제공
5. **ProxyProvider**: 다른 Provider의 값에 의존하는 값을 제공
6. **MultiProvider**: 여러 Provider를 한 번에 제공

### 기본 Provider 사용하기

가장 간단한 Provider를 사용하는 예제:

```dart
// 데이터 모델
class User {
  final String name;
  final int age;

  const User({required this.name, required this.age});
}

// Provider 설정
void main() {
  runApp(
    Provider<User>(
      create: (_) => User(name: '홍길동', age: 30),
      child: MyApp(),
    ),
  );
}

// 데이터 사용
class UserInfoPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Provider에서 데이터 가져오기
    final user = Provider.of<User>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Provider 예제'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('이름: ${user.name}'),
            Text('나이: ${user.age}'),
          ],
        ),
      ),
    );
  }
}
```

### ChangeNotifierProvider로 변경 가능한 상태 관리하기

변경 가능한 상태를 관리하는 ChangeNotifierProvider 예제:

```dart
// ChangeNotifier 모델
class Counter with ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();  // 변경 사항을 구독자들에게 알림
  }
}

// Provider 설정
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => Counter(),
      child: MyApp(),
    ),
  );
}

// 상태 사용 및 변경
class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Counter 예제'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Consumer 위젯으로 상태 읽기
            Consumer<Counter>(
              builder: (context, counter, child) {
                return Text(
                  '카운트: ${counter.count}',
                  style: TextStyle(fontSize: 24),
                );
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              // Provider에서 읽고 메서드 호출
              onPressed: () => Provider.of<Counter>(context, listen: false).increment(),
              child: Text('증가'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Provider.of vs Consumer vs context.watch

Provider 패키지는 Provider에서 데이터를 읽는 여러 방법을 제공합니다:

1. **Provider.of<T>(context)**:

   ```dart
   final counter = Provider.of<Counter>(context);
   ```

   - `listen: true`(기본값)이면 데이터 변경 시 위젯 재빌드
   - `listen: false`이면 데이터만 읽고 변경 감지는 하지 않음

2. **Consumer<T>**:

   ```dart
   Consumer<Counter>(
     builder: (context, counter, child) {
       return Text('${counter.count}');
     },
   )
   ```

   - 위젯 트리의 일부만 재빌드할 때 유용
   - `child` 매개변수로 재빌드되지 않는 위젯 지정 가능

3. **context.watch<T>()** (Dart 확장 메서드):

   ```dart
   final counter = context.watch<Counter>();
   ```

   - Provider.of와 유사하지만 더 간결한 구문
   - 변경 감지를 통해 위젯 재빌드

4. **context.read<T>()** (Dart 확장 메서드):

   ```dart
   // 이벤트 핸들러 내에서 사용
   onPressed: () => context.read<Counter>().increment()
   ```

   - 변경 감지 없이 현재 값만 읽음 (Provider.of(..., listen: false)와 동일)

5. **context.select<T, R>(R Function(T) selector)**:
   ```dart
   // UserModel에서 이름만 감시
   final userName = context.select<UserModel, String>((user) => user.name);
   ```
   - 객체의 특정 속성만 감시하여 불필요한 재빌드 방지

### MultiProvider로 여러 Provider 결합하기

여러 Provider를 함께 사용해야 할 때는 MultiProvider를 활용합니다:

```dart
void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserModel()),
        ChangeNotifierProvider(create: (_) => CartModel()),
        Provider(create: (_) => ApiService()),
        FutureProvider(create: (_) => loadInitialSettings()),
      ],
      child: MyApp(),
    ),
  );
}
```

### ProxyProvider로 의존성 있는 Provider 만들기

한 Provider가 다른 Provider에 의존할 때 사용합니다:

```dart
MultiProvider(
  providers: [
    Provider<ApiService>(
      create: (_) => ApiService(),
    ),
    // ApiService에 의존하는 ProductRepository
    ProxyProvider<ApiService, ProductRepository>(
      update: (_, apiService, __) => ProductRepository(apiService),
    ),
    // ProductRepository에 의존하는 ProductViewModel
    ProxyProvider<ProductRepository, ProductViewModel>(
      update: (_, repository, __) => ProductViewModel(repository),
    ),
  ],
  child: MyApp(),
)
```

## 실제 예제: 장바구니 앱

이제 Provider를 사용하여 간단한 장바구니 앱을 구현해 보겠습니다:

### 1. 모델 클래스 정의

```dart
// 상품 모델
class Product {
  final String id;
  final String name;
  final double price;
  final String imageUrl;

  const Product({
    required this.id,
    required this.name,
    required this.price,
    required this.imageUrl,
  });
}

// 장바구니 모델 (ChangeNotifier를 상속)
class CartModel extends ChangeNotifier {
  final List<Product> _items = [];

  // 읽기 전용 접근자
  List<Product> get items => List.unmodifiable(_items);
  int get itemCount => _items.length;
  double get totalPrice => _items.fold(0, (sum, item) => sum + item.price);

  // 상품 추가
  void addProduct(Product product) {
    _items.add(product);
    notifyListeners();
  }

  // 상품 제거
  void removeProduct(Product product) {
    _items.remove(product);
    notifyListeners();
  }

  // 장바구니 비우기
  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}

// 상품 저장소
class ProductRepository {
  // 상품 목록 (실제로는 API에서 가져옴)
  List<Product> getProducts() {
    return [
      Product(
        id: '1',
        name: '노트북',
        price: 1200000,
        imageUrl: 'assets/laptop.jpg',
      ),
      Product(
        id: '2',
        name: '스마트폰',
        price: 800000,
        imageUrl: 'assets/smartphone.jpg',
      ),
      Product(
        id: '3',
        name: '헤드폰',
        price: 250000,
        imageUrl: 'assets/headphones.jpg',
      ),
      Product(
        id: '4',
        name: '스마트워치',
        price: 350000,
        imageUrl: 'assets/smartwatch.jpg',
      ),
    ];
  }
}
```

### 2. Provider 설정

```dart
void main() {
  runApp(
    MultiProvider(
      providers: [
        // 상품 저장소 제공
        Provider<ProductRepository>(
          create: (_) => ProductRepository(),
        ),
        // 장바구니 모델 제공
        ChangeNotifierProvider<CartModel>(
          create: (_) => CartModel(),
        ),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '장바구니 앱',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: ProductListPage(),
    );
  }
}
```

### 3. 상품 목록 페이지

```dart
class ProductListPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 상품 저장소에서 상품 목록 가져오기
    final productRepository = Provider.of<ProductRepository>(context);
    final products = productRepository.getProducts();

    return Scaffold(
      appBar: AppBar(
        title: Text('상품 목록'),
        actions: [
          // 장바구니 아이콘과 상품 수 표시
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: Icon(Icons.shopping_cart),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => CartPage()),
                  );
                },
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Consumer<CartModel>(
                  builder: (_, cart, __) {
                    return cart.itemCount > 0
                        ? CircleAvatar(
                            backgroundColor: Colors.red,
                            radius: 8,
                            child: Text(
                              '${cart.itemCount}',
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.white,
                              ),
                            ),
                          )
                        : SizedBox.shrink();
                  },
                ),
              ),
            ],
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          final product = products[index];
          return Card(
            margin: EdgeInsets.all(8.0),
            child: ListTile(
              leading: Image.asset(
                product.imageUrl,
                width: 56,
                height: 56,
                errorBuilder: (context, error, stackTrace) {
                  // 이미지 로드 실패 시 대체 아이콘
                  return Icon(Icons.image, size: 56);
                },
              ),
              title: Text(product.name),
              subtitle: Text('₩${product.price.toStringAsFixed(0)}'),
              trailing: Consumer<CartModel>(
                builder: (_, cart, __) {
                  return IconButton(
                    icon: Icon(Icons.add_shopping_cart),
                    onPressed: () {
                      cart.addProduct(product);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('${product.name} 추가됨')),
                      );
                    },
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
```

### 4. 장바구니 페이지

```dart
class CartPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('장바구니'),
      ),
      body: Consumer<CartModel>(
        builder: (context, cart, child) {
          if (cart.items.isEmpty) {
            return Center(
              child: Text('장바구니가 비었습니다'),
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: cart.items.length,
                  itemBuilder: (context, index) {
                    final product = cart.items[index];
                    return ListTile(
                      leading: Image.asset(
                        product.imageUrl,
                        width: 56,
                        height: 56,
                        errorBuilder: (context, error, stackTrace) {
                          return Icon(Icons.image, size: 56);
                        },
                      ),
                      title: Text(product.name),
                      subtitle: Text('₩${product.price.toStringAsFixed(0)}'),
                      trailing: IconButton(
                        icon: Icon(Icons.remove_circle),
                        onPressed: () {
                          cart.removeProduct(product);
                        },
                      ),
                    );
                  },
                ),
              ),
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 4,
                      offset: Offset(0, -2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      '총 결제 금액: ₩${cart.totalPrice.toStringAsFixed(0)}',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 16),
                    ElevatedButton(
                      child: Text('결제하기'),
                      onPressed: () {
                        // 결제 로직 구현
                        showDialog(
                          context: context,
                          builder: (_) => AlertDialog(
                            title: Text('결제 확인'),
                            content: Text('결제가 완료되었습니다!'),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  cart.clearCart();
                                  Navigator.pop(context);
                                  Navigator.pop(context); // 이전 화면으로 돌아가기
                                },
                                child: Text('확인'),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
```

## Provider 사용 시 Best Practices

Provider를 효과적으로 사용하기 위한 몇 가지 권장사항:

### 1. 모델 캡슐화

상태 모델 내부 구현을 캡슐화하여 불변성을 유지합니다:

```dart
// 좋은 예시
class UserModel extends ChangeNotifier {
  String _name = '';
  String get name => _name;

  void updateName(String newName) {
    _name = newName;
    notifyListeners();
  }
}

// 나쁜 예시
class UserModel extends ChangeNotifier {
  String name = ''; // public 필드

  void updateName(String newName) {
    name = newName;
    notifyListeners();
  }
}
```

### 2. UI에서 비즈니스 로직 분리

비즈니스 로직을 모델 클래스에 위치시킵니다:

```dart
// 좋은 예시 - 모델에 로직 포함
class CartModel extends ChangeNotifier {
  double get totalPrice => _items.fold(0, (sum, item) => sum + item.price);

  void checkout() {
    // 결제 처리 로직
    _items.clear();
    notifyListeners();
  }
}

// Widget 코드에서는 간단히 호출
ElevatedButton(
  onPressed: () => context.read<CartModel>().checkout(),
  child: Text('결제하기'),
)
```

### 3. 위젯 재빌드 최적화

필요한 부분만 재빌드되도록 설계합니다:

```dart
// 좋은 예시 - 필요한 부분만 Consumer로 감싸기
Scaffold(
  appBar: AppBar(
    title: Text('장바구니'),
    actions: [
      // 장바구니 아이콘만 업데이트
      Consumer<CartModel>(
        builder: (_, cart, __) {
          return Badge(
            label: Text('${cart.itemCount}'),
            child: IconButton(
              icon: Icon(Icons.shopping_cart),
              onPressed: () {},
            ),
          );
        },
      ),
    ],
  ),
  // 나머지 UI는 변경되지 않음
  body: ProductListView(),
)
```

### 4. 범위에 맞는 Provider 위치 선택

Provider의 위치를 적절하게 선택하여 범위를 제한합니다:

```dart
// 앱 전체에서 필요한 Provider는 최상위에 배치
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeModel(),
      child: MyApp(),
    ),
  );
}

// 특정 화면에서만 필요한 Provider는 해당 화면 위젯에 배치
class ProductsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ProductsViewModel(),
      child: ProductsContent(),
    );
  }
}
```

### 5. Provider 조합 패턴

여러 상태가 함께 작동해야 할 때 ProxyProvider를 활용합니다:

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => AuthModel()),
    ChangeNotifierProvider(create: (_) => ThemeModel()),
    // AuthModel과 ThemeModel에 의존하는 SettingsModel
    ProxyProvider2<AuthModel, ThemeModel, SettingsModel>(
      update: (_, auth, theme, __) => SettingsModel(auth, theme),
    ),
  ],
  child: MyApp(),
)
```

## InheritedWidget vs Provider vs 기타 상태 관리 솔루션

각 상태 관리 솔루션의 장단점을 비교해보겠습니다:

### InheritedWidget

**장점**:

- Flutter의 기본 API - 추가 패키지 필요 없음
- 위젯 트리를 통한 효율적인 데이터 공유

**단점**:

- 상태 변경 메커니즘 부재
- 복잡한 구현
- 반복적인 코드 필요

### Provider

**장점**:

- 간단한 API
- ChangeNotifier와 통합되어 상태 변경 쉬움
- 여러 유형의 Provider 제공
- 의존성 주입 패턴

**단점**:

- 대규모 앱에서는 구조화가 필요
- ChangeNotifier의 뮤터블 상태

### Riverpod (Provider의 개선된 버전)

**장점**:

- 컴파일 시간에 안전성 확인
- Provider와 유사하지만 개선된 API
- 고정된 Provider Tree 없음
- 더 나은 테스트 가능성

**단점**:

- Provider보다 약간 더 복잡한 API
- 러닝 커브가 더 높을 수 있음

### 기타 솔루션 (Bloc, Redux, MobX 등)

**Bloc/Cubit**:

- 사용 흐름(Stream)과 상태 관리를 명확히 분리
- 테스트하기 쉬움
- 비동기 작업에 강점
- 더 많은 코드가 필요

**Redux**:

- 예측 가능한 단방향 데이터 흐름
- 중앙 집중식 상태 관리
- 디버깅이 쉬움
- 구현이 더 복잡할 수 있음

**MobX**:

- 반응형 프로그래밍
- 더 적은 코드로 구현
- 자동 반응 추적
- 개념을 이해하는 데 시간이 필요

## 요약

- **InheritedWidget**은 Flutter의 내장 메커니즘으로, 위젯 트리를 통해 데이터를 공유합니다.
- **Provider**는 InheritedWidget 기반의 패키지로, 더 쉬운 API와 상태 변경 메커니즘을 제공합니다.
- Provider는 다양한 종류의 Provider(ChangeNotifierProvider, FutureProvider 등)를 통해 다양한 사용 사례를 지원합니다.
- 효과적인 Provider 사용을 위해 모델 캡슐화, 비즈니스 로직 분리, 재빌드 최적화 등의 Best Practice를 적용해야 합니다.
- Provider는 중소규모 앱에서 좋은 선택이며, 대규모 앱에서는 Riverpod이나 Bloc 같은 더 구조화된 솔루션을 고려할 수 있습니다.

다음 장에서는 Provider의 다음 세대 기술인 Riverpod에 대해 살펴보겠습니다.
