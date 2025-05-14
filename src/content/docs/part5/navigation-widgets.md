---
title: Drawer, BottomNavigationBar, TabBar
---

Flutter에서는 사용자 경험을 개선하기 위한 다양한 네비게이션 위젯을 제공합니다. 이 장에서는 가장 널리 사용되는 세 가지 네비게이션 패턴인 Drawer, BottomNavigationBar, TabBar에 대해 자세히 알아보고, go_router와 함께 이들을 효과적으로 구현하는 방법을 살펴보겠습니다.

## Drawer (내비게이션 서랍)

Drawer는 화면 측면에서 슬라이드하여 나타나는 패널로, 앱의 주요 네비게이션 옵션을 제공합니다. 일반적으로 햄버거 메뉴 아이콘(☰)을 탭하여 열 수 있습니다.

### 기본 Drawer 구현

```dart
Scaffold(
  appBar: AppBar(
    title: Text('Drawer 예제'),
  ),
  drawer: Drawer(
    child: ListView(
      padding: EdgeInsets.zero,
      children: [
        // 드로어 헤더
        DrawerHeader(
          decoration: BoxDecoration(
            color: Colors.blue,
          ),
          child: Text(
            '앱 메뉴',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
            ),
          ),
        ),
        // 드로어 항목들
        ListTile(
          leading: Icon(Icons.home),
          title: Text('홈'),
          onTap: () {
            // 드로어 닫기
            Navigator.pop(context);
            // 홈 화면으로 이동
            context.go('/');
          },
        ),
        ListTile(
          leading: Icon(Icons.category),
          title: Text('카테고리'),
          onTap: () {
            Navigator.pop(context);
            context.go('/categories');
          },
        ),
        ListTile(
          leading: Icon(Icons.favorite),
          title: Text('즐겨찾기'),
          onTap: () {
            Navigator.pop(context);
            context.go('/favorites');
          },
        ),
        Divider(),
        ListTile(
          leading: Icon(Icons.settings),
          title: Text('설정'),
          onTap: () {
            Navigator.pop(context);
            context.go('/settings');
          },
        ),
      ],
    ),
  ),
  body: Center(
    child: Text('Drawer를 보려면 화면 왼쪽 가장자리에서 스와이프하세요'),
  ),
)
```

### UserAccountsDrawerHeader 사용하기

사용자 정보를 표시하기 위한 더 풍부한 드로어 헤더를 만들 수 있습니다:

```dart
UserAccountsDrawerHeader(
  accountName: Text('홍길동'),
  accountEmail: Text('hong@example.com'),
  currentAccountPicture: CircleAvatar(
    backgroundImage: NetworkImage('https://example.com/profile.jpg'),
    onBackgroundImageError: (_, __) {
      // 이미지 로드 오류 시 처리
    },
  ),
  otherAccountsPictures: [
    CircleAvatar(
      backgroundImage: NetworkImage('https://example.com/profile2.jpg'),
    ),
  ],
  decoration: BoxDecoration(
    color: Colors.blue,
    image: DecorationImage(
      image: AssetImage('assets/drawer_header_bg.jpg'),
      fit: BoxFit.cover,
    ),
  ),
)
```

### endDrawer 사용하기

화면 오른쪽에서 나타나는 드로어를 사용할 수도 있습니다:

```dart
Scaffold(
  appBar: AppBar(
    title: Text('End Drawer 예제'),
    // 자동으로 endDrawer 아이콘 추가
  ),
  endDrawer: Drawer(
    child: // 드로어 내용...
  ),
  body: // 화면 내용...
)
```

### 다중 계층 Drawer 메뉴

중첩된 메뉴를 구현하기 위해 확장 가능한 드로어 항목을 만들 수 있습니다:

```dart
// 확장 가능한 드로어 항목
class ExpandableDrawerItem extends StatefulWidget {
  final IconData icon;
  final String title;
  final List<DrawerSubItem> subItems;

  const ExpandableDrawerItem({
    Key? key,
    required this.icon,
    required this.title,
    required this.subItems,
  }) : super(key: key);

  @override
  _ExpandableDrawerItemState createState() => _ExpandableDrawerItemState();
}

class _ExpandableDrawerItemState extends State<ExpandableDrawerItem> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          leading: Icon(widget.icon),
          title: Text(widget.title),
          trailing: Icon(
            _isExpanded ? Icons.expand_less : Icons.expand_more,
          ),
          onTap: () {
            setState(() {
              _isExpanded = !_isExpanded;
            });
          },
        ),
        if (_isExpanded)
          ...widget.subItems.map((item) => item.build(context)).toList(),
      ],
    );
  }
}

// 서브 아이템
class DrawerSubItem {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  DrawerSubItem({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: 16.0),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        onTap: onTap,
      ),
    );
  }
}
```

