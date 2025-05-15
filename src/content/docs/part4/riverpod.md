---
title: Riverpod 소개 및 실습
---

## Riverpod이란?

Riverpod는 "Provider"의 애너그램(글자를 재배열한 단어)으로, Provider의 제한사항을 해결하기 위해 처음부터 다시 설계된 상태 관리 라이브러리입니다. Provider가 InheritedWidget을 기반으로 하는 반면, Riverpod는 위젯 트리와 완전히 독립적으로 작동합니다.


### Riverpod vs Provider

Riverpod가 Provider와 비교하여 갖는 주요 장점은 다음과 같습니다:

1. **컴파일 타임 안전성**: 존재하지 않는 Provider를 참조하면 컴파일 오류 발생
2. **위젯 트리 독립성**: BuildContext 없이도 Provider에 접근 가능
3. **Provider 결합**: 여러 Provider를 쉽게 결합 가능
4. **자동 캐싱 및 중복 제거**: 동일한 Provider에 대한 요청이 중복되지 않음
5. **강력한 비동기 지원**: Future와 Stream 처리를 위한 기본 지원
6. **테스트 용이성**: Provider의 값을 쉽게 오버라이드하여 테스트 가능

## Riverpod 설치하기

Riverpod를 사용하기 위해 먼저 필요한 패키지를 설치해야 합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.6.1 # 최신 버전 확인
  riverpod_annotation: ^2.6.1

dev_dependencies:
  build_runner:
  riverpod_generator: ^2.6.5
```

`flutter_riverpod`는 Flutter 앱에서 Riverpod를 사용하기 위한 패키지이고, `riverpod_annotation`와 `riverpod_generator`는 코드 생성을 위한 패키지입니다.

## Riverpod 시작하기

### 1. ProviderScope 설정

Riverpod를 사용하는 첫 번째 단계는 앱의 루트에 `ProviderScope` 위젯을 배치하는 것입니다:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(
    // ProviderScope는 Riverpod의 모든 Provider를 관리합니다
    ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Riverpod Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomePage(),
    );
  }
}
```

### 2. Provider 정의

Riverpod에서는 여러 종류의 Provider를 제공합니다:

```dart
// 1. Provider - 읽기 전용 값 제공
final helloWorldProvider = Provider<String>((ref) => 'Hello, World!');

// 2. StateProvider - 단순한 상태 관리
final counterProvider = StateProvider<int>((ref) => 0);

// 3. StateNotifierProvider - 복잡한 상태 관리
final todosProvider = StateNotifierProvider<TodosNotifier, List<Todo>>((ref) => TodosNotifier());

// 4. FutureProvider - 비동기 데이터 로드
final userProvider = FutureProvider<User>((ref) => fetchUser());

// 5. StreamProvider - 스트림 데이터 구독
final messagesProvider = StreamProvider<List<Message>>((ref) => fetchMessages());
```

### 3. Consumer 위젯으로 Provider 사용하기

Provider의 값을 읽기 위해 `Consumer` 또는 `ConsumerWidget`을 사용할 수 있습니다:

```dart
// Consumer 위젯 사용
class CounterWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer(
      builder: (context, ref, child) {
        final count = ref.watch(counterProvider);

        return Text('카운트: $count');
      },
    );
  }
}

// ConsumerWidget 사용 (더 간단함)
class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);

    return Text('카운트: $count');
  }
}
```

### 4. ref 객체 사용하기

`ref` 객체는 Provider와 상호 작용하는 핵심 객체로, 다음과 같은 메서드를 제공합니다:

```dart
// Provider 값 읽기 및 변경 감지 (UI 자동 업데이트)
final count = ref.watch(counterProvider);

// Provider 값 읽기 (변경 감지 없음)
final count = ref.read(counterProvider);

// 상태 변경을 수신하는 리스너 등록
ref.listen<int>(
  counterProvider,
  (previous, next) {
    print('카운터가 $previous에서 $next로 변경됨');
  },
);

// Provider 값 강제로 새로고침
ref.refresh(userProvider);

// StateProvider 값 변경
ref.read(counterProvider.notifier).state++;
```

## Riverpod의 주요 개념

### Provider와 ref

Riverpod에서는 두 가지 핵심 개념이 있습니다:

1. **Provider**: 상태를 정의하고 외부에 노출하는 객체
2. **ref**: Provider에 접근하고 상호 작용하는 객체


