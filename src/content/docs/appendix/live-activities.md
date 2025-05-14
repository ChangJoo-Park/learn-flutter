---
title: iOS 라이브 액티비티
---


iOS 16부터 도입된 라이브 액티비티(Live Activities)는 사용자가 앱을 열지 않고도 실시간으로 업데이트되는 정보를 잠금 화면이나 동적 섬(Dynamic Island)에서 확인할 수 있게 해주는 기능입니다. 이 문서에서는 Flutter 앱에서 iOS 라이브 액티비티를 구현하는 방법에 대해 알아보겠습니다.

## 라이브 액티비티 개요

라이브 액티비티는 다음과 같은 상황에 유용합니다:

- 음식 배달 상태 추적
- 스포츠 경기 점수 업데이트
- 차량 호출 위치 추적
- 운동 세션 통계 표시
- 타이머 또는 카운트다운

라이브 액티비티는 iOS 16.1 이상에서 지원되며, 동적 섬은 iPhone 14 Pro 이상의 모델에서만 사용할 수 있습니다.

## 구현 개요

Flutter 앱에서 iOS 라이브 액티비티를 구현하려면 다음과 같은 단계가 필요합니다:

1. iOS 위젯 익스텐션 생성
2. 익스텐션용 Swift 코드 작성
3. Flutter 앱에서 라이브 액티비티 제어 구현
4. 푸시 알림을 통한 원격 업데이트 구성

Flutter는 네이티브 iOS 위젯을 직접 렌더링할 수 없으므로, 네이티브 Swift 코드를 통해 라이브 액티비티를 구현해야 합니다.

## 필요한 패키지

라이브 액티비티를 구현하기 위해 다음 패키지를 사용합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  live_activities: ^1.9.0 # iOS 라이브 액티비티 제어용 플러그인
```

## 1. iOS 위젯 익스텐션 생성

먼저, Xcode에서 iOS 위젯 익스텐션을 생성해야 합니다:

1. Xcode에서 Flutter 프로젝트의 iOS 폴더 열기 (Runner.xcworkspace)
2. File > New > Target 선택
3. "Widget Extension" 템플릿 선택 후 "Next" 클릭
4. 익스텐션 이름 입력 (예: "LiveActivitiesExtension")
5. "Include Live Activity" 옵션 체크
6. "Finish" 클릭

## 2. 활동 정보 모델 정의

라이브 액티비티에 표시할 데이터 모델을 정의합니다:

```swift
// ActivityAttributes.swift

import ActivityKit
import SwiftUI

struct DeliveryAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var status: String
        var estimatedDeliveryTime: Date
        var driverName: String
        var driverLocation: String
        var progressPercentage: Double
    }

    var orderNumber: String
    var restaurantName: String
}
```

## 3. 라이브 액티비티 뷰 디자인

라이브 액티비티의 레이아웃을 정의합니다:

```swift
// LiveActivitiesExtensionLiveActivity.swift

import ActivityKit
import WidgetKit
import SwiftUI

struct LiveActivitiesExtensionLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: DeliveryAttributes.self) { context in
            // 잠금 화면, 알림 센터 레이아웃
            HStack {
                VStack(alignment: .leading) {
                    Text(context.attributes.restaurantName)
                        .font(.headline)

                    Text("주문 번호: \(context.attributes.orderNumber)")
                        .font(.subheadline)

                    Text("배달원: \(context.state.driverName)")
                        .font(.body)

                    Text(context.state.status)
                        .font(.body)
                        .foregroundColor(.blue)

                    Text("예상 도착 시간: \(formatDate(context.state.estimatedDeliveryTime))")
                        .font(.caption)
                }

                Spacer()

                VStack {
                    ProgressView(value: context.state.progressPercentage, total: 100)
                        .progressViewStyle(CircularProgressViewStyle())

                    Text("\(Int(context.state.progressPercentage))%")
                        .font(.caption)
                }
            }
            .padding()
        } dynamicIsland: { context in
            // 동적 섬 레이아웃
            DynamicIsland {
                // 확장되지 않은 상태 - 콤팩트 뷰
                DynamicIslandExpandedRegion(.leading) {
                    Text(context.attributes.restaurantName)
                        .font(.headline)
                }

                DynamicIslandExpandedRegion(.trailing) {
                    Text(context.state.status)
                        .font(.caption)
                        .foregroundColor(.blue)
                }

                DynamicIslandExpandedRegion(.bottom) {
                    HStack {
                        VStack(alignment: .leading) {
                            Text("배달원: \(context.state.driverName)")
                                .font(.caption)
                            Text(context.state.driverLocation)
                                .font(.caption2)
                        }

                        Spacer()

                        VStack(alignment: .trailing) {
                            Text("도착 예정")
                                .font(.caption)
                            Text(formatTime(context.state.estimatedDeliveryTime))
                                .font(.caption)
                        }
                    }
                }
            } compactLeading: {
                Text(context.attributes.restaurantName.prefix(1))
                    .font(.caption)
            } compactTrailing: {
                Text("\(Int(context.state.progressPercentage))%")
                    .font(.caption)
            } minimal: {
                ProgressView(value: context.state.progressPercentage, total: 100)
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .frame(width: 20, height: 20)
            }
        }
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }

    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}
