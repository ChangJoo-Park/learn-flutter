---
title: Dio를 통한 API 통신
---

Flutter에서 네트워크 통신은 앱 개발에서 필수적인 요소입니다. 이 장에서는 Flutter에서 가장 널리 사용되는 HTTP 클라이언트 라이브러리인 Dio를 활용하여 API 통신하는 방법을 살펴보겠습니다.

## Dio 소개

Dio는 Flutter와 Dart를 위한 강력한 HTTP 클라이언트로, 다음과 같은 특징을 가지고 있습니다:

- 요청 취소
- 파일 다운로드/업로드
- FormData 지원
- 인터셉터 기능
- 타임아웃 설정
- 글로벌 설정 및 단일 요청 설정
- 자동 쿠키 관리
- 편리한 에러 핸들링

## 시작하기

먼저 pubspec.yaml 파일에 Dio 패키지를 추가합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^5.3.2 # 최신 버전 확인
```

패키지를 설치합니다:

```bash
flutter pub get
```

## 기본 사용법

### 1. Dio 인스턴스 생성

```dart
import 'package:dio/dio.dart';

final dio = Dio();
```

### 2. 기본 HTTP 요청하기

```dart
// GET 요청
Future<void> getRequest() async {
  try {
    final response = await dio.get('https://api.example.com/data');
    print('응답 데이터: ${response.data}');
  } catch (e) {
    print('에러: $e');
  }
}

// POST 요청
Future<void> postRequest() async {
  try {
    final response = await dio.post(
      'https://api.example.com/create',
      data: {'name': '홍길동', 'email': 'hong@example.com'},
    );
    print('응답 데이터: ${response.data}');
  } catch (e) {
    print('에러: $e');
  }
}

// PUT 요청
Future<void> putRequest() async {
  try {
    final response = await dio.put(
      'https://api.example.com/update/1',
      data: {'name': '김철수', 'email': 'kim@example.com'},
    );
    print('응답 데이터: ${response.data}');
  } catch (e) {
    print('에러: $e');
  }
}

// DELETE 요청
Future<void> deleteRequest() async {
  try {
    final response = await dio.delete('https://api.example.com/delete/1');
    print('응답 데이터: ${response.data}');
  } catch (e) {
    print('에러: $e');
  }
}
```

### 3. 쿼리 파라미터 사용하기

```dart
Future<void> getWithQueryParams() async {
  try {
    final response = await dio.get(
      'https://api.example.com/search',
      queryParameters: {
        'keyword': '플러터',
        'page': 1,
        'limit': 20,
      },
    );
    print('응답 데이터: ${response.data}');
  } catch (e) {
    print('에러: $e');
  }
}
```

### 4. 헤더 추가하기

```dart
Future<void> requestWithHeaders() async {
  try {
    final response = await dio.get(
      'https://api.example.com/secure-data',
      options: Options(
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
    print('응답 데이터: ${response.data}');
  } catch (e) {
    print('에러: $e');
  }
}
```

## Dio 고급 기능

### 1. BaseOptions 설정

모든 요청에 공통으로 적용될 기본 설정을 구성할 수 있습니다:

```dart
final dio = Dio(
  BaseOptions(
    baseUrl: 'https://api.example.com/v1',
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    responseType: ResponseType.json,
  ),
);
```

이제 상대 경로만으로 요청할 수 있습니다:

```dart
// baseUrl + '/users' = 'https://api.example.com/v1/users'
final response = await dio.get('/users');
```

### 2. 인터셉터(Interceptor)

인터셉터는 요청, 응답, 에러를 가로채어 처리할 수 있게 해줍니다:

```dart
class ApiInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // 요청이 전송되기 전에 처리
    print('요청: ${options.method} ${options.path}');

    // 모든 요청에 자동으로 헤더 추가
    options.headers['Authorization'] = 'Bearer ${getToken()}';

    // 요청 계속 진행
    handler.next(options);

    // 또는 요청 중단 및 에러 반환
    // handler.reject(DioException(...))
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    // 응답 데이터 처리
    print('응답: ${response.statusCode}');

    // 특정 상태 코드에 대한 처리
    if (response.statusCode == 401) {
      // 토큰 갱신 등의 작업
    }

    // 응답 계속 전달
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // 에러 처리
    print('에러: ${err.message}');

    // 네트워크 에러 처리
    if (err.type == DioExceptionType.connectionTimeout) {
      // 타임아웃 에러 처리
    }

    // 에러 계속 전파
    handler.next(err);

    // 또는 에러 회복 및 응답 대체
    // handler.resolve(Response(...))
  }
}

