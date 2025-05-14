---
title: 단위 테스트
---

소프트웨어 개발에서 테스트는 코드의 정확성을 검증하고 결함을 조기에 발견하는 데 핵심적인 역할을 합니다. 이 장에서는 Flutter 애플리케이션의 단위 테스트에 대해 다루겠습니다. 단위 테스트는 코드의 가장 작은 단위(일반적으로 함수나 메서드)가 예상대로 작동하는지 확인하는 테스트입니다.

## 단위 테스트의 중요성

단위 테스트는 다음과 같은 여러 이유로 중요합니다:

1. **버그 조기 발견**: 코드 변경이 기존 기능을 손상시키지 않는지 확인할 수 있습니다.
2. **리팩토링 신뢰성**: 코드를 변경하더라도 동작이 여전히 올바른지 확인할 수 있습니다.
3. **문서화**: 테스트는 코드가 어떻게 동작해야 하는지 보여주는 생생한 문서 역할을 합니다.
4. **설계 개선**: 테스트를 작성하면 종종 더 나은 코드 설계로 이어집니다.
5. **개발 속도 향상**: 장기적으로 디버깅 시간이 줄어들어 개발 속도가 빨라집니다.

## Flutter에서 단위 테스트 설정하기

### 1. 의존성 추가

Flutter 프로젝트에서 단위 테스트를 시작하려면 `pubspec.yaml` 파일에 필요한 패키지를 추가해야 합니다:

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  test: ^1.24.1
```

`flutter_test`는 Flutter SDK의 일부로, Flutter 위젯을 테스트하는 데 필요한 도구를 제공합니다. `test` 패키지는 일반 Dart 코드를 테스트하는 데 사용됩니다.

### 2. 테스트 파일 구성

테스트 파일은 일반적으로 프로젝트의 `test` 디렉토리에 위치합니다. 테스트 파일 이름은 관례적으로 `{파일명}_test.dart` 형식을 따릅니다:

```
my_app/
  ├── lib/
  │    ├── models/
  │    │    └── user.dart
  │    └── utils/
  │         └── validator.dart
  └── test/
       ├── models/
       │    └── user_test.dart
       └── utils/
            └── validator_test.dart
```

## 기본 단위 테스트 작성하기

### 1. 간단한 유틸리티 함수 테스트

먼저 테스트할 간단한 유틸리티 함수를 살펴보겠습니다:

```dart
// lib/utils/calculator.dart
class Calculator {
  int add(int a, int b) => a + b;
  int subtract(int a, int b) => a - b;
  int multiply(int a, int b) => a * b;
  double divide(int a, int b) {
    if (b == 0) {
      throw ArgumentError('Cannot divide by zero');
    }
    return a / b;
  }
}
```

이제 이 `Calculator` 클래스의 단위 테스트를 작성해 보겠습니다:

```dart
// test/utils/calculator_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/utils/calculator.dart';

void main() {
  late Calculator calculator;

  setUp(() {
    calculator = Calculator();
  });

  group('Calculator', () {
    test('add returns the sum of two numbers', () {
      // Arrange & Act
      final result = calculator.add(2, 3);

      // Assert
      expect(result, 5);
    });

    test('subtract returns the difference of two numbers', () {
      expect(calculator.subtract(5, 2), 3);
    });

    test('multiply returns the product of two numbers', () {
      expect(calculator.multiply(3, 4), 12);
    });

    test('divide returns the quotient of two numbers', () {
      expect(calculator.divide(10, 2), 5.0);
    });

    test('divide throws ArgumentError when dividing by zero', () {
      expect(
        () => calculator.divide(10, 0),
        throwsA(isA<ArgumentError>()),
      );
    });
  });
}
```

### 2. 테스트 실행하기

테스트를 실행하는 방법은 여러 가지가 있습니다:

**명령줄에서 실행:**

```bash
flutter test
```

특정 테스트 파일만 실행:

```bash
flutter test test/utils/calculator_test.dart
```

**IDE에서 실행:**

대부분의 IDE(예: VS Code, Android Studio)는 테스트 파일 옆에 실행 버튼을 제공하여 쉽게 테스트를 실행할 수 있습니다.

## 모델 클래스 테스트

모델 클래스의 테스트는 특히 JSON 변환과 관련된 코드를 검증하는 데 유용합니다:

```dart
// lib/models/user.dart
class User {
  final int id;
  final String name;
  final String email;