```

## 4. Info.plist 권한 추가

라이브 액티비티 익스텐션의 Info.plist에 다음 키를 추가합니다:

```xml
<key>NSSupportsLiveActivities</key>
<true/>
```

## 5. Flutter 앱에서 라이브 액티비티 연동

Flutter 측 코드에서 라이브 액티비티를 제어하는 서비스를 구현합니다:

```dart
import 'dart:io';
import 'package:live_activities/live_activities.dart';
import 'package:flutter/services.dart';

class LiveActivityService {
  final LiveActivities _liveActivities = LiveActivities();

  // 활동 ID를 저장할 변수
  String? _activityId;

  // 라이브 액티비티 시작
  Future<bool> startDeliveryActivity({
    required String orderNumber,
    required String restaurantName,
    required String status,
    required DateTime estimatedDeliveryTime,
    required String driverName,
    required String driverLocation,
    required double progressPercentage,
  }) async {
    if (!Platform.isIOS) return false;

    try {
      final Map<String, dynamic> attributes = {
        'orderNumber': orderNumber,
        'restaurantName': restaurantName,
      };

      final Map<String, dynamic> contentState = {
        'status': status,
        'estimatedDeliveryTime': estimatedDeliveryTime.toIso8601String(),
        'driverName': driverName,
        'driverLocation': driverLocation,
        'progressPercentage': progressPercentage,
      };

      final activityId = await _liveActivities.createActivity(
        'DeliveryAttributes',  // ActivityAttributes 클래스 이름과 일치해야 함
        attributes,
        contentState,
      );

      if (activityId != null) {
        _activityId = activityId;
        return true;
      }

      return false;
    } on PlatformException catch (e) {
      print('라이브 액티비티 시작 오류: ${e.message}');
      return false;
    }
  }

  // 라이브 액티비티 업데이트
  Future<bool> updateDeliveryActivity({
    required String status,
    required DateTime estimatedDeliveryTime,
    required String driverName,
    required String driverLocation,
    required double progressPercentage,
  }) async {
    if (!Platform.isIOS || _activityId == null) return false;

    try {
      final Map<String, dynamic> contentState = {
        'status': status,
        'estimatedDeliveryTime': estimatedDeliveryTime.toIso8601String(),
        'driverName': driverName,
        'driverLocation': driverLocation,
        'progressPercentage': progressPercentage,
      };

      await _liveActivities.updateActivity(
        _activityId!,
        contentState,
      );

      return true;
    } on PlatformException catch (e) {
      print('라이브 액티비티 업데이트 오류: ${e.message}');
      return false;
    }
  }

  // 라이브 액티비티 종료
  Future<bool> endDeliveryActivity({
    String? finalStatus,
  }) async {
    if (!Platform.isIOS || _activityId == null) return false;

    try {
      final Map<String, dynamic>? contentState = finalStatus != null
          ? {
              'status': finalStatus,
              'progressPercentage': 100.0,
            }
          : null;

      await _liveActivities.endActivity(
        _activityId!,
        contentState,
      );

      _activityId = null;
      return true;
    } on PlatformException catch (e) {
      print('라이브 액티비티 종료 오류: ${e.message}');
      return false;
    }
  }

  // 모든 라이브 액티비티 종료
  Future<bool> endAllActivities() async {
    if (!Platform.isIOS) return false;

    try {
      await _liveActivities.endAllActivities();
      _activityId = null;
      return true;
    } on PlatformException catch (e) {
      print('모든 라이브 액티비티 종료 오류: ${e.message}');
      return false;
    }
  }