// 인터셉터 등록
dio.interceptors.add(ApiInterceptor());
```

#### 로깅 인터셉터 사용

Dio는 기본적으로 로깅 인터셉터를 제공합니다:

```dart
dio.interceptors.add(LogInterceptor(
  requestBody: true,
  responseBody: true,
));
```

### 3. 파일 업로드

Dio를 사용하여 파일을 업로드하는 방법:

```dart
Future<void> uploadFile() async {
  try {
    final formData = FormData.fromMap({
      'name': '내 문서',
      'file': await MultipartFile.fromFile(
        '/path/to/file.pdf',
        filename: 'document.pdf',
      ),
      // 여러 파일 업로드
      'images': [
        await MultipartFile.fromFile('/path/to/image1.jpg'),
        await MultipartFile.fromFile('/path/to/image2.jpg'),
      ],
    });

    final response = await dio.post(
      'https://api.example.com/upload',
      data: formData,
      onSendProgress: (sent, total) {
        final progress = (sent / total * 100).toStringAsFixed(2);
        print('업로드 진행률: $progress%');
      },
    );

    print('업로드 완료: ${response.data}');
  } catch (e) {
    print('업로드 에러: $e');
  }
}
```

### 4. 파일 다운로드

Dio를 사용하여 파일을 다운로드하는 방법:

```dart
Future<void> downloadFile() async {
  try {
    final savePath = '/path/to/save/file.pdf';

    await dio.download(
      'https://example.com/files/document.pdf',
      savePath,
      onReceiveProgress: (received, total) {
        if (total != -1) {
          final progress = (received / total * 100).toStringAsFixed(2);
          print('다운로드 진행률: $progress%');
        }
      },
    );

    print('다운로드 완료: $savePath');
  } catch (e) {
    print('다운로드 에러: $e');
  }
}
```

### 5. 요청 취소

Dio는 요청을 취소할 수 있는 기능을 제공합니다:

```dart
// CancelToken 생성
final cancelToken = CancelToken();

// 요청에 CancelToken 적용
void makeRequest() async {
  try {
    final response = await dio.get(
      'https://api.example.com/data',
      cancelToken: cancelToken,
    );
    print('응답: ${response.data}');
  } catch (e) {
    if (CancelToken.isCancel(e)) {
      print('요청 취소됨: ${e.message}');
    } else {
      print('에러: $e');
    }
  }
}

