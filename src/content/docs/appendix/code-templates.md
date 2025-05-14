# 코드 템플릿

개발 시간을 단축하고 일관된 코드 스타일을 유지하기 위해 코드 템플릿을 활용하는 것은 매우 유용합니다. 이 페이지에서는 Flutter 개발에 도움이 되는 다양한 코드 템플릿과 예제를 제공합니다.

## 프로젝트 구조 템플릿

### 기능별 폴더 구조

```
lib/
├── core/
│   ├── constants/
│   ├── exceptions/
│   ├── extensions/
│   ├── routes/
│   ├── services/
│   ├── theme/
│   └── utils/
├── data/
│   ├── datasources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/ (interfaces)
│   └── usecases/
├── presentation/
│   ├── pages/
│   ├── providers/
│   ├── viewmodels/
│   └── widgets/
├── main.dart
└── app.dart
```

### 간소화된 구조 (소규모 프로젝트)

```
lib/
├── common/
│   ├── constants.dart
│   ├── theme.dart
│   └── utils.dart
├── data/
│   ├── models/
│   └── repositories/
├── providers/
├── screens/
│   ├── home/
│   ├── details/
│   └── settings/
├── widgets/
│   ├── common/
│   └── specialized/
├── main.dart
└── app.dart
```

## 클래스 및 위젯 템플릿

### StatelessWidget 템플릿

```dart
class CustomWidget extends StatelessWidget {
  final String title;
  final VoidCallback onTap;

  const CustomWidget({
    super.key,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Theme.of(context).primaryColor,
          borderRadius: BorderRadius.circular(8.0),
        ),
        child: Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
```

### StatefulWidget 템플릿

```dart
class CounterWidget extends StatefulWidget {
  final int initialValue;
  final ValueChanged<int>? onChanged;

  const CounterWidget({
    super.key,
    this.initialValue = 0,
    this.onChanged,
  });

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  late int _counter;

  @override
  void initState() {
    super.initState();
    _counter = widget.initialValue;
  }

  void _increment() {
    setState(() {
      _counter++;
      widget.onChanged?.call(_counter);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('카운터: $_counter'),
        ElevatedButton(
          onPressed: _increment,
          child: const Text('증가'),
        ),
      ],
    );
  }
}
```

### HookWidget 템플릿 (flutter_hooks)

```dart
class HookCounter extends HookWidget {
  final ValueChanged<int>? onChanged;

  const HookCounter({
    super.key,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final counter = useState(0);

    void increment() {
      counter.value++;
      onChanged?.call(counter.value);
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('카운터: ${counter.value}'),
        ElevatedButton(
          onPressed: increment,
          child: const Text('증가'),
        ),
      ],
    );
  }
}
```

### ConsumerWidget 템플릿 (Riverpod)

```dart
// 프로바이더 정의
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}

// 위젯 구현
class CounterView extends ConsumerWidget {
  const CounterView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final counter = ref.watch(counterProvider);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('카운터: $counter'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).increment(),
          child: const Text('증가'),
        ),
      ],
    );
  }
}
```

### HookConsumerWidget 템플릿 (hooks_riverpod)

```dart
class HookConsumerCounter extends HookConsumerWidget {
  const HookConsumerCounter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final counter = ref.watch(counterProvider);
    final isActive = useState(true);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Switch(
          value: isActive.value,
          onChanged: (value) => isActive.value = value,
        ),
        Text('카운터: $counter'),
        ElevatedButton(
          onPressed: isActive.value
            ? () => ref.read(counterProvider.notifier).increment()
            : null,
          child: const Text('증가'),
        ),
      ],
    );
  }
}
```

## 데이터 모델 템플릿

### Freezed 모델 템플릿

```dart
// user.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String name,
    @JsonKey(name: 'email_address') required String email,
    String? profileUrl,
    @Default(false) bool isPremium,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
```

### 상태를 가진 Freezed 모델 (AsyncValue 활용)

```dart
// user_state.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'user.dart';

part 'user_state.freezed.dart';

@freezed
class UserState with _$UserState {
  const factory UserState({
    required AsyncValue<User> user,
    @Default(false) bool isEditing,
  }) = _UserState;

  const UserState._();

  factory UserState.initial() => UserState(
    user: const AsyncValue.loading(),
  );

  bool get isLoading => user.isLoading;
  bool get hasError => user.hasError;

  UserState copyWithUser(User? newUser) {
    return copyWith(
      user: newUser != null
        ? AsyncValue.data(newUser)
        : const AsyncValue.loading(),
    );
  }
}
```

## Riverpod 프로바이더 템플릿

### 기본 Provider

```dart
final configProvider = Provider<AppConfig>((ref) {
  return AppConfig(
    apiUrl: 'https://api.example.com',
    timeout: const Duration(seconds: 30),
  );
});
```