  User({
    required this.id,
    required this.name,
    required this.email,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
    };
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User &&
        other.id == id &&
        other.name == name &&
        other.email == email;
  }

  @override
  int get hashCode => id.hashCode ^ name.hashCode ^ email.hashCode;
}
```

이 `User` 클래스에 대한 테스트:

```dart
// test/models/user_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/models/user.dart';

void main() {
  group('User', () {
    test('fromJson creates a User instance correctly', () {
      // Arrange
      final json = {
        'id': 1,
        'name': '홍길동',
        'email': 'hong@example.com',
      };

      // Act
      final user = User.fromJson(json);

      // Assert
      expect(user.id, 1);
      expect(user.name, '홍길동');
      expect(user.email, 'hong@example.com');
    });

    test('toJson returns correct map', () {
      // Arrange
      final user = User(
        id: 1,
        name: '홍길동',
        email: 'hong@example.com',
      );

      // Act
      final json = user.toJson();

      // Assert
      expect(json, {
        'id': 1,
        'name': '홍길동',
        'email': 'hong@example.com',
      });
    });

    test('equality works correctly', () {
      // Arrange
      final user1 = User(id: 1, name: '홍길동', email: 'hong@example.com');
      final user2 = User(id: 1, name: '홍길동', email: 'hong@example.com');
      final user3 = User(id: 2, name: '김철수', email: 'kim@example.com');

      // Assert
      expect(user1, equals(user2));
      expect(user1, isNot(equals(user3)));
    });

    test('fromJson throws when fields are missing', () {
      // Arrange
      final incompleteJson = {
        'id': 1,
        'name': '홍길동',
        // email이 누락됨
      };

      // Act & Assert
      expect(
        () => User.fromJson(incompleteJson),
        throwsA(isA<TypeError>()),
      );
    });
  });
}
```

## 비동기 코드 테스트

Flutter 앱에서는 네트워크 요청, 파일 입출력 등 비동기 코드가 흔합니다. 이러한 코드를 테스트하는 방법을 살펴보겠습니다:

```dart
// lib/services/user_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class UserService {
  final String baseUrl;
  final http.Client client;

  UserService({
    required this.baseUrl,
    required this.client,
  });

  Future<User> fetchUser(int id) async {
    final response = await client.get(Uri.parse('$baseUrl/users/$id'));

    if (response.statusCode == 200) {
      return User.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load user');
    }
  }

  Future<List<User>> fetchUsers() async {
    final response = await client.get(Uri.parse('$baseUrl/users'));

    if (response.statusCode == 200) {
      final List<dynamic> userJsonList = json.decode(response.body);
      return userJsonList.map((json) => User.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load users');
    }
  }
}
```

이 `UserService` 클래스의 단위 테스트:

```dart
// test/services/user_service_test.dart
import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:my_app/models/user.dart';
import 'package:my_app/services/user_service.dart';

import 'user_service_test.mocks.dart';

// Mockito를 사용하여 http.Client 클래스를 모방하는 Mock 클래스 생성
@GenerateMocks([http.Client])
void main() {
  late MockClient mockClient;
  late UserService userService;

  setUp(() {
    mockClient = MockClient();
    userService = UserService(
      baseUrl: 'https://api.example.com',
      client: mockClient,
    );
  });

  group('UserService', () {
    test('fetchUser returns a User if the http call completes successfully', () async {
      // Arrange
      final userData = {
        'id': 1,
        'name': '홍길동',
        'email': 'hong@example.com',
      };

      // mock 클라이언트가 GET 요청을 받으면 가짜 응답을 반환하도록 설정
      when(mockClient.get(Uri.parse('https://api.example.com/users/1')))
          .thenAnswer((_) async => http.Response(json.encode(userData), 200));

      // Act
      final user = await userService.fetchUser(1);

      // Assert
      expect(user.id, 1);
      expect(user.name, '홍길동');
      expect(user.email, 'hong@example.com');
    });

    test('fetchUser throws an exception if the http call fails', () async {
      // Arrange
      when(mockClient.get(Uri.parse('https://api.example.com/users/1')))
          .thenAnswer((_) async => http.Response('Not Found', 404));

      // Act & Assert
      expect(userService.fetchUser(1), throwsException);
    });

    test('fetchUsers returns a list of Users if the http call completes successfully', () async {
      // Arrange
      final usersData = [
        {
          'id': 1,
          'name': '홍길동',
          'email': 'hong@example.com',
        },
        {
          'id': 2,
          'name': '김철수',
          'email': 'kim@example.com',
        },
      ];

      when(mockClient.get(Uri.parse('https://api.example.com/users')))
          .thenAnswer((_) async => http.Response(json.encode(usersData), 200));

      // Act
      final users = await userService.fetchUsers();

      // Assert
      expect(users.length, 2);
      expect(users[0].id, 1);
      expect(users[0].name, '홍길동');
      expect(users[1].id, 2);
      expect(users[1].name, '김철수');
    });
  });
}
```

이 테스트를 실행하기 전에 Mockito 패키지를 설치하고 코드를 생성해야 합니다:

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito: ^5.4.2
  build_runner: ^2.4.6
```