### Drawer와 go_router 통합

go_router에서 현재 라우트를 기반으로 활성 드로어 항목을 하이라이트할 수 있습니다:

```dart
// 동적으로 활성 상태를 설정하는 드로어 항목
class ActiveDrawerItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String routePath;
  final bool? isActive;

  const ActiveDrawerItem({
    Key? key,
    required this.icon,
    required this.title,
    required this.routePath,
    this.isActive,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 현재 라우트 경로 가져오기
    final currentRoute = GoRouterState.of(context).matchedLocation;

    // 현재 경로가 이 항목의 경로와 일치하는지 확인
    final isSelected = isActive ?? currentRoute.startsWith(routePath);

    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? Theme.of(context).primaryColor : null,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? Theme.of(context).primaryColor : null,
          fontWeight: isSelected ? FontWeight.bold : null,
        ),
      ),
      tileColor: isSelected ? Colors.blue.withOpacity(0.1) : null,
      onTap: () {
        Navigator.pop(context);
        if (!isSelected) {
          context.go(routePath);
        }
      },
    );
  }
}
```

## BottomNavigationBar (하단 내비게이션 바)

하단 내비게이션 바는 화면 하단에 고정된 메뉴를 제공하며, 앱의 주요 섹션 간 전환을 위해 사용됩니다.

### 기본 BottomNavigationBar 구현

```dart
class BottomNavExample extends StatefulWidget {
  @override
  _BottomNavExampleState createState() => _BottomNavExampleState();
}

class _BottomNavExampleState extends State<BottomNavExample> {
  int _selectedIndex = 0;

  // 화면 목록
  static final List<Widget> _screens = [
    HomeScreen(),
    SearchScreen(),
    NotificationsScreen(),
    ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bottom Navigation 예제'),
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed, // 4개 이상 항목에 필요
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '홈',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: '검색',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: '알림',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '프로필',
          ),
        ],
      ),
    );
  }
}
```

### 배지가 있는 BottomNavigationBar

알림 수와 같은 배지를 BottomNavigationBar 항목에 추가할 수 있습니다:

```dart
BottomNavigationBar(
  currentIndex: _selectedIndex,
  onTap: _onItemTapped,
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: '홈',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.search),
      label: '검색',
    ),
    BottomNavigationBarItem(
      icon: Badge(
        label: Text('3'),
        isLabelVisible: _notificationCount > 0,
        child: Icon(Icons.notifications),
      ),
      label: '알림',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person),
      label: '프로필',
    ),
  ],
)
```

### 커스텀 스타일 적용

BottomNavigationBar의 스타일을 커스터마이징할 수 있습니다:

```dart
BottomNavigationBar(
  currentIndex: _selectedIndex,
  onTap: _onItemTapped,
  // 고정 타입 (모든 항목이 항상 표시됨)
  type: BottomNavigationBarType.fixed,
  // 선택된 항목의 색상
  selectedItemColor: Colors.blue,
  // 선택되지 않은 항목의 색상
  unselectedItemColor: Colors.grey,
  // 선택된 항목의 아이콘 크기
  selectedIconTheme: IconThemeData(size: 30),
  // 선택되지 않은 항목의 아이콘 크기
  unselectedIconTheme: IconThemeData(size: 24),
  // 선택된 항목의 레이블 스타일
  selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold),
  // 선택되지 않은 항목의 레이블 스타일
  unselectedLabelStyle: TextStyle(fontWeight: FontWeight.normal),
  // 배경색
  backgroundColor: Colors.white,
  // 높이
  elevation: 8,
  items: // 내비게이션 항목 정의...
)
```

### BottomNavigationBar 대안: NavigationBar

Material 3 디자인을 사용하는 앱에서는 `NavigationBar`를 사용할 수 있습니다:

```dart
NavigationBar(
  selectedIndex: _selectedIndex,
  onDestinationSelected: _onItemTapped,
  destinations: const [
    NavigationDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: '홈',
    ),
    NavigationDestination(
      icon: Icon(Icons.search_outlined),
      selectedIcon: Icon(Icons.search),
      label: '검색',
    ),
    NavigationDestination(
      icon: Icon(Icons.notifications_outlined),
      selectedIcon: Icon(Icons.notifications),
      label: '알림',
    ),
    NavigationDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person),
      label: '프로필',
    ),
  ],
)
```

### BottomNavigationBar와 go_router 통합

앞서 살펴본 StatefulShellRoute를 사용하여 BottomNavigationBar를 go_router와 통합할 수 있습니다:

```dart
final GoRouter router = GoRouter(
  initialLocation: '/',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return ScaffoldWithNavBar(navigationShell: navigationShell);
      },
      branches: [
        // 각 탭에 대한 브랜치 정의
        StatefulShellBranch(routes: [GoRoute(path: '/', ...)]),
        StatefulShellBranch(routes: [GoRoute(path: '/search', ...)]),
        StatefulShellBranch(routes: [GoRoute(path: '/notifications', ...)]),
        StatefulShellBranch(routes: [GoRoute(path: '/profile', ...)]),
      ],
    ),
  ],
);

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
          BottomNavigationBarItem(icon: Icon(Icons.search), label: '검색'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: '알림'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '프로필'),
        ],
        onTap: (index) => navigationShell.goBranch(index),
      ),
    );
  }
}
```

## TabBar (탭 바)

TabBar는 일반적으로 AppBar 내부나 화면 상단에 위치하며, 관련된 콘텐츠 간에 빠르게 전환할 수 있게 해줍니다.

### 기본 TabBar 구현

TabController를 사용한 기본 탭 구현:

```dart
class TabBarExample extends StatefulWidget {
  @override
  _TabBarExampleState createState() => _TabBarExampleState();
}

class _TabBarExampleState extends State<TabBarExample> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('TabBar 예제'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.directions_car), text: '자동차'),
            Tab(icon: Icon(Icons.directions_transit), text: '대중교통'),
            Tab(icon: Icon(Icons.directions_bike), text: '자전거'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          Center(child: Text('자동차 탭 내용')),
          Center(child: Text('대중교통 탭 내용')),
          Center(child: Text('자전거 탭 내용')),
        ],
      ),
    );
  }
}
```

### DefaultTabController 사용하기

더 간단한 TabBar 구현을 위해 DefaultTabController를 사용할 수 있습니다:

```dart
DefaultTabController(
  length: 3,
  child: Scaffold(
    appBar: AppBar(
      title: Text('DefaultTabController 예제'),
      bottom: TabBar(
        tabs: const [
          Tab(text: '최신'),
          Tab(text: '인기'),
          Tab(text: '즐겨찾기'),
        ],
      ),
    ),
    body: TabBarView(
      children: const [
        NewestContentTab(),
        PopularContentTab(),
        FavoritesContentTab(),
      ],
    ),
  ),
)
```

### 스크롤 가능한 TabBar

많은 탭이 있을 경우 스크롤 가능한 TabBar를 사용할 수 있습니다:

```dart
DefaultTabController(
  length: 8,
  child: Scaffold(
    appBar: AppBar(
      title: Text('스크롤 가능한 TabBar'),
      bottom: TabBar(
        isScrollable: true, // 스크롤 가능하게 설정
        tabs: const [
          Tab(text: '패션'),
          Tab(text: '액세서리'),
          Tab(text: '신발'),
          Tab(text: '전자제품'),
          Tab(text: '스포츠'),
          Tab(text: '도서'),
          Tab(text: '취미'),
          Tab(text: '게임'),
        ],
      ),
    ),
    body: TabBarView(
      children: // 탭 콘텐츠 정의...
    ),
  ),
)
```

### 커스텀 TabBar 스타일

TabBar의 스타일을 커스터마이징할 수 있습니다:

```dart
TabBar(
  // 선택된 탭의 색상
  labelColor: Colors.blue,
  // 선택되지 않은 탭의 색상
  unselectedLabelColor: Colors.grey,
  // 선택된 탭의 스타일
  labelStyle: TextStyle(fontWeight: FontWeight.bold),
  // 선택되지 않은 탭의 스타일
  unselectedLabelStyle: TextStyle(fontWeight: FontWeight.normal),
  // 인디케이터 색상
  indicatorColor: Colors.blue,
  // 인디케이터 두께
  indicatorWeight: 3,
  // 인디케이터 패딩
  indicatorPadding: EdgeInsets.symmetric(horizontal: 16),
  // 탭 패딩
  padding: EdgeInsets.symmetric(horizontal: 8),
  // 탭 간 간격
  labelPadding: EdgeInsets.symmetric(horizontal: 16),
  // 인디케이터 크기
  indicatorSize: TabBarIndicatorSize.label, // .tab도 가능
  // 인디케이터 모양
  indicator: BoxDecoration(
    borderRadius: BorderRadius.circular(8),
    color: Colors.blue.withOpacity(0.2),
  ),
  // 배경 색상
  // Material 3 사용 시 TabBar.secondary 사용 가능
  tabs: // 탭 정의...
)
```

### TabBar와 go_router 통합

TabBar가 있는 화면을 go_router와 통합하는 방법:

```dart
// go_router 설정
final GoRouter router = GoRouter(
  initialLocation: '/categories/popular',
  routes: [
    GoRoute(
      path: '/categories/:tab',
      builder: (context, state) {
        // URL에서 활성 탭 매개변수 추출
        final tab = state.pathParameters['tab'] ?? 'popular';
        return CategoryTabScreen(initialTab: tab);
      },
    ),
  ],
);

// 탭 화면
class CategoryTabScreen extends StatefulWidget {
  final String initialTab;

  const CategoryTabScreen({Key? key, required this.initialTab}) : super(key: key);

  @override
  _CategoryTabScreenState createState() => _CategoryTabScreenState();
}

class _CategoryTabScreenState extends State<CategoryTabScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final List<String> _tabs = ['popular', 'newest', 'trending'];

  @override
  void initState() {
    super.initState();
    // 초기 탭 인덱스 계산
    final initialIndex = _tabs.indexOf(widget.initialTab);
    _tabController = TabController(
      length: _tabs.length,
      vsync: this,
      initialIndex: initialIndex >= 0 ? initialIndex : 0,
    );

    // 탭 변경 감지
    _tabController.addListener(_handleTabChange);
  }

  void _handleTabChange() {
    if (!_tabController.indexIsChanging) {
      // URL 업데이트
      context.go('/categories/${_tabs[_tabController.index]}');
    }
  }

  @override
  void dispose() {
    _tabController.removeListener(_handleTabChange);
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('카테고리'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: '인기'),
            Tab(text: '최신'),
            Tab(text: '트렌딩'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          PopularCategoryTab(),
          NewestCategoryTab(),
          TrendingCategoryTab(),
        ],
      ),
    );
  }
}
```

## 복합 네비게이션 패턴

실제 앱에서는 여러 네비게이션 패턴을 함께 사용하는 경우가 많습니다. 다음은 Drawer, BottomNavigationBar, TabBar를 모두 사용하는 복합 네비게이션 예제입니다:

```dart
class ComplexNavigationApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: _router,
      // 앱 설정...
    );
  }
}

final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return ScaffoldWithNavBar(navigationShell: navigationShell);
      },
      branches: [
        // 홈 탭
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/',
              builder: (context, state) => HomeScreen(),
            ),
          ],
        ),
        // 카테고리 탭 (내부에 TabBar 포함)
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/categories/:tab',
              builder: (context, state) {
                final tab = state.pathParameters['tab'] ?? 'popular';
                return CategoryTabScreen(initialTab: tab);
              },
            ),
          ],
        ),
        // 프로필 탭
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => ProfileScreen(),
            ),
          ],
        ),
      ],
    ),
    // 기타 독립적인 라우트
    GoRoute(
      path: '/settings',
      builder: (context, state) => SettingsScreen(),
    ),
  ],
);

// 바텀 네비게이션 바와 드로어가 있는 스캐폴드
class ScaffoldWithNavBar extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const ScaffoldWithNavBar({required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _getTitle(navigationShell.currentIndex),
      ),
      drawer: AppDrawer(currentIndex: navigationShell.currentIndex),
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: '홈'),
          BottomNavigationBarItem(icon: Icon(Icons.category), label: '카테고리'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '프로필'),
        ],
        onTap: (index) => navigationShell.goBranch(index),
      ),
    );
  }

  // 현재 탭에 따라 제목 반환
  Widget _getTitle(int index) {
    switch (index) {
      case 0: return Text('홈');
      case 1: return Text('카테고리');
      case 2: return Text('프로필');
      default: return Text('앱');
    }
  }
}
```

## 요약

이 장에서는 Flutter의 세 가지 주요 네비게이션 위젯에 대해 살펴보았습니다:

- **Drawer**: 측면에서 슬라이드하여 나타나는 패널로, 주요 네비게이션 항목을 제공합니다. UserAccountsDrawerHeader를 통해 사용자 정보를 표시할 수 있으며, 계층적 메뉴를 구현할 수 있습니다.

- **BottomNavigationBar**: 화면 하단에 고정된 메뉴로, 앱의 주요 섹션 간을 빠르게 전환할 수 있습니다. Material 3 디자인에서는 NavigationBar라는 대안도 있습니다.

- **TabBar**: AppBar 내부나 화면 상단에 위치하며, 관련된 콘텐츠 간에 빠르게 전환할 수 있게 해줍니다. DefaultTabController를 통해 간편하게 구현할 수 있습니다.

또한 이러한 네비게이션 위젯들을 go_router와 통합하는 방법도 알아보았습니다. 실제 앱에서는 사용자 경험을 개선하기 위해 여러 네비게이션 패턴을 함께 사용하는 경우가 많습니다.

네비게이션은 사용자가 앱 내에서 원하는 정보를 찾고 다양한 기능에 접근하는 핵심 요소입니다. 직관적이고 일관된 네비게이션 경험을 제공하는 것이 성공적인 앱 디자인의 핵심입니다.