### StateNotifierProvider

```dart
// counter_notifier.dart
class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);

  void increment() => state++;
  void decrement() {
    if (state > 0) state--;
  }
  void reset() => state = 0;
}

// counter_provider.dart
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier();
});
```

### AsyncNotifierProvider

```dart
// users_notifier.dart
@riverpod
class UsersNotifier extends _$UsersNotifier {
  @override
  FutureOr<List<User>> build() async {
    return _fetchUsers();
  }

  Future<List<User>> _fetchUsers() async {
    final apiService = ref.read(apiServiceProvider);
    return await apiService.getUsers();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_fetchUsers);
  }

  Future<void> addUser(User user) async {
    state = const AsyncValue.loading();
    final apiService = ref.read(apiServiceProvider);
    await apiService.addUser(user);

    state = await AsyncValue.guard(_fetchUsers);
  }
}
```

### FutureProvider 및 Stream 프로바이더

```dart
// 단순 FutureProvider
final userProvider = FutureProvider.family<User, String>((ref, userId) async {
  final apiService = ref.read(apiServiceProvider);
  return await apiService.getUserById(userId);
});

// 스트림 프로바이더
final messagesProvider = StreamProvider<List<Message>>((ref) {
  final chatService = ref.read(chatServiceProvider);
  return chatService.getMessagesStream();
});
```

## 화면 레이아웃 템플릿

### 기본 화면 구조

```dart
class ProfileScreen extends StatelessWidget {
  final String userId;

  const ProfileScreen({
    super.key,
    required this.userId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('프로필'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // 설정 화면으로 이동
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 프로필 헤더
              const ProfileHeader(),

              const SizedBox(height: 16),

              // 탭 컨트롤
              const ProfileTabBar(),

              // 탭 콘텐츠
              Expanded(
                child: ProfileTabView(userId: userId),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // 작업 수행
        },
        child: const Icon(Icons.add),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '홈',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '프로필',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: '설정',
          ),
        ],
        currentIndex: 1,
        onTap: (index) {
          // 탭 변경 처리
        },
      ),
    );
  }
}
```

### 반응형 레이아웃

```dart
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < 650;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= 650 &&
      MediaQuery.of(context).size.width < 1100;

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= 1100;

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;

    if (size.width >= 1100 && desktop != null) {
      return desktop!;
    }

    if (size.width >= 650 && tablet != null) {
      return tablet!;
    }

    return mobile;
  }
}

// 사용 예시
class MyResponsiveScreen extends StatelessWidget {
  const MyResponsiveScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('반응형 예제')),
      body: const ResponsiveLayout(
        mobile: MobileLayout(),
        tablet: TabletLayout(),
        desktop: DesktopLayout(),
      ),
    );
  }
}
```

## 네트워크 요청 템플릿

### Dio를 활용한

REST API 클라이언트

```dart
class ApiClient {
  final Dio _dio;

  ApiClient() : _dio = Dio() {
    _dio.options.baseUrl = 'https://api.example.com';
    _dio.options.connectTimeout = const Duration(seconds: 5);
    _dio.options.receiveTimeout = const Duration(seconds: 3);

    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));
  }

  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    required T Function(dynamic data) fromJson,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
      );
      return fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<T> post<T>(
    String path, {
    required dynamic data,
    required T Function(dynamic data) fromJson,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
      );
      return fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Exception _handleError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException('연결 시간이 초과되었습니다');
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        if (statusCode == 401) {
          return UnauthorizedException('인증이 필요합니다');
        } else if (statusCode == 404) {
          return NotFoundException('요청한 리소스를 찾을 수 없습니다');
        }
        return ServerException('서버 오류가 발생했습니다: $statusCode');
      default:
        return Exception('네트워크 오류가 발생했습니다: ${e.message}');
    }
  }
}
```

### GraphQL 요청 템플릿

