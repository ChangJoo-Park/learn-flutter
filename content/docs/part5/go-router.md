# go_router 사용법

go_router는 Flutter 팀이 공식적으로 지원하는 라우팅 패키지로, Navigator 2.0의 기능을 더 쉽게 사용할 수 있게 해줍니다. 복잡한 라우팅 시나리오를 처리하면서도 간결한 API를 제공하여 개발자 경험을 크게 향상시킵니다.

## go_router의 소개

go_router는 다음과 같은 목표로 개발되었습니다:

1. **간결한 API**: Navigator 2.0의 복잡성을 줄이고 더 직관적인 API 제공
2. **선언적 라우팅**: 앱의 모든 라우트를 한 곳에서 선언적으로 정의
3. **딥 링크 지원**: 모바일 앱의 딥 링크와 웹 URL 지원
4. **중첩 라우팅**: 중첩된 네비게이션 시나리오 지원
5. **페이지 전환 애니메이션**: 커스텀 페이지 전환 효과 지원

## go_router 설치하기

pubspec.yaml 파일에 go_router 패키지를 추가합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  go_router: ^10.0.0 # 최신 버전을 확인하세요
```

그리고 패키지를 설치합니다:

```bash
flutter pub get
```

## go_router의 기본 개념

### 1. GoRouter 설정

앱의 라우팅을 설정하는 GoRouter 인스턴스를 생성합니다:

```dart
final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),
    GoRoute(
      path: '/details/:id',
      builder: (context, state) => DetailsScreen(
        id: state.pathParameters['id']!,
      ),
    ),
  ],
);

// 앱에 라우터 적용
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: _router,
      title: 'GoRouter Example',
    );
  }
}
```

### 2. 경로 정의와 매개변수

go_router에서는 URL 경로에 매개변수를 포함할 수 있습니다:

- **경로 매개변수**: `/user/:id`와 같이 콜론으로 시작하는 세그먼트
- **쿼리 매개변수**: `/search?query=flutter`와 같이 URL에 추가되는 키-값 쌍

```dart
GoRoute(
  path: '/user/:userId/post/:postId',
  builder: (context, state) {
    // 경로 매개변수 추출
    final userId = state.pathParameters['userId']!;
    final postId = state.pathParameters['postId']!;

    // 쿼리 매개변수 추출
    final filter = state.queryParameters['filter'];

    return PostScreen(userId: userId, postId: postId, filter: filter);
  },
),
```

### 3. 화면 이동

go_router는 다양한 방법으로 화면 간 이동을 지원합니다:

```dart
// 명시적 경로로 이동
context.go('/details/123');

// 현재 스택에 새 화면 추가
context.push('/details/123');

// 스택을 모두 비우고 새 화면으로 대체
context.pushReplacement('/details/123');

// 해당 경로까지 모든 화면 제거 후 새 화면 추가
context.pushAndRemoveUntil('/details/123', predicate);

// 이전 화면으로 돌아가기
context.pop();
```

## go_router 고급 기능

### 1. 중첩 라우팅

go_router는 StatefulShellRoute를 통해 중첩 라우팅을 지원합니다:

```dart
final GoRouter _router = GoRouter(
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        // 바텀 네비게이션 바 또는 탭 컨트롤러와 함께 사용
        return ScaffoldWithNavBar(navigationShell: navigationShell);
      },
      branches: [
        // 첫 번째 탭 (Home)
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/',
              builder: (context, state) => HomeScreen(),
              routes: [
                GoRoute(
                  path: 'details/:id',
                  builder: (context, state) => DetailsScreen(
                    id: state.pathParameters['id']!,
                  ),
                ),
              ],
            ),
          ],
        ),
        // 두 번째 탭 (Profile)
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => ProfileScreen(),
              routes: [
                GoRoute(
                  path: 'edit',
                  builder: (context, state) => EditProfileScreen(),
                ),
              ],
            ),
          ],
        ),
        // 세 번째 탭 (Settings)
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => SettingsScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);

