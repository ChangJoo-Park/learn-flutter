# Navigator 1.0

Flutter의 기본적인 화면 전환 방식인 Navigator 1.0에 대해 알아보겠습니다. 이 방식은 명령형(imperative) 스타일로 화면 전환을 구현하며, 스택 기반의 네비게이션을 제공합니다.

## Navigator의 개념

Navigator는 앱의 화면들을 스택(stack) 형태로 관리하는 위젯입니다. 우리가 사용하는 대부분의 앱에서는 사용자가 새 화면으로 이동하면 이전 화면 위에 새 화면이 쌓이고, 뒤로 가기를 하면 가장 위에 있는 화면이 제거되는 구조입니다.

```mermaid
graph TD
    A[화면 스택] --> B[첫 번째 화면]
    A --> C[두 번째 화면]
    A --> D[세 번째 화면 <br> (현재 보이는 화면)]

    E[push] --> |새 화면 추가| A
    F[pop] --> |최상위 화면 제거| A
```

Flutter의 `Navigator` 위젯은 다음과 같은 주요 메서드를 제공합니다:

- **push**: 새 화면을 스택의 맨 위에 추가
- **pop**: 스택의 맨 위에 있는 화면 제거
- **pushReplacement**: 현재 화면을 새 화면으로 교체
- **popUntil**: 특정 조건이 만족될 때까지 화면들을 제거
- **pushNamedAndRemoveUntil**: 이름으로 새 화면을 추가하고 특정 조건이 만족될 때까지 이전 화면들을 제거

## 기본 사용법

### 1. 직접 라우팅 (익명 라우팅)

가장 기본적인 화면 전환 방법은 `Navigator.push`와 `Navigator.pop`을 사용하는 것입니다.

```dart
// 다음 화면으로 이동
ElevatedButton(
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SecondScreen()),
    );
  },
  child: Text('두 번째 화면으로 이동'),
);

// 이전 화면으로 돌아가기
ElevatedButton(
  onPressed: () {
    Navigator.pop(context);
  },
  child: Text('이전 화면으로 돌아가기'),
);
```

### 2. 명명된 라우팅 (Named Routes)

더 체계적인 방법으로는 앱 시작 시 라우트 맵을 정의하고 이름으로 화면 전환을 하는 방식이 있습니다.

```dart
// main.dart에서 라우트 맵 정의
MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => HomeScreen(),
    '/second': (context) => SecondScreen(),
    '/third': (context) => ThirdScreen(),
  },
);

// 다음 화면으로 이동
ElevatedButton(
  onPressed: () {
    Navigator.pushNamed(context, '/second');
  },
  child: Text('두 번째 화면으로 이동'),
);

// 이전 화면으로 돌아가기
ElevatedButton(
  onPressed: () {
    Navigator.pop(context);
  },
  child: Text('이전 화면으로 돌아가기'),
);
```

## 라우트 전환 시 데이터 전달

### 1. 생성자를 통한 데이터 전달

```dart
// 데이터 전달하며 화면 전환
ElevatedButton(
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DetailScreen(item: item),
      ),
    );
  },
  child: Text('상세 화면으로 이동'),
);

// 데이터를 받는 화면
class DetailScreen extends StatelessWidget {
  final Item item;

  DetailScreen({required this.item});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(item.title)),
      body: Center(
        child: Text(item.description),
      ),
    );
  }
}
```

### 2. 명명된 라우트에 인수 전달

```dart
// 인수 전달하며 명명된 라우트로 이동
Navigator.pushNamed(
  context,
  '/detail',
  arguments: {'id': 123, 'title': '상품 제목'},
);

// 인수를 받는 화면
class DetailScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    final id = args['id'];
    final title = args['title'];

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Text('ID: $id'),
      ),
    );
  }
}
```

### 3. 결과를 반환받기

화면 전환 후 이전 화면으로 결과 값을 반환받을 수도 있습니다:

```dart
// 결과를 받기 위해 비동기로 화면 전환
ElevatedButton(
  onPressed: () async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SelectionScreen()),
    );
    // 결과 처리
    if (result != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('선택된 항목: $result')),
      );
    }
  },
  child: Text('항목 선택하기'),
);

// 결과를 반환하는 화면
class SelectionScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('항목 선택')),
      body: ListView(
        children: [
          ListTile(
            title: Text('항목 1'),
            onTap: () {
              Navigator.pop(context, '항목 1');
            },
          ),
          ListTile(
            title: Text('항목 2'),
            onTap: () {
              Navigator.pop(context, '항목 2');
            },
          ),
        ],
      ),
    );
  }
}
```