```dart
class GraphQLClient {
  final HttpLink _httpLink;
  late final graphql.GraphQLClient _client;

  GraphQLClient() : _httpLink = HttpLink('https://api.example.com/graphql') {
    final AuthLink authLink = AuthLink(
      getToken: () async => 'Bearer $token',
    );

    final Link link = authLink.concat(_httpLink);

    _client = graphql.GraphQLClient(
      link: link,
      cache: GraphQLCache(),
    );
  }

  Future<T> query<T>({
    required String queryDocument,
    Map<String, dynamic>? variables,
    required T Function(Map<String, dynamic> data) fromJson,
  }) async {
    final QueryOptions options = QueryOptions(
      document: gql.gql(queryDocument),
      variables: variables ?? {},
    );

    final QueryResult result = await _client.query(options);

    if (result.hasException) {
      throw _handleException(result.exception!);
    }

    return fromJson(result.data!);
  }

  Future<T> mutate<T>({
    required String mutationDocument,
    Map<String, dynamic>? variables,
    required T Function(Map<String, dynamic> data) fromJson,
  }) async {
    final MutationOptions options = MutationOptions(
      document: gql.gql(mutationDocument),
      variables: variables ?? {},
    );

    final QueryResult result = await _client.mutate(options);

    if (result.hasException) {
      throw _handleException(result.exception!);
    }

    return fromJson(result.data!);
  }

  Exception _handleException(OperationException exception) {
    if (exception.linkException != null) {
      return NetworkException('네트워크 오류가 발생했습니다');
    }

    if (exception.graphqlErrors.isNotEmpty) {
      final firstError = exception.graphqlErrors.first;
      return GraphQLException(firstError.message);
    }

    return Exception('알 수 없는 오류가 발생했습니다');
  }
}
```

## 상태 관리 템플릿

### Riverpod + Freezed를 활용한 상태 관리

```dart
// todo_state.dart
@freezed
class TodoState with _$TodoState {
  const factory TodoState({
    required AsyncValue<List<Todo>> todos,
    @Default('') String newTodoText,
    Todo? editingTodo,
  }) = _TodoState;

  factory TodoState.initial() => TodoState(
    todos: const AsyncValue.loading(),
  );
}

// todo_notifier.dart
@riverpod
class TodoNotifier extends _$TodoNotifier {
  @override
  TodoState build() {
    _loadTodos();
    return TodoState.initial();
  }

  Future<void> _loadTodos() async {
    state = state.copyWith(todos: const AsyncValue.loading());

    try {
      final todoRepository = ref.read(todoRepositoryProvider);
      final todos = await todoRepository.getTodos();
      state = state.copyWith(todos: AsyncValue.data(todos));
    } catch (error, stackTrace) {
      state = state.copyWith(todos: AsyncValue.error(error, stackTrace));
    }
  }

  void setNewTodoText(String text) {
    state = state.copyWith(newTodoText: text);
  }

  Future<void> addTodo() async {
    if (state.newTodoText.trim().isEmpty) return;

    final todo = Todo(
      id: const Uuid().v4(),
      title: state.newTodoText,
      completed: false,
    );

    final currentTodos = state.todos.valueOrNull ?? [];

    // 낙관적 업데이트
    state = state.copyWith(
      todos: AsyncValue.data([...currentTodos, todo]),
      newTodoText: '',
    );

    try {
      final todoRepository = ref.read(todoRepositoryProvider);
      await todoRepository.addTodo(todo);
    } catch (error) {
      // 실패 시 롤백
      state = state.copyWith(
        todos: AsyncValue.data(currentTodos),
      );
      // 오류 메시지 표시
    }
  }
}
```

## 페이지 라우팅 템플릿

### GoRouter 설정

```dart
// router.dart
final GlobalKey<NavigatorState> rootNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'root');

final GlobalKey<NavigatorState> shellNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'shell');

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/',
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull?.user != null;
      final isLoggingIn = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoggingIn) return '/login';
      if (isLoggedIn && isLoggingIn) return '/';

      return null;
    },
    routes: [
      // 로그인 화면
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),

      // 쉘 라우트 (하단 탐색바)
      ShellRoute(
        navigatorKey: shellNavigatorKey,
        builder: (context, state, child) => ShellScreen(child: child),
        routes: [
          // 홈 화면
          GoRoute(
            path: '/',
            builder: (context, state) => const HomeScreen(),
            routes: [
              // 상세 화면
              GoRoute(
                path: 'details/:id',
                builder: (context, state) {
                  final id = state.params['id']!;
                  return DetailsScreen(id: id);
                },
              ),
            ],
          ),

          // 프로필 화면
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),

          // 설정 화면
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => ErrorScreen(error: state.error),
  );
});
```

## 단위 테스트 템플릿

### 일반 클래스 테스트

```dart
void main() {
  group('Calculator 테스트', () {
    late Calculator calculator;

    setUp(() {
      calculator = Calculator();
    });

    test('더하기 테스트', () {
      expect(calculator.add(1, 2), 3);
      expect(calculator.add(-1, 1), 0);
      expect(calculator.add(0, 0), 0);
    });

    test('나누기 테스트', () {
      expect(calculator.divide(6, 2), 3);
      expect(calculator.divide(5, 2), 2.5);

      expect(
        () => calculator.divide(1, 0),
        throwsA(isA<DivisionByZeroException>()),
      );
    });
  });
}
```

### Riverpod 테스트