// 바텀 네비게이션 바 위젯
class ScaffoldWithNavBar extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const ScaffoldWithNavBar({required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: '홈'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '프로필'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: '설정'),
        ],
        onTap: (index) => navigationShell.goBranch(index),
      ),
    );
  }
}
```

### 2. 리다이렉트

리다이렉트를 사용하여 인증이 필요한 페이지나 다른 경로로 자동 리다이렉션할 수 있습니다:

```dart
final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [...],

  // 전역 리다이렉트 (모든 라우트에 적용)
  redirect: (context, state) {
    final isLoggedIn = AuthService.isLoggedIn;
    final isGoingToLogin = state.matchedLocation == '/login';

    // 로그인되지 않았고 로그인 페이지로 가는 중이 아니면 로그인 페이지로 리다이렉트
    if (!isLoggedIn && !isGoingToLogin) {
      return '/login?redirect=${state.matchedLocation}';
    }

    // 이미 로그인되었고 로그인 페이지로 가려고 한다면 홈으로 리다이렉트
    if (isLoggedIn && isGoingToLogin) {
      return '/';
    }

    // 리다이렉트 없음
    return null;
  },
);

// 특정 라우트에 대한 리다이렉트
GoRoute(
  path: '/admin',
  redirect: (context, state) {
    final isAdmin = AuthService.hasAdminRole;
    if (!isAdmin) {
      return '/access-denied';
    }
    return null;
  },
  builder: (context, state) => AdminPanel(),
),
```

### 3. 오류 처리

go_router는 존재하지 않는 경로에 대한 오류 처리를 지원합니다:

```dart
final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [...],

  // 경로가 매치되지 않을 때 표시할 화면
  errorBuilder: (context, state) => NotFoundScreen(),
);
```

### 4. 페이지 전환 애니메이션

go_router를 사용하여 화면 전환 애니메이션을 커스터마이징할 수 있습니다:

```dart
GoRoute(
  path: '/details/:id',
  pageBuilder: (context, state) {
    return CustomTransitionPage(
      key: state.pageKey,
      child: DetailsScreen(id: state.pathParameters['id']!),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOut;

        var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
        var offsetAnimation = animation.drive(tween);

        return SlideTransition(
          position: offsetAnimation,
          child: child,
        );
      },
    );
  },
),
```

## go_router 활용 예제

다음은 go_router를 활용한 전체 샘플 앱입니다:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

void main() {
  runApp(MyApp());
}

// 앱 상태 (인증 상태)
class AppState extends ChangeNotifier {
  bool _isLoggedIn = false;

  bool get isLoggedIn => _isLoggedIn;

  void login() {
    _isLoggedIn = true;
    notifyListeners();
  }

  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }
}

// 라우터 설정
final appState = AppState();

final GoRouter _router = GoRouter(
  initialLocation: '/',
  refreshListenable: appState, // 인증 상태가 변경될 때 라우터 갱신
  redirect: (context, state) {
    // 인증이 필요한 경로 목록
    final protectedRoutes = ['/profile', '/settings'];

    // 현재 경로가 보호된 경로인지 확인
    final isProtectedRoute = protectedRoutes.any(
      (route) => state.matchedLocation.startsWith(route),
    );

    // 로그인 되지 않았지만 보호된 경로로 접근하려고 할 때
    if (!appState.isLoggedIn && isProtectedRoute) {
      return '/login?redirect=${state.matchedLocation}';
    }

    // 로그인 되어 있고 로그인 페이지로 가려고 할 때
    if (appState.isLoggedIn && state.matchedLocation == '/login') {
      return '/';
    }

    // 리다이렉트 없음
    return null;
  },
  routes: [
    // 홈 화면
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),

    // 로그인 화면
    GoRoute(
      path: '/login',
      builder: (context, state) {
        // 로그인 후 리다이렉트할 경로
        final redirectUrl = state.queryParameters['redirect'] ?? '/';
        return LoginScreen(redirectUrl: redirectUrl);
      },
    ),

    // 상품 상세 화면
    GoRoute(
      path: '/product/:id',
      builder: (context, state) {
        final productId = state.pathParameters['id']!;
        return ProductDetailScreen(productId: productId);
      },
    ),

    // 프로필 섹션 (중첩 라우트)
    GoRoute(
      path: '/profile',
      builder: (context, state) => ProfileScreen(),
      routes: [
        GoRoute(
          path: 'edit',
          builder: (context, state) => EditProfileScreen(),
        ),
        GoRoute(
          path: 'orders',
          builder: (context, state) => OrderHistoryScreen(),
        ),
      ],
    ),

    // 설정 화면
    GoRoute(
      path: '/settings',
      builder: (context, state) => SettingsScreen(),
    ),
  ],

  // 경로를 찾을 수 없을 때의 오류 화면
  errorBuilder: (context, state) => NotFoundScreen(),
);

// 메인 앱
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'GoRouter Example',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      routerConfig: _router,
    );
  }
}

// 홈 화면
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('홈')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('홈 화면'),
            SizedBox(height: 20),

            // 상품 목록
            Expanded(
              child: ListView.builder(
                itemCount: 10,
                itemBuilder: (context, index) {
                  final productId = index + 1;
                  return ListTile(
                    title: Text('상품 $productId'),
                    onTap: () => context.go('/product/$productId'),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      drawer: AppDrawer(),
    );
  }
}

// 앱 드로어
class AppDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Text(
              'GoRouter 예제',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          ListTile(
            leading: Icon(Icons.home),
            title: Text('홈'),
            onTap: () {
              context.go('/');
              Navigator.pop(context); // 드로어 닫기
            },
          ),
          ListTile(
            leading: Icon(Icons.person),
            title: Text('프로필'),
            onTap: () {
              context.go('/profile');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: Icon(Icons.settings),
            title: Text('설정'),
            onTap: () {
              context.go('/settings');
              Navigator.pop(context);
            },
          ),
          Divider(),
          if (appState.isLoggedIn)
            ListTile(
              leading: Icon(Icons.logout),
              title: Text('로그아웃'),
              onTap: () {
                appState.logout();
                Navigator.pop(context);
              },
            )
          else
            ListTile(
              leading: Icon(Icons.login),
              title: Text('로그인'),
              onTap: () {
                context.go('/login');
                Navigator.pop(context);
              },
            ),
        ],
      ),
    );
  }
}

// 로그인 화면
class LoginScreen extends StatelessWidget {
  final String redirectUrl;

  LoginScreen({required this.redirectUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('로그인')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('로그인 화면'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                appState.login();
                context.go(redirectUrl);
              },
              child: Text('로그인'),
            ),
          ],
        ),
      ),
    );
  }
}

// 상품 상세 화면
class ProductDetailScreen extends StatelessWidget {
  final String productId;

  ProductDetailScreen({required this.productId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('상품 상세')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('상품 ID: $productId의 상세 정보'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: Text('홈으로 돌아가기'),
            ),
          ],
        ),
      ),
    );
  }
}

// 프로필 화면
class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('프로필')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('프로필 화면'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/profile/edit'),
              child: Text('프로필 수정'),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => context.go('/profile/orders'),
              child: Text('주문 내역'),
            ),
          ],
        ),
      ),
    );
  }
}

// 프로필 수정 화면
class EditProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('프로필 수정')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('프로필 수정 화면'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.pop(),
              child: Text('뒤로 가기'),
            ),
          ],
        ),
      ),
    );
  }
}

// 주문 내역 화면
class OrderHistoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('주문 내역')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('주문 내역 화면'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.pop(),
              child: Text('뒤로 가기'),
            ),
          ],
        ),
      ),
    );
  }
}

// 설정 화면
class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('설정')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('설정 화면'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: Text('홈으로 돌아가기'),
            ),
          ],
        ),
      ),
    );
  }
}

// 404 화면
class NotFoundScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('페이지를 찾을 수 없음')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('404 - 페이지를 찾을 수 없습니다'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: Text('홈으로 돌아가기'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## go_router 베스트 프랙티스

### 1. 라우터 설정 분리

라우터 설정을 별도의 파일로 분리하여 코드를 구조화하세요:

```dart
// router_config.dart
final GoRouter router = GoRouter(
  routes: [
    // 라우트 정의
  ],
);