그리고 다음 명령어를 실행하여 Mock 클래스를 생성합니다:

```bash
flutter pub run build_runner build
```

## 비즈니스 로직 레이어(Provider, Riverpod, Bloc 등) 테스트

상태 관리 라이브러리를 사용하는 비즈니스 로직 레이어 테스트를 살펴보겠습니다. 여기서는 Riverpod를 예시로 들겠습니다:

```dart
// lib/providers/counter_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'counter_provider.g.dart';

@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() {
    state = state + 1;
  }

  void decrement() {
    if (state > 0) {
      state = state - 1;
    }
  }

  void reset() {
    state = 0;
  }
}
```

이 Riverpod 프로바이더의 단위 테스트:

```dart
// test/providers/counter_provider_test.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/providers/counter_provider.dart';

void main() {
  late ProviderContainer container;

  setUp(() {
    container = ProviderContainer();
  });

  tearDown(() {
    container.dispose();
  });

  group('CounterProvider', () {
    test('initial value is 0', () {
      final value = container.read(counterProvider);
      expect(value, 0);
    });

    test('increment increases state by 1', () {
      final notifier = container.read(counterProvider.notifier);

      // 초기값 확인
      expect(container.read(counterProvider), 0);

      // 증가 실행
      notifier.increment();

      // 변경된 값 확인
      expect(container.read(counterProvider), 1);
    });

    test('decrement decreases state by 1', () {
      final notifier = container.read(counterProvider.notifier);

      // 초기값을 1로 변경
      notifier.increment();
      expect(container.read(counterProvider), 1);

      // 감소 실행
      notifier.decrement();

      // 변경된 값 확인
      expect(container.read(counterProvider), 0);
    });

    test('decrement does not go below 0', () {
      final notifier = container.read(counterProvider.notifier);

      // 초기값 확인
      expect(container.read(counterProvider), 0);

      // 감소 실행
      notifier.decrement();

      // 여전히 0이어야 함
      expect(container.read(counterProvider), 0);
    });

    test('reset sets state back to 0', () {
      final notifier = container.read(counterProvider.notifier);

      // 증가 실행
      notifier.increment();
      notifier.increment();
      expect(container.read(counterProvider), 2);

      // 리셋 실행
      notifier.reset();

      // 0으로 리셋됨
      expect(container.read(counterProvider), 0);
    });

    test('confirms state changes correctly with multiple operations', () {
      final notifier = container.read(counterProvider.notifier);

      notifier.increment(); // 1
      notifier.increment(); // 2
      notifier.decrement(); // 1
      notifier.increment(); // 2
      notifier.increment(); // 3

      expect(container.read(counterProvider), 3);
    });
  });
}
```

## Freezed 또는 json_serializable 모델 테스트

Freezed나 json_serializable을 사용하는 모델의 테스트 예시입니다:

```dart
// lib/models/product.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'product.freezed.dart';
part 'product.g.dart';

@freezed
class Product with _$Product {
  const factory Product({
    required int id,
    required String name,
    required double price,
    @Default(0) int stock,
    String? description,
    @Default([]) List<String> categories,
  }) = _Product;

  factory Product.fromJson(Map<String, dynamic> json) => _$ProductFromJson(json);
}
```

이 Freezed 모델의 테스트:

```dart
// test/models/product_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/models/product.dart';

void main() {
  group('Product', () {
    test('fromJson creates a valid Product instance', () {
      // Arrange
      final json = {
        'id': 1,
        'name': '노트북',
        'price': 1200000.0,
        'stock': 10,
        'description': '고성능 노트북',
        'categories': ['전자제품', '컴퓨터'],
      };

      // Act
      final product = Product.fromJson(json);

      // Assert
      expect(product.id, 1);
      expect(product.name, '노트북');
      expect(product.price, 1200000.0);
      expect(product.stock, 10);
      expect(product.description, '고성능 노트북');
      expect(product.categories, ['전자제품', '컴퓨터']);
    });

    test('fromJson creates a valid Product with default values', () {
      // Arrange
      final json = {
        'id': 1,
        'name': '노트북',
        'price': 1200000.0,
      };

      // Act
      final product = Product.fromJson(json);

      // Assert
      expect(product.id, 1);
      expect(product.name, '노트북');
      expect(product.price, 1200000.0);
      expect(product.stock, 0); // 기본값
      expect(product.description, null); // 기본값(null)
      expect(product.categories, isEmpty); // 기본값(빈 배열)
    });

    test('toJson returns valid JSON', () {
      // Arrange
      final product = Product(
        id: 1,
        name: '노트북',
        price: 1200000.0,
        stock: 10,
        description: '고성능 노트북',
        categories: ['전자제품', '컴퓨터'],
      );

      // Act
      final json = product.toJson();

      // Assert
      expect(json['id'], 1);
      expect(json['name'], '노트북');
      expect(json['price'], 1200000.0);
      expect(json['stock'], 10);
      expect(json['description'], '고성능 노트북');
      expect(json['categories'], ['전자제품', '컴퓨터']);
    });

    test('copyWith works correctly', () {
      // Arrange
      final product = Product(
        id: 1,
        name: '노트북',
        price: 1200000.0,
      );

      // Act
      final updatedProduct = product.copyWith(
        name: '고성능 노트북',
        price: 1300000.0,
        stock: 5,
      );

      // Assert
      expect(updatedProduct.id, 1); // 변경되지 않음
      expect(updatedProduct.name, '고성능 노트북'); // 변경됨
      expect(updatedProduct.price, 1300000.0); // 변경됨
      expect(updatedProduct.stock, 5); // 변경됨
    });

    test('두 제품이 같은 값을 가질 때 동등하게 취급된다', () {
      // Arrange
      final product1 = Product(
        id: 1,
        name: '노트북',
        price: 1200000.0,
      );

      final product2 = Product(
        id: 1,
        name: '노트북',
        price: 1200000.0,
      );

      // Assert
      expect(product1, equals(product2));
    });
  });
}
```

## 복잡한 비즈니스 로직 테스트

복잡한 비즈니스 로직이 포함된 클래스의 테스트 예시입니다:

```dart
// lib/services/cart_service.dart
import '../models/product.dart';

class CartItem {
  final Product product;
  final int quantity;

  CartItem({required this.product, required this.quantity});

  double get totalPrice => product.price * quantity;

  CartItem copyWith({int? quantity}) {
    return CartItem(
      product: product,
      quantity: quantity ?? this.quantity,
    );
  }
}

class CartService {
  final Map<int, CartItem> _items = {};

  List<CartItem> get items => _items.values.toList();

  int get itemCount => _items.values.fold(0, (sum, item) => sum + item.quantity);

  double get totalAmount => _items.values.fold(
        0,
        (sum, item) => sum + item.totalPrice,
      );

  void addProduct(Product product, {int quantity = 1}) {
    if (product.stock < quantity) {
      throw Exception('재고가 부족합니다');
    }

    if (_items.containsKey(product.id)) {
      final existingItem = _items[product.id]!;
      final newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw Exception('재고가 부족합니다');
      }

      _items[product.id] = existingItem.copyWith(quantity: newQuantity);
    } else {
      _items[product.id] = CartItem(product: product, quantity: quantity);
    }
  }

  void updateQuantity(int productId, int quantity) {
    if (!_items.containsKey(productId)) {
      throw Exception('장바구니에 해당 상품이 없습니다');
    }

    final item = _items[productId]!;

    if (quantity <= 0) {
      _items.remove(productId);
      return;
    }

    if (item.product.stock < quantity) {
      throw Exception('재고가 부족합니다');
    }

    _items[productId] = item.copyWith(quantity: quantity);
  }

  void removeProduct(int productId) {
    _items.remove(productId);
  }

  void clear() {
    _items.clear();
  }

  bool hasProduct(int productId) {
    return _items.containsKey(productId);
  }
}
```