```dart
// counter_test.dart
void main() {
  group('CounterNotifier 테스트', () {
    late ProviderContainer container;

    setUp(() {
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('초기 상태는 0이다', () {
      expect(container.read(counterProvider), 0);
    });

    test('increment 메서드는 상태를 1 증가시킨다', () {
      container.read(counterProvider.notifier).increment();
      expect(container.read(counterProvider), 1);

      container.read(counterProvider.notifier).increment();
      expect(container.read(counterProvider), 2);
    });

    test('decrement 메서드는 상태를 1 감소시킨다', () {
      container.read(counterProvider.notifier).increment();
      container.read(counterProvider.notifier).increment();
      expect(container.read(counterProvider), 2);

      container.read(counterProvider.notifier).decrement();
      expect(container.read(counterProvider), 1);
    });

    test('decrement 메서드는 상태가 0일 때 감소시키지 않는다', () {
      expect(container.read(counterProvider), 0);

      container.read(counterProvider.notifier).decrement();
      expect(container.read(counterProvider), 0);
    });
  });
}
```

## 위젯 테스트 템플릿

```dart
void main() {
  group('Counter 위젯 테스트', () {
    testWidgets('초기 카운터 값이 올바르게 표시된다', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CounterWidget(initialValue: 5),
          ),
        ),
      );

      expect(find.text('카운터: 5'), findsOneWidget);
      expect(find.text('증가'), findsOneWidget);
    });

    testWidgets('버튼 클릭 시 카운터가 증가한다', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CounterWidget(),
          ),
        ),
      );

      expect(find.text('카운터: 0'), findsOneWidget);

      await tester.tap(find.text('증가'));
      await tester.pump();

      expect(find.text('카운터: 1'), findsOneWidget);
    });

    testWidgets('onChanged 콜백이 호출된다', (WidgetTester tester) async {
      int? newValue;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CounterWidget(
              onChanged: (value) {
                newValue = value;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('증가'));
      await tester.pump();

      expect(newValue, 1);
    });
  });
}
```

## 예제 모음 링크

다음은 더 많은 코드 예제를 찾을 수 있는 유용한 리소스 모음입니다:

### 공식 예제

- [Flutter Gallery](https://github.com/flutter/gallery) - 공식 Flutter 위젯 및 기능 갤러리
- [Flutter Samples](https://github.com/flutter/samples) - 공식 Flutter 샘플 모음
- [Flutter 쿡북](https://docs.flutter.dev/cookbook) - 공식 Flutter 쿡북 레시피

### 커뮤니티 예제

- [Flutter Awesome](https://flutterawesome.com/) - 커뮤니티가 제작한 Flutter 앱 예제 모음
- [Flutter Example Apps](https://github.com/iampawan/FlutterExampleApps) - 다양한 Flutter 앱 예제
- [Flutter Clean Architecture](https://github.com/ResoCoder/flutter-clean-architecture-course) - 클린 아키텍처 예제
- [The Flutter Way](https://github.com/abuanwar072) - UI 중심 Flutter 예제 모음
- [Riverpod Architecture](https://github.com/lucavenir/riverpod_architecture) - Riverpod 기반 아키텍처 예제

### 디자인 별 예제

- [FlutterFolio](https://github.com/gskinnerTeam/flutterfolio) - 반응형 웹 포트폴리오 예제
- [Flutter UI Challenges](https://github.com/lohanidamodar/flutter_ui_challenges) - 다양한 UI 구현 예제
- [Flutter Movies](https://github.com/ibhavikmakwana/flutter_movies) - 영화 앱 UI 예제
- [Flutter Food Delivery](https://github.com/JideGuru/FlutterFoodybite) - 음식 배달 앱 UI

### 특정 기능 구현 예제

- [Local Auth](https://github.com/flutter/packages/tree/main/packages/local_auth/local_auth/example) - 생체 인증 예제
- [Provider Shopper](https://github.com/flutter/samples/tree/main/provider_shopper) - Provider를 활용한 쇼핑 앱
- [Infinite List](https://github.com/felangel/bloc_examples/tree/master/flutter_infinite_list) - 무한 스크롤 구현
- [Firebase Chat](https://github.com/duytq94/flutter-chat-demo) - Firebase 기반 채팅 앱

### 아키텍처 예제

- [Flutter TDD Clean Architecture](https://github.com/ResoCoder/flutter-tdd-clean-architecture-course) - 테스트 주도 개발 + 클린 아키텍처
- [Flutter BLoC Pattern](https://github.com/felangel/bloc) - BLoC 패턴 예제
- [Flutter Riverpod Architecture](https://github.com/rrousselGit/riverpod/tree/master/examples) - Riverpod 아키텍처 예제

이 리소스들은 다양한 Flutter 프로젝트와 코드 예제를 제공하여 개발자가 더 빠르게 학습하고 개발할 수 있도록 도와줍니다.