  // 액티비티 상태 확인
  Future<bool> isLiveActivityAvailable() async {
    if (!Platform.isIOS) return false;

    try {
      return await _liveActivities.isLiveActivityAvailable() ?? false;
    } on PlatformException catch (e) {
      print('라이브 액티비티 상태 확인 오류: ${e.message}');
      return false;
    }
  }
}
```

## 6. 라이브 액티비티 사용 예시

다음은 Flutter 앱에서 라이브 액티비티를 시작, 업데이트 및 종료하는 방법의 예시입니다:

```dart
class DeliveryViewModel extends StateNotifier<DeliveryState> {
  final LiveActivityService _liveActivityService = LiveActivityService();

  DeliveryViewModel() : super(DeliveryState.initial());

  // 배달 시작
  Future<void> startDelivery() async {
    // 배달 정보 초기화
    state = DeliveryState(
      orderNumber: 'ORD-12345',
      restaurantName: '맛있는 식당',
      status: '배달 준비 중',
      estimatedDeliveryTime: DateTime.now().add(const Duration(minutes: 30)),
      driverName: '홍길동',
      driverLocation: '식당에서 음식 픽업 중',
      progressPercentage: 10.0,
    );

    // 라이브 액티비티 시작
    if (Platform.isIOS) {
      final isAvailable = await _liveActivityService.isLiveActivityAvailable();

      if (isAvailable) {
        await _liveActivityService.startDeliveryActivity(
          orderNumber: state.orderNumber,
          restaurantName: state.restaurantName,
          status: state.status,
          estimatedDeliveryTime: state.estimatedDeliveryTime,
          driverName: state.driverName,
          driverLocation: state.driverLocation,
          progressPercentage: state.progressPercentage,
        );
      }
    }
  }

  // 배달 상태 업데이트
  Future<void> updateDeliveryStatus({
    required String status,
    required String driverLocation,
    required double progressPercentage,
  }) async {
    // 상태 업데이트
    state = state.copyWith(
      status: status,
      driverLocation: driverLocation,
      progressPercentage: progressPercentage,
    );

    // 라이브 액티비티 업데이트
    if (Platform.isIOS) {
      await _liveActivityService.updateDeliveryActivity(
        status: state.status,
        estimatedDeliveryTime: state.estimatedDeliveryTime,
        driverName: state.driverName,
        driverLocation: state.driverLocation,
        progressPercentage: state.progressPercentage,
      );
    }
  }

  // 배달 완료
  Future<void> completeDelivery() async {
    // 상태 업데이트
    state = state.copyWith(
      status: '배달 완료',
      progressPercentage: 100.0,
    );

    // 라이브 액티비티 종료
    if (Platform.isIOS) {
      await _liveActivityService.endDeliveryActivity(
        finalStatus: '배달 완료',
      );
    }
  }

  // 배달 취소
  Future<void> cancelDelivery() async {
    // 상태 업데이트
    state = state.copyWith(
      status: '배달 취소됨',
    );

    // 라이브 액티비티 종료
    if (Platform.isIOS) {
      await _liveActivityService.endDeliveryActivity(
        finalStatus: '배달 취소됨',
      );
    }
  }
}
```

## 7. 원격 업데이트 설정

푸시 알림을 통해 라이브 액티비티를 원격으로 업데이트하려면 추가 설정이 필요합니다:

### 7.1. APNs (Apple Push Notification Service) 설정

1. Apple Developer 계정에서 Push Notifications 활성화
2. 앱 ID에 Push Notifications 기능 추가
3. 푸시 알림 인증서 생성 및 다운로드

### 7.2. ActivityKit 푸시 페이로드 구조

라이브 액티비티를 업데이트하기 위한 푸시 알림은 특별한 형식을 따릅니다:

```json
{
  "aps": {
    "timestamp": 1728349874,
    "event": "update",
    "content-state": {
      "status": "배달 중",
      "estimatedDeliveryTime": "2023-08-15T12:45:00Z",
      "driverName": "홍길동",
      "driverLocation": "목적지로 이동 중",
      "progressPercentage": 65.0
    },
    "alert": {
      "title": "배달 상태 업데이트",
      "body": "음식이 곧 도착할 예정입니다."
    }
  }
}
```

푸시 알림을 처리하기 위해 AppDelegate를 수정합니다:

```swift
// AppDelegate.swift