## 화면 전환 애니메이션 커스터마이징

### 1. 내장 애니메이션 사용

Flutter는 기본적으로 여러 종류의 화면 전환 애니메이션을 제공합니다:

```dart
// 오른쪽에서 왼쪽으로 슬라이드 (기본)
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen()),
);

// 아래에서 위로 슬라이드
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => SecondScreen(),
    fullscreenDialog: true, // 다이얼로그 스타일 전환
  ),
);

// 페이드 인/아웃 효과
Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => SecondScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  ),
);
```

### 2. 커스텀 애니메이션 생성

원하는 전환 효과가 없다면 직접 만들 수도 있습니다:

```dart
// 스케일 애니메이션 (확대/축소 효과)
Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => SecondScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return ScaleTransition(
        scale: animation,
        child: child,
      );
    },
    transitionDuration: Duration(milliseconds: 500),
  ),
);

// 회전 애니메이션
Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => SecondScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return RotationTransition(
        turns: Tween<double>(begin: 0.0, end: 1.0).animate(animation),
        child: child,
      );
    },
    transitionDuration: Duration(seconds: 1),
  ),
);

// 여러 애니메이션 조합
Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => SecondScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      // 페이드 효과와 슬라이드 효과 결합
      return FadeTransition(
        opacity: animation,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(1.0, 0.0), // 오른쪽에서
            end: Offset.zero, // 중앙으로
          ).animate(animation),
          child: child,
        ),
      );
    },
    transitionDuration: Duration(milliseconds: 500),
  ),
);
```

### 3. Hero 애니메이션

두 화면 간에 동일한 위젯이 있을 때, 그 위젯이 한 화면에서 다른 화면으로 자연스럽게 움직이는 효과를 구현할 수 있습니다:

```dart
// 첫 번째 화면
Hero(
  tag: 'imageHero', // 반드시 고유한 태그 필요
  child: Image.network('https://example.com/image.jpg'),
);

// 두 번째 화면 (상세 화면)
Hero(
  tag: 'imageHero', // 첫 번째 화면과 동일한 태그
  child: Image.network('https://example.com/image.jpg'),
);
```

## 중첩 네비게이션 (Nested Navigation)

앱의 일부 영역에서만 별도의 네비게이션 스택을 관리하고 싶을 때 사용합니다:

```dart
class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('중첩 네비게이션')),
      body: Row(
        children: [
          // 사이드바
          Container(
            width: 200,
            color: Colors.grey[200],
            child: ListView(
              children: [
                ListTile(
                  title: Text('항목 1'),
                  onTap: () {
                    // 중첩 네비게이터 접근
                    Navigator.of(context, rootNavigator: false)
                        .pushReplacementNamed('/item1');
                  },
                ),
                ListTile(
                  title: Text('항목 2'),
                  onTap: () {
                    Navigator.of(context, rootNavigator: false)
                        .pushReplacementNamed('/item2');
                  },
                ),
              ],
            ),
          ),
          // 메인 콘텐츠 영역 (중첩 네비게이터)
          Expanded(
            child: Navigator(
              initialRoute: '/item1',
              onGenerateRoute: (settings) {
                Widget page;
                switch (settings.name) {
                  case '/item1':
                    page = Item1Screen();
                    break;
                  case '/item2':
                    page = Item2Screen();
                    break;
                  default:
                    page = Item1Screen();
                }
                return MaterialPageRoute(builder: (_) => page);
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

## Navigator 1.0의 한계

Navigator 1.0은 간단한 앱에서는 잘 동작하지만, 복잡한 앱에서는 몇 가지 한계점이 있습니다:

1. **딥 링크 처리의 어려움**: 앱 외부에서 특정 화면으로 직접 접근하는 딥 링크를 처리하기 어렵습니다.
2. **웹 통합의 제한**: 웹 기반 애플리케이션에서 URL과 Navigator의 상태를 동기화하는 데 어려움이 있습니다.
3. **상태 관리의 복잡성**: 여러 계층의 네비게이션 스택이 있는 경우 상태 관리가 복잡해집니다.
4. **선언적 스타일 부재**: Flutter의 대부분은 선언적 스타일이지만, Navigator 1.0은 명령형 API를 사용합니다.

이러한 한계를 극복하기 위해 Flutter 팀은 Navigator 2.0을 도입했으며, 이는 다음 장에서 자세히 다루겠습니다.

## 실제 예제: 쇼핑 앱 구현

쇼핑 앱을 예로 들어 Navigator 1.0의 활용 방법을 살펴보겠습니다:

```dart
// main.dart
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '쇼핑 앱',
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        '/categories': (context) => CategoriesScreen(),
        '/cart': (context) => CartScreen(),
        '/profile': (context) => ProfileScreen(),
      },
      onGenerateRoute: (settings) {
        // 동적 라우트 처리
        if (settings.name!.startsWith('/product/')) {
          // /product/123 형식의 URL에서 ID 추출
          final productId = settings.name!.split('/')[2];
          return MaterialPageRoute(
            builder: (context) => ProductDetailScreen(productId: productId),
          );
        }
        // 정의되지 않은 라우트는 홈 화면으로 리다이렉트
        return MaterialPageRoute(builder: (context) => HomeScreen());
      },
    );
  }
}