// main.dart
import 'router_config.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
      // ...
    );
  }
}
```

### 2. 경로 상수 사용

문자열 경로 대신 상수를 사용하여 오타를 방지하세요:

```dart
// route_paths.dart
abstract class RoutePaths {
  static const home = '/';
  static const login = '/login';
  static const product = '/product/:id';
  static const productDetails = '/product/';
  static const profile = '/profile';
  static const settings = '/settings';
}

// 사용 예시
context.go(RoutePaths.productDetails + productId);
```

### 3. 매개변수 타입 검증

경로 매개변수의 타입을 검증하여 잘못된 데이터로 인한 오류를 방지하세요:

```dart
GoRoute(
  path: '/product/:id',
  builder: (context, state) {
    // 숫자 ID 검증
    final idStr = state.pathParameters['id']!;
    final id = int.tryParse(idStr);

    if (id == null) {
      // 잘못된 ID 형식
      return InvalidProductScreen(id: idStr);
    }

    return ProductDetailScreen(id: id);
  },
),
```

### 4. 로깅 및 디버깅

go_router의 디버그 모드를 활성화하여 라우팅 문제를 디버깅하세요:

```dart
final GoRouter _router = GoRouter(
  debugLogDiagnostics: true, // 라우팅 디버그 로그 활성화
  routes: [...],
);
```

## go_router vs 다른 라우팅 라이브러리

go_router는 다른 Flutter 라우팅 라이브러리에 비해 몇 가지 장점이 있습니다:

### 1. go_router vs Navigator 2.0 직접 사용

- **go_router**: 간결한 API, 적은 보일러플레이트 코드, 더 직관적인 사용법
- **Navigator 2.0**: 더 많은 유연성, 더 많은 보일러플레이트 코드 필요

### 2. go_router vs auto_route

- **go_router**: 공식 지원, 간단한 설정, 코드 생성 불필요
- **auto_route**: 코드 생성 기반, 타입 안전성, 더 많은 설정 필요

### 3. go_router vs get

- **go_router**: 공식 지원, Navigator 2.0 기반, URL 동기화 지원 강력
- **get**: 더 넓은 기능 세트 (상태 관리, 종속성 주입 등), 더 단순한 API

## 요약

- **go_router**는 Flutter 팀이 공식 지원하는 네비게이션 라이브러리로, Navigator 2.0의 기능을 더 쉽게 사용할 수 있게 해줍니다.
- **선언적 라우팅**을 통해 앱의 모든 경로를 한 곳에서 정의할 수 있습니다.
- **중첩 라우팅**, **리다이렉트**, **오류 처리**, **애니메이션** 등 고급 기능을 제공합니다.
- **경로 매개변수**와 **쿼리 매개변수**를 통해 데이터를 쉽게 전달할 수 있습니다.
- **context.go()**, **context.push()** 등의 직관적인 메서드로 화면 간 이동이 가능합니다.
- **StatefulShellRoute**를 사용하여 바텀 네비게이션 바와 같은 탭 기반 UI를 쉽게 구현할 수 있습니다.

go_router는 대부분의 Flutter 앱에서 권장되는 라우팅 솔루션으로, 간단한 앱부터 복잡한 앱까지 효과적으로 네비게이션 관리를 할 수 있게 해줍니다. 다음 섹션에서는 go_router의 고급 기능인 라우트 가드, ShellRoute, 딥 링크 처리에 대해 더 자세히 알아보겠습니다.