### Riverpod의 자동 의존성 처리

Riverpod의 가장 강력한 기능 중 하나는 Provider 간의 자동 의존성 처리입니다:

```dart
// 첫 번째 Provider
final cityProvider = StateProvider<String>((ref) => '서울');

// 두 번째 Provider (첫 번째에 의존)
final weatherProvider = FutureProvider<String>((ref) async {
  final city = ref.watch(cityProvider);
  return fetchWeather(city); // city가 변경되면 자동으로 다시 실행
});
```

이 예제에서 `weatherProvider`는 `cityProvider`에 의존합니다. `cityProvider`의 값이 변경되면 `weatherProvider`는 자동으로 재계산됩니다.

## Riverpod 코드 생성 기능

Riverpod 2.0부터는 애노테이션과 코드 생성을 사용하여 더 간결하게 Provider를 정의할 수 있습니다:

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'counter.g.dart';

// 코드 생성을 위한 애노테이션 사용
@riverpod
class Counter extends _$Counter {
  @override
  int build() {
    return 0; // 초기값
  }

  void increment() {
    state = state + 1;
  }
}

// 사용 방법 (counterProvider가 자동으로 생성됨)
final value = ref.watch(counterProvider);
ref.read(counterProvider.notifier).increment();
```

코드 생성을 실행하려면 다음 명령을 사용합니다:

```bash
dart run build_runner build
```

### 비동기 Provider 정의

비동기 데이터를 처리하는 Provider도 쉽게 정의할 수 있습니다:

```dart
@riverpod
Future<User> user(UserRef ref) async {
  final userId = ref.watch(userIdProvider);
  return await fetchUser(userId);
}

// 사용 방법
ref.watch(userProvider).when(
  data: (user) => Text(user.name),
  loading: () => CircularProgressIndicator(),
  error: (error, stack) => Text('에러: $error'),
);
```

## Riverpod 실전 사용법

이제 Riverpod를 사용하여 간단한 할 일 목록 앱을 구현해보겠습니다.

### 1. 모델 정의

```dart
// todo.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'todo.freezed.dart';
part 'todo.g.dart';

@freezed
class Todo with _$Todo {
  const factory Todo({
    required String id,
    required String title,
    @Default(false) bool completed,
  }) = _Todo;

  factory Todo.fromJson(Map<String, dynamic> json) => _$TodoFromJson(json);
}
```

### 2. Provider 정의

```dart
// todo_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:uuid/uuid.dart';
import 'todo.dart';

part 'todo_provider.g.dart';

@riverpod
class TodoList extends _$TodoList {
  @override
  List<Todo> build() {
    return []; // 초기 빈 목록
  }

  void addTodo(String title) {
    final newTodo = Todo(
      id: const Uuid().v4(),
      title: title,
    );
    state = [...state, newTodo];
  }

  void toggleTodo(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id)
          todo.copyWith(completed: !todo.completed)
        else
          todo,
    ];
  }

  void removeTodo(String id) {
    state = state.where((todo) => todo.id != id).toList();
  }
}

@riverpod
int completedTodosCount(CompletedTodosCountRef ref) {
  final todos = ref.watch(todoListProvider);
  return todos.where((todo) => todo.completed).length;
}

@riverpod
int uncompletedTodosCount(UncompletedTodosCountRef ref) {
  final todos = ref.watch(todoListProvider);
  return todos.where((todo) => !todo.completed).length;
}
```

### 3. UI 구현

```dart
// todo_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'todo_provider.dart';
import 'todo.dart';

