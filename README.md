# Ubix Driver App
Ubix Driver App is a mobile application that allows real-time tracking of driver locations and manages order deliveries. The app enhances communication with drivers and efficiently handles the delivery of orders to customers.

## Features
- **Interactive Map**: Real-time visualization of driver locations.
- **Real-time Updates**: Driver positions are updated automatically.
- **Order Management**: Receive notifications about new orders and manage the delivery of those orders to customers.
- **Intuitive User Interface**: Easy-to-use design for managing drivers and orders.

## Technologies Used
### Core
- [React Native](https://www.npmjs.com/package/react-native) `v0.62`  
- [React](https://www.npmjs.com/package/react) `v16.11`  
- [React Navigation](https://www.npmjs.com/package/@react-navigation/native) `v5` (Stack y Bottom Tabs)
- [React Native Keyboard Aware Scroll View](https://www.npmjs.com/package/react-native-keyboard-aware-scroll-view) `v0.9`  

### UI / Styling
- [React Native Paper](https://www.npmjs.com/package/react-native-paper) `v4.9`  
- [React Native Vector Icons](https://www.npmjs.com/package/react-native-vector-icons) `v6.6`  
- [React Native Easy Toast](https://www.npmjs.com/package/react-native-easy-toast) `v1.2`  
- [React Native Checkbox](https://www.npmjs.com/package/@react-native-community/checkbox) `v0.4`  

### State Management
- Context API

### Maps & Geolocation
- [React Native Maps](https://www.npmjs.com/package/react-native-maps) `v0.27`  
- [React Native Maps Directions](https://www.npmjs.com/package/react-native-maps-directions) `v1.8`  
- [React Native Geolocation Service](https://www.npmjs.com/package/react-native-geolocation-service) `v5.0`  
- [React Native Geocoding](https://www.npmjs.com/package/react-native-geocoding) `v0.4`  

### Push Notifications
- [OneSignal React Native](https://www.npmjs.com/package/react-native-onesignal) `v4.1`  
- [React Native Push Notification](https://www.npmjs.com/package/react-native-push-notification) `v7.4`  

### Utilities
- [React Native Config](https://www.npmjs.com/package/react-native-config) `v1.5`  
- [React Native Permissions](https://www.npmjs.com/package/react-native-permissions) `v2.1`  

### Backend as a Service
- [React Native Firebase](https://www.npmjs.com/package/@react-native-firebase/app) `v12.3`  
  - Módulos usados: Auth, Firestore, Storage, Cloud Messaging, Cloud Functions  
- [Geofirestore](https://www.npmjs.com/package/geofirestore) `v4.1`  

## Setup
1. Install the dependencies:

   ```bash
   npm install
   ```
2. Set up Firebase:

  * Create a project in Firebase and obtain the credentials.
  * Create a .env file in the root of the project and add your Firebase credentials.

## Run
To start the application in development mode, run:

   ```bash
   npx react-native run-ios
   ```
   ```bash
   npx react-native run-android
   ```

## Contributions
Contributions are welcome. If you wish to improve the project, please fork it and submit a pull request.

## Contact
For questions or suggestions, you can contact me at [ezioeg@gmail.com].