// 홈 화면
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('홈')),
      drawer: AppDrawer(),
      body: ListView(
        children: [
          // 배너 슬라이더
          CarouselSlider(/* ... */),

          // 카테고리 그리드
          GridView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.5,
            ),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              return CategoryCard(
                category: categories[index],
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    '/categories',
                    arguments: {'categoryId': categories[index].id},
                  );
                },
              );
            },
          ),

          // 추천 상품 목록
          Text('추천 상품', style: Theme.of(context).textTheme.headline6),
          SizedBox(height: 8),
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: recommendedProducts.length,
              itemBuilder: (context, index) {
                final product = recommendedProducts[index];
                return ProductCard(
                  product: product,
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      '/product/${product.id}',
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: AppBottomNavBar(currentIndex: 0),
    );
  }
}

// 상품 상세 화면
class ProductDetailScreen extends StatelessWidget {
  final String productId;

  ProductDetailScreen({required this.productId});

  @override
  Widget build(BuildContext context) {
    // productId를 사용하여 상품 데이터 가져오기
    final product = getProductById(productId);

    return Scaffold(
      appBar: AppBar(title: Text(product.name)),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 상품 이미지 슬라이더
            Hero(
              tag: 'product-${product.id}',
              child: CarouselSlider(
                items: product.images.map((url) {
                  return Image.network(url);
                }).toList(),
                options: CarouselOptions(
                  height: 300,
                  viewportFraction: 1.0,
                  enlargeCenterPage: false,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 상품명
                  Text(
                    product.name,
                    style: Theme.of(context).textTheme.headline5,
                  ),
                  SizedBox(height: 8),

                  // 가격
                  Text(
                    '₩${product.price.toStringAsFixed(0)}',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  SizedBox(height: 16),

                  // 설명
                  Text(
                    product.description,
                    style: Theme.of(context).textTheme.bodyText2,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // 장바구니에 추가
                    addToCart(product);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('장바구니에 추가되었습니다')),
                    );
                  },
                  child: Text('장바구니에 추가'),
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // 장바구니에 추가하고 장바구니 화면으로 이동
                    addToCart(product);
                    Navigator.pushNamed(context, '/cart');
                  },
                  style: ElevatedButton.styleFrom(
                    primary: Colors.orange,
                  ),
                  child: Text('바로 구매'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 요약

- **Navigator 1.0**은 Flutter의 기본적인 화면 전환 메커니즘으로, 스택 기반의 네비게이션을 제공합니다.
- **주요 메서드**로는 push(), pop(), pushReplacement(), popUntil() 등이 있습니다.
- **익명 라우팅**(직접 라우팅)과 **명명된 라우팅**(Named Routes)을 모두 지원합니다.
- **데이터 전달** 방법으로는 생성자를 통한 전달, 명명된 라우트의 arguments, 결과 반환 등이 있습니다.
- **애니메이션**을 커스터마이징하여 다양한 화면 전환 효과를 구현할 수 있습니다.
- **Hero 애니메이션**을 사용하여 두 화면 간의 요소를 자연스럽게 연결할 수 있습니다.
- **중첩 네비게이션**을 통해 앱 일부에서 별도의 네비게이션 스택을 관리할 수 있습니다.
- 다만, 딥 링크 처리, 웹 통합, 복잡한 라우팅 시나리오 등에서는 **한계점**이 있습니다.

다음 장에서는 이러한 한계를 극복하기 위해 도입된 Navigator 2.0에 대해 알아보겠습니다.