class TodoScreen extends ConsumerWidget {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todoListProvider);
    final completedCount = ref.watch(completedTodosCountProvider);
    final uncompletedCount = ref.watch(uncompletedTodosCountProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Riverpod 할 일 목록'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      labelText: '할 일 추가',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: () {
                    if (_controller.text.isNotEmpty) {
                      ref.read(todoListProvider.notifier).addTodo(_controller.text);
                      _controller.clear();
                    }
                  },
                  child: const Text('추가'),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('완료: $completedCount'),
                Text('미완료: $uncompletedCount'),
              ],
            ),
          ),
          const Divider(),
          Expanded(
            child: ListView.builder(
              itemCount: todos.length,
              itemBuilder: (context, index) {
                final todo = todos[index];
                return ListTile(
                  leading: Checkbox(
                    value: todo.completed,
                    onChanged: (_) {
                      ref.read(todoListProvider.notifier).toggleTodo(todo.id);
                    },
                  ),
                  title: Text(
                    todo.title,
                    style: TextStyle(
                      decoration: todo.completed
                          ? TextDecoration.lineThrough
                          : TextDecoration.none,
                    ),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete),
                    onPressed: () {
                      ref.read(todoListProvider.notifier).removeTodo(todo.id);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

## 고급 Riverpod 기법

### 1. 비동기 데이터 처리

`AsyncValue`는 비동기 데이터의 세 가지 상태(데이터, 로딩, 오류)를 표현하는 편리한 클래스입니다:

```dart
@riverpod
class UserRepository extends _$UserRepository {
  @override
  Future<User> build(String userId) async {
    return fetchUser(userId);
  }
}

// UI에서 사용
class UserProfile extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userRepositoryProvider('user-123'));

    return userAsync.when(
      data: (user) => Text('이름: ${user.name}'),
      loading: () => const CircularProgressIndicator(),
      error: (error, stackTrace) => Text('에러: $error'),
    );
  }
}
```

### 2. 패밀리 Provider (매개변수가 있는 Provider)

매개변수를 받는 Provider를 정의할 수 있습니다:

```dart
@riverpod
Future<Product> product(ProductRef ref, String productId) {
  return fetchProduct(productId);
}

// UI에서 사용
final product = ref.watch(productProvider('product-123'));
```

### 3. Provider 캐싱 및 자동 폐기

Riverpod는 Provider 인스턴스를 자동으로 캐싱하고, 더 이상 사용되지 않을 때 정리합니다:

```dart
@riverpod
class ProductsRepository extends _$ProductsRepository {
  @override
  Future<List<Product>> build() async {
    // API 호출
    print('상품 로드 중...');
    return fetchProducts();
  }

  @override
  void dispose() {
    print('ProductsRepository 폐기됨');
    super.dispose();
  }
}
```

### 4. 상태 동기화

여러 Provider 간에 상태를 동기화하는 것이 쉽습니다:

```dart
@riverpod
class AuthState extends _$AuthState {
  @override
  User? build() => null;

  Future<void> login(String username, String password) async {
    state = await authService.login(username, password);
  }

  void logout() {
    state = null;
  }
}

@riverpod
class CartRepository extends _$CartRepository {
  @override
  List<CartItem> build() {
    final user = ref.watch(authStateProvider);

    // 사용자가 로그아웃하면 자동으로 장바구니 비우기
    if (user == null) {
      return [];
    }

    // 사용자에 따라 장바구니 데이터 로드
    return loadCartItems(user.id);
  }
}
```

## Riverpod의 주요 사용 패턴

### 1. 데이터 로직 분리 패턴

데이터 로직을 UI에서 분리하는 패턴을 사용합니다:

```dart
// Repository - 데이터 액세스 로직
@riverpod
class ProductsRepository extends _$ProductsRepository {
  @override
  Future<List<Product>> build() async {
    return api.fetchProducts();
  }
}

// Notifier - 비즈니스 로직
@riverpod
class ProductsFilter extends _$ProductsFilter {
  @override
  FilterCriteria build() {
    return FilterCriteria();
  }

  void setCategory(String category) {
    state = state.copyWith(category: category);
  }

  void setPriceRange(double min, double max) {
    state = state.copyWith(minPrice: min, maxPrice: max);
  }
}

// ViewModel - 화면에 표시할 데이터 준비
@riverpod
Future<List<ProductViewModel>> filteredProducts(FilteredProductsRef ref) async {
  final products = await ref.watch(productsRepositoryProvider.future);
  final filter = ref.watch(productsFilterProvider);

  return products
    .where((p) => p.category == filter.category)
    .where((p) => p.price >= filter.minPrice && p.price <= filter.maxPrice)
    .map((p) => ProductViewModel.fromProduct(p))
    .toList();
}
```

### 2. 자동 새로고침 패턴

Provider가 의존하는 다른 Provider가 업데이트되면 자동으로 새로고침됩니다:

```dart
@riverpod
class SearchQuery extends _$SearchQuery {
  @override
  String build() => '';

  void setQuery(String query) {
    state = query;
  }
}

@riverpod
Future<List<SearchResult>> searchResults(SearchResultsRef ref) async {
  final query = ref.watch(searchQueryProvider);

  // 검색어가 없으면 빈 결과 반환
  if (query.isEmpty) {
    return [];
  }

  // 검색어가 변경될 때마다 자동으로 새 검색 수행
  return searchApi.search(query);
}
```

### 3. 오버라이드 패턴

테스트나 개발 환경에서 Provider 값을 오버라이드할 수 있습니다:

```dart
void main() {
  runApp(
    ProviderScope(
      overrides: [
        // 실제 API 대신 목업 API 사용
        apiProvider.overrideWithValue(MockApi()),
        // 초기 상태 설정
        authStateProvider.overrideWith(
          (ref) => AuthState()..state = User(id: 'test-user', name: '테스트 사용자'),
        ),
      ],
      child: MyApp(),
    ),
  );
}
```

## Riverpod의 성능 최적화

### 1. 세분화된 Provider 설계

Provider를 세분화하여 불필요한 리빌드를 방지합니다:

```dart
// 나쁜 예시 - 하나의 거대한 Provider
@riverpod
class AppState extends _$AppState {
  @override
  AppStateModel build() {
    return AppStateModel(
      user: User(),
      products: [],
      cart: Cart(),
      // 기타 많은 상태들...
    );
  }
}

// 좋은 예시 - 세분화된 Provider
@riverpod
class UserState extends _$UserState {
  @override
  User build() => User();
}

@riverpod
class ProductsState extends _$ProductsState {
  @override
  List<Product> build() => [];
}

@riverpod
class CartState extends _$CartState {
  @override
  Cart build() => Cart();
}
```

### 2. select 메서드 사용

객체의 특정 속성만 감시하여 불필요한 리빌드를 방지합니다:

```dart
// 전체 사용자 객체 변경 시 리빌드
final user = ref.watch(userProvider);
final name = user.name;

// 이름이 변경될 때만 리빌드
final name = ref.watch(userProvider.select((user) => user.name));
```

### 3. autoDispose 수정자 사용

Provider가 더 이상 사용되지 않을 때 자동으로 폐기하려면 `autoDispose` 수정자를 사용합니다:

```dart
@riverpod
class SearchResults extends _$SearchResults {
  @override
  Future<List<Result>> build() async {
    // 화면이 닫히면 이 Provider는 자동으로 폐기됨
    return api.search();
  }
}
```

## Riverpod와 Flutter Hooks 사용하기

Flutter Hooks와 Riverpod를 함께 사용하면 더욱 간결한 코드를 작성할 수 있습니다:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

// hooks_riverpod 패키지 추가 필요
class TodoForm extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Flutter Hook을 사용하여 상태 관리
    final textController = useTextEditingController();
    final isFocused = useState(false);

    // Riverpod Provider 사용
    final todos = ref.watch(todoListProvider);

    return Column(
      children: [
        TextField(
          controller: textController,
          onFocusChange: (focus) => isFocused.value = focus,
          decoration: InputDecoration(
            labelText: '할 일 추가',
            border: OutlineInputBorder(),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            if (textController.text.isNotEmpty) {
              ref.read(todoListProvider.notifier).addTodo(textController.text);
              textController.clear();
            }
          },
          child: Text('추가'),
        ),
      ],
    );
  }
}
```

## 요약

- **Riverpod**는 Provider의 제한사항을 해결하기 위해 개발된 현대적인 상태 관리 라이브러리입니다.
- **컴파일 타임 안전성**, **위젯 트리 독립성**, **자동 의존성 처리** 등의 장점을 제공합니다.
- **코드 생성**을 통해 더 간결한 코드를 작성할 수 있습니다.
- **AsyncValue**를 통해 비동기 데이터를 쉽게 처리할 수 있습니다.
- **Provider 세분화**, **select 메서드**, **autoDispose** 등을 통해 성능을 최적화할 수 있습니다.

Riverpod는 Provider의 장점을 유지하면서 몇 가지 핵심적인 문제점을 해결한 강력한 상태 관리 솔루션입니다. 특히 중대형 앱의 개발에서 코드 유지보수성, 테스트 용이성, 성능 최적화에 큰 도움을 줄 수 있습니다. 다음 장에서는 실제 TodoList 앱을 개선하면서 Riverpod의 실전 사용법을 자세히 알아보겠습니다.