import UIKit
import Flutter
import ActivityKit

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // 푸시 알림 권한 요청
    UNUserNotificationCenter.current().delegate = self
    application.registerForRemoteNotifications()

    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // 푸시 토큰 수신
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("디바이스 토큰: \(token)")

    // 토큰을 서버로 전송하는 로직 추가

    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }

  // 푸시 등록 실패
  override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("푸시 알림 등록 실패: \(error)")
    super.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
  }
}

// 푸시 알림 수신 처리
extension AppDelegate {
  override func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    let userInfo = response.notification.request.content.userInfo
    print("푸시 알림 수신: \(userInfo)")
    completionHandler()
  }

  override func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    let userInfo = notification.request.content.userInfo
    print("앱 활성화 상태에서 푸시 알림 수신: \(userInfo)")
    completionHandler([.banner, .sound])
  }
}
```

## 8. 애니메이션 및 디자인 커스터마이징

라이브 액티비티의 시각적 효과를 향상시키기 위해 애니메이션과 커스텀 디자인을 추가할 수 있습니다:

```swift
struct AnimatedProgressView: View {
    var progress: Double
    @State private var animateProgress: Double = 0

    var body: some View {
        ZStack {
            Circle()
                .stroke(lineWidth: 6)
                .opacity(0.3)
                .foregroundColor(.blue)

            Circle()
                .trim(from: 0.0, to: CGFloat(min(animateProgress, 1.0)))
                .stroke(style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round))
                .foregroundColor(.blue)
                .rotationEffect(Angle(degrees: 270.0))
                .animation(.linear(duration: 1.0), value: animateProgress)

            Text("\(Int(animateProgress * 100))%")
                .font(.caption)
                .fontWeight(.bold)
        }
        .frame(width: 50, height: 50)
        .onAppear {
            animateProgress = progress / 100
        }
        .onChange(of: progress) { newValue in
            animateProgress = newValue / 100
        }
    }
}
```

## 9. 제한사항 및 고려사항

라이브 액티비티 구현 시 고려해야 할 사항:

1. **업데이트 빈도 제한**

   - iOS는 라이브 액티비티 업데이트 빈도를 제한합니다(일반적으로 15분에 최대 4회).
   - 너무 자주 업데이트하면 시스템에서 무시될 수 있습니다.

2. **배터리 및 성능 영향**

   - 라이브 액티비티는 백그라운드에서도 리소스를 사용하므로 배터리 소모에 영향을 줍니다.
   - 필요한 정보만 효율적으로 표시하도록 설계해야 합니다.

3. **활동 지속 시간**

   - 라이브 액티비티는 최대 8시간까지 활성화됩니다.
   - 8시간이 지나면 시스템에서 자동으로 종료됩니다.

4. **테스트 제한**
   - 시뮬레이터에서는 동적 섬 테스트가 제한적입니다.
   - 완전한 테스트를 위해 실제 기기를 사용하는 것이 좋습니다.

## 10. 문제 해결

### 라이브 액티비티가 표시되지 않는 경우

1. iOS 버전이 16.1 이상인지 확인
2. Info.plist에 NSSupportsLiveActivities 키가 true로 설정되어 있는지 확인
3. 동적 섬은 iPhone 14 Pro 이상 모델만 지원되는지 확인
4. 사용자가 설정에서 라이브 액티비티를 비활성화했는지 확인

### 업데이트가 반영되지 않는 경우

1. 업데이트 빈도가 제한을 초과하지 않았는지 확인
2. 활동 ID가 올바르게 저장 및 사용되고 있는지 확인
3. 콘솔 로그에서 오류 메시지 확인

### 푸시 업데이트가 동작하지 않는 경우

1. 앱이 푸시 알림 권한을 가지고 있는지 확인
2. APNs 인증서가 올바르게 설정되었는지 확인
3. 푸시 페이로드 형식이 ActivityKit 요구사항을 준수하는지 확인

## 결론

iOS 라이브 액티비티는 Flutter 앱에 실시간 업데이트 기능을 추가하여 사용자 경험을 향상시키는 강력한 기능입니다. 네이티브 코드 작성이 필요하지만, 적절한 플러그인과 Swift 코드를 통해 Flutter 앱에서도 효과적으로 구현할 수 있습니다.

라이브 액티비티는 사용자에게 앱을 열지 않고도 중요한 정보를 제공할 수 있으므로, 배달 앱, 스포츠 앱, 피트니스 앱 등 실시간 정보가 중요한 애플리케이션에 특히 유용합니다.