이 `CartService` 클래스의 단위 테스트:

```dart
// test/services/cart_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/models/product.dart';
import 'package:my_app/services/cart_service.dart';

void main() {
  late CartService cartService;
  late Product laptop;
  late Product phone;

  setUp(() {
    cartService = CartService();

    laptop = Product(
      id: 1,
      name: '노트북',
      price: 1200000.0,
      stock: 10,
    );

    phone = Product(
      id: 2,
      name: '스마트폰',
      price: 800000.0,
      stock: 5,
    );
  });

  group('CartService', () {
    test('초기 장바구니는 비어있다', () {
      expect(cartService.items, isEmpty);
      expect(cartService.itemCount, 0);
      expect(cartService.totalAmount, 0);
    });

    test('상품을 장바구니에 추가할 수 있다', () {
      // Act
      cartService.addProduct(laptop);

      // Assert
      expect(cartService.items.length, 1);
      expect(cartService.items[0].product, laptop);
      expect(cartService.items[0].quantity, 1);
      expect(cartService.itemCount, 1);
      expect(cartService.totalAmount, 1200000.0);
    });

    test('같은 상품을 추가하면 수량이 증가한다', () {
      // Arrange
      cartService.addProduct(laptop);

      // Act
      cartService.addProduct(laptop);

      // Assert
      expect(cartService.items.length, 1);
      expect(cartService.items[0].quantity, 2);
      expect(cartService.itemCount, 2);
      expect(cartService.totalAmount, 2400000.0);
    });

    test('재고보다 많은 수량을 추가하려고 하면 예외가 발생한다', () {
      // Act & Assert
      expect(
        () => cartService.addProduct(laptop, quantity: 11),
        throwsException,
      );
    });

    test('장바구니에 있는 상품의 수량을 업데이트할 수 있다', () {
      // Arrange
      cartService.addProduct(laptop);

      // Act
      cartService.updateQuantity(laptop.id, 3);

      // Assert
      expect(cartService.items[0].quantity, 3);
      expect(cartService.itemCount, 3);
      expect(cartService.totalAmount, 3600000.0);
    });

    test('수량을 0 이하로 설정하면 상품이 장바구니에서 제거된다', () {
      // Arrange
      cartService.addProduct(laptop);

      // Act
      cartService.updateQuantity(laptop.id, 0);

      // Assert
      expect(cartService.items, isEmpty);
    });

    test('존재하지 않는 상품의 수량을 업데이트하려고 하면 예외가 발생한다', () {
      // Act & Assert
      expect(
        () => cartService.updateQuantity(999, 1),
        throwsException,
      );
    });

    test('상품을 장바구니에서 제거할 수 있다', () {
      // Arrange
      cartService.addProduct(laptop);
      cartService.addProduct(phone);
      expect(cartService.items.length, 2);

      // Act
      cartService.removeProduct(laptop.id);

      // Assert
      expect(cartService.items.length, 1);
      expect(cartService.items[0].product, phone);
    });

    test('장바구니를 비울 수 있다', () {
      // Arrange
      cartService.addProduct(laptop);
      cartService.addProduct(phone);
      expect(cartService.items.length, 2);

      // Act
      cartService.clear();

      // Assert
      expect(cartService.items, isEmpty);
      expect(cartService.itemCount, 0);
      expect(cartService.totalAmount, 0);
    });

    test('hasProduct는 상품의 존재 여부를 올바르게 확인한다', () {
      // Arrange
      cartService.addProduct(laptop);

      // Assert
      expect(cartService.hasProduct(laptop.id), true);
      expect(cartService.hasProduct(phone.id), false);
    });

    test('여러 상품을 추가하면 totalAmount가 올바르게 계산된다', () {
      // Act
      cartService.addProduct(laptop); // 1,200,000
      cartService.addProduct(phone, quantity: 2); // 800,000 * 2 = 1,600,000

      // Assert
      expect(cartService.itemCount, 3);
      expect(cartService.totalAmount, 2800000.0);
    });
  });
}
```

## 테스트 커버리지 측정하기

테스트 커버리지는 코드가 테스트에 의해 얼마나 실행되었는지를 나타내는 지표입니다. Flutter에서는 다음과 같이 커버리지를 측정할 수 있습니다:

```bash
flutter test --coverage
```