// 요청 취소
void cancelRequest() {
  cancelToken.cancel('사용자에 의해 요청이 취소되었습니다.');
}
```

### 6. 동시 요청

Dio를 사용하여 여러 요청을 동시에 처리할 수 있습니다:

```dart
Future<void> multipleRequests() async {
  try {
    final responses = await Future.wait([
      dio.get('https://api.example.com/users'),
      dio.get('https://api.example.com/products'),
      dio.get('https://api.example.com/orders'),
    ]);

    final users = responses[0].data;
    final products = responses[1].data;
    final orders = responses[2].data;

    print('사용자: $users');
    print('상품: $products');
    print('주문: $orders');
  } catch (e) {
    print('에러: $e');
  }
}
```

## 에러 처리

Dio에서 발생하는 예외는 `DioException` 타입으로, 다음과 같은 정보를 포함합니다:

```dart
Future<void> handleErrors() async {
  try {
    final response = await dio.get('https://api.example.com/nonexistent');
    print('응답: ${response.data}');
  } on DioException catch (e) {
    // 에러 유형 확인
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
        print('연결 시간 초과');
        break;
      case DioExceptionType.sendTimeout:
        print('요청 전송 시간 초과');
        break;
      case DioExceptionType.receiveTimeout:
        print('응답 수신 시간 초과');
        break;
      case DioExceptionType.badResponse:
        // HTTP 상태 코드로 에러 처리
        switch (e.response?.statusCode) {
          case 400:
            print('잘못된 요청: ${e.response?.data}');
            break;
          case 401:
            print('인증 실패: ${e.response?.data}');
            break;
          case 404:
            print('리소스를 찾을 수 없음: ${e.response?.data}');
            break;
          case 500:
            print('서버 오류: ${e.response?.data}');
            break;
          default:
            print('알 수 없는 오류: ${e.response?.statusCode}');
            break;
        }
        break;
      case DioExceptionType.cancel:
        print('요청이 취소됨');
        break;
      default:
        print('네트워크 오류: ${e.message}');
        break;
    }

    // 요청 정보
    print('URL: ${e.requestOptions.uri}');
    print('Method: ${e.requestOptions.method}');
    print('Headers: ${e.requestOptions.headers}');

    // 응답 정보 (있는 경우)
    if (e.response != null) {
      print('응답 데이터: ${e.response?.data}');
      print('응답 헤더: ${e.response?.headers}');
    }
  } catch (e) {
    print('일반 오류: $e');
  }
}
```

## Dio 클라이언트 구조화

실제 앱에서는 Dio 클라이언트를 구조화하여 사용하는 것이 좋습니다:

```dart
// api_client.dart
class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  late final Dio dio;

  factory ApiClient() {
    return _instance;
  }

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'https://api.example.com/v1',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 3),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // 인터셉터 추가
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));

    dio.interceptors.add(CustomInterceptor());
  }

  // 사용자 API
  Future<List<User>> getUsers() async {
    try {
      final response = await dio.get('/users');
      return (response.data as List)
          .map((json) => User.fromJson(json))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<User> getUserById(String id) async {
    try {
      final response = await dio.get('/users/$id');
      return User.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<User> createUser(UserCreateDto dto) async {
    try {
      final response = await dio.post(
        '/users',
        data: dto.toJson(),
      );
      return User.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // 상품 API
  Future<List<Product>> getProducts() async {
    try {
      final response = await dio.get('/products');
      return (response.data as List)
          .map((json) => Product.fromJson(json))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // 공통 에러 처리
  Exception _handleError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException('네트워크 시간 초과');

      case DioExceptionType.badResponse:
        switch (e.response?.statusCode) {
          case 400:
            return BadRequestException(e.response?.data['message']);
          case 401:
            return UnauthorizedException(e.response?.data['message']);
          case 404:
            return NotFoundException(e.response?.data['message']);
          case 500:
            return ServerException(e.response?.data['message']);
          default:
            return ApiException('알 수 없는 에러: ${e.response?.statusCode}');
        }

      case DioExceptionType.cancel:
        return RequestCanceledException('요청이 취소됨');

      default:
        return NetworkException('네트워크 오류: ${e.message}');
    }
  }
}

// 사용자 정의 예외 클래스
class ApiException implements Exception {
  final String message;
  ApiException(this.message);
}

class TimeoutException extends ApiException {
  TimeoutException(String message) : super(message);
}

class BadRequestException extends ApiException {
  BadRequestException(String message) : super(message);
}

class UnauthorizedException extends ApiException {
  UnauthorizedException(String message) : super(message);
}

class NotFoundException extends ApiException {
  NotFoundException(String message) : super(message);
}

class ServerException extends ApiException {
  ServerException(String message) : super(message);
}

class RequestCanceledException extends ApiException {
  RequestCanceledException(String message) : super(message);
}

class NetworkException extends ApiException {
  NetworkException(String message) : super(message);
}

// 사용자 정의 인터셉터
class CustomInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // 인증 토큰 추가
    final token = TokenManager.getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    // 401 에러 시 토큰 갱신 시도
    if (err.response?.statusCode == 401) {
      try {
        final isSuccess = await TokenManager.refreshToken();
        if (isSuccess) {
          // 토큰 갱신 성공 시 원래 요청 재시도
          final options = err.requestOptions;
          final token = TokenManager.getToken();
          options.headers['Authorization'] = 'Bearer $token';

          // 원래 요청 재시도
          final response = await Dio().fetch(options);
          return handler.resolve(response);
        }
      } catch (e) {
        // 토큰 갱신 실패 시 로그아웃
        AuthManager.logout();
      }
    }

    handler.next(err);
  }
}
```

## 실제 예제: 날씨 앱 API 통신

간단한 날씨 앱의 API 통신 예제를 살펴보겠습니다:

```dart
// weather_service.dart
class WeatherService {
  final Dio _dio;

  WeatherService() : _dio = Dio(
    BaseOptions(
      baseUrl: 'https://api.openweathermap.org/data/2.5',
      queryParameters: {
        'appid': 'YOUR_API_KEY',
        'units': 'metric',
        'lang': 'kr',
      },
    ),
  ) {
    _dio.interceptors.add(LogInterceptor(
      requestHeader: true,
      requestBody: true,
      responseBody: true,
      responseHeader: false,
      error: true,
    ));
  }

  Future<Weather> getCurrentWeather(String city) async {
    try {
      final response = await _dio.get(
        '/weather',
        queryParameters: {'q': city},
      );
      return Weather.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw CityNotFoundException('도시를 찾을 수 없습니다: $city');
      }
      throw WeatherServiceException('날씨 정보를 가져오는 중 오류 발생: ${e.message}');
    }
  }

  Future<Forecast> getForecast(String city) async {
    try {
      final response = await _dio.get(
        '/forecast',
        queryParameters: {'q': city},
      );
      return Forecast.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw CityNotFoundException('도시를 찾을 수 없습니다: $city');
      }
      throw WeatherServiceException('날씨 예보를 가져오는 중 오류 발생: ${e.message}');
    }
  }

  Future<Weather> getWeatherByCoordinates(double lat, double lon) async {
    try {
      final response = await _dio.get(
        '/weather',
        queryParameters: {
          'lat': lat.toString(),
          'lon': lon.toString(),
        },
      );
      return Weather.fromJson(response.data);
    } on DioException catch (e) {
      throw WeatherServiceException('날씨 정보를 가져오는 중 오류 발생: ${e.message}');
    }
  }
}

// 예외 클래스
class WeatherServiceException implements Exception {
  final String message;
  WeatherServiceException(this.message);

  @override
  String toString() => message;
}

class CityNotFoundException extends WeatherServiceException {
  CityNotFoundException(String message) : super(message);
}

// 위젯에서 사용 예
class WeatherScreen extends StatefulWidget {
  @override
  _WeatherScreenState createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  final WeatherService _weatherService = WeatherService();
  Weather? _weather;
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchWeather();
  }

  Future<void> _fetchWeather() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final weather = await _weatherService.getCurrentWeather('Seoul');
      setState(() {
        _weather = weather;
        _isLoading = false;
      });
    } on CityNotFoundException catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    } on WeatherServiceException catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = '알 수 없는 오류가 발생했습니다: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('날씨 앱'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _fetchWeather,
          ),
        ],
      ),
      body: Center(
        child: _isLoading
            ? CircularProgressIndicator()
            : _error != null
                ? Text(_error!, style: TextStyle(color: Colors.red))
                : _buildWeatherInfo(),
      ),
    );
  }

  Widget _buildWeatherInfo() {
    if (_weather == null) {
      return Text('날씨 정보가 없습니다');
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          _weather!.cityName,
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.network(
              'https://openweathermap.org/img/wn/${_weather!.iconCode}@2x.png',
              errorBuilder: (context, error, stackTrace) {
                return Icon(Icons.image_not_supported, size: 50);
              },
            ),
            Text(
              '${_weather!.temperature.toStringAsFixed(1)}°C',
              style: TextStyle(fontSize: 32),
            ),
          ],
        ),
        SizedBox(height: 16),
        Text(
          _weather!.description,
          style: TextStyle(fontSize: 16),
        ),
        SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildWeatherDetail('습도', '${_weather!.humidity}%'),
            _buildWeatherDetail('풍속', '${_weather!.windSpeed} m/s'),
            _buildWeatherDetail('기압', '${_weather!.pressure} hPa'),
          ],
        ),
      ],
    );
  }

  Widget _buildWeatherDetail(String label, String value) {
    return Column(
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 14, color: Colors.grey),
        ),
        SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(fontSize: 16),
        ),
      ],
    );
  }
}
```

## 요약

- **Dio**는 Flutter에서 HTTP 통신을 위한 강력하고 유연한 라이브러리입니다.
- **기본 기능**으로 GET, POST, PUT, DELETE 등의 HTTP 요청을 쉽게 만들 수 있습니다.
- **고급 기능**으로는 BaseOptions 설정, 인터셉터, 파일 업로드/다운로드, 요청 취소, 동시 요청 등이 있습니다.
- **에러 처리**는 `DioException`을 통해 세분화된 오류 정보를 얻을 수 있습니다.
- **구조화**된 API 클라이언트를 만들어 재사용성과 유지보수성을 높일 수 있습니다.

다음 장에서는 Dio를 통해 받은 JSON 데이터를 Dart 객체로 변환하는 JSON 직렬화(`json_serializable`, `freezed`) 방법에 대해 알아보겠습니다.