이 명령어는 테스트를 실행하고 `coverage/lcov.info` 파일을 생성합니다. 이 파일을 사람이 읽기 쉬운 HTML 리포트로 변환하려면 `lcov` 도구를 사용합니다:

```bash
genhtml coverage/lcov.info -o coverage/html
```

그런 다음 `coverage/html/index.html` 파일을 브라우저에서 열어 커버리지 리포트를 확인할 수 있습니다.

## 단위 테스트 모범 사례

### 1. AAA 패턴 사용하기

AAA(Arrange, Act, Assert) 패턴은 테스트를 구조화하는 명확한 방법을 제공합니다:

- **Arrange**: 테스트에 필요한 데이터와 객체를 설정합니다.
- **Act**: 테스트하려는 동작을 실행합니다.
- **Assert**: 예상 결과를 실제 결과와 비교합니다.

### 2. 테스트 이름을 명확하게 지정하기

```dart
// 좋지 않은 예
test('add', () {
  expect(calculator.add(2, 3), 5);
});

// 좋은 예
test('add returns the sum of two numbers', () {
  expect(calculator.add(2, 3), 5);
});
```

### 3. 테스트 그룹화하기

관련 테스트를 `group` 함수를 사용하여 그룹화하면 테스트 출력을 더 잘 구조화할 수 있습니다:

```dart
group('Calculator', () {
  group('add', () {
    test('returns the sum of two positive numbers', () {
      // ...
    });

    test('returns the correct sum when one number is negative', () {
      // ...
    });
  });

  group('divide', () {
    test('returns the quotient of two numbers', () {
      // ...
    });

    test('throws ArgumentError when dividing by zero', () {
      // ...
    });
  });
});
```

### 4. 중복 제거하기

`setUp`과 `tearDown` 함수를 사용하여 테스트 간에 공통 코드를 추출하면 테스트의 가독성과 유지보수성이 향상됩니다.

### 5. 의미 있는 어설션 사용하기

테스트가 실패했을 때 무엇이 잘못되었는지 명확하게 나타내는 어설션을 사용하세요:

```dart
// 좋지 않은 예
expect(user.toJson(), json); // 오류 메시지가 모호할 수 있음

// 좋은 예: 개별 필드 테스트
expect(user.toJson()['id'], json['id']);
expect(user.toJson()['name'], json['name']);
expect(user.toJson()['email'], json['email']);
```

### 6. 테스트 분리 유지하기

각 테스트는 독립적이어야 하며 다른 테스트나 외부 상태에 의존해서는 안 됩니다. 테스트의 순서가 결과에 영향을 미치지 않아야 합니다.

### 7. 경계 조건 테스트하기

함수나 메서드의 동작을 검증할 때는 일반적인 케이스뿐만 아니라 경계 조건도 테스트하세요. 예를 들어:

- 빈 리스트나 맵
- null 값 (nullable 필드인 경우)
- 음수, 0, 매우 큰 숫자
- 매우 긴 문자열 또는 빈 문자열

### 8. 실패 케이스 테스트하기

함수나 메서드가 오류를 올바르게 처리하는지 확인하기 위해 실패 케이스도 테스트하세요:

```dart
test('fetchUser throws exception for non-existent user', () {
  // Act & Assert
  expect(userService.fetchUser(-1), throwsException);
});
```

## 결론

단위 테스트는 코드의 신뢰성을 높이는 데 매우 중요합니다. Flutter에서 단위 테스트를 작성하면 앱의 품질이 향상되고, 버그를 조기에 발견할 수 있으며, 코드의 유지보수성이 개선됩니다. 이 장에서는 Dart 함수, 모델 클래스, 비동기 코드, 비즈니스 로직 등 다양한 코드 유형에 대한 단위 테스트 작성 방법을 살펴보았습니다.

가장 좋은 방법은 처음부터 테스트를 작성하는 것이지만, 기존 프로젝트에서도 점진적으로 테스트를 추가하여 이점을 얻을 수 있습니다. 테스트 주도 개발(TDD) 접근 방식을 사용하면 더 견고하고 유지보수하기 쉬운 코드베이스를 구축하는 데 도움이 됩니다.

다음 장에서는 위젯 테스트에 대해 자세히 알아보겠습니다. 위젯 테스트는 단위 테스트보다 한 단계 더 나아가 Flutter 위젯의 동작과 상호작용을 테스트합니다.
