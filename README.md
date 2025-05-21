# Ubix Driver App

Ubix Driver App is a mobile application that allows real-time tracking of driver locations and manages order deliveries. The app enhances communication with drivers and efficiently handles the delivery of orders to customers.

## Features

- **Interactive Map**: Real-time visualization of driver locations.
- **Real-time Updates**: Driver positions are updated automatically.
- **Order Management**: Receive notifications about new orders and manage the delivery of those orders to customers.
- **Intuitive User Interface**: Easy-to-use design for managing drivers and orders.

## Technologies Used

### Core
- React Native v0.62
- React v16.11
- React Navigation v5 (Stack y Bottom Tabs)
- React Native Paper v4.9
- React Native Vector Icons v6.6
- Gesture Handler v1.6
- Reanimated v1.9
- Safe Area Context v2.0
- Screens v2.8
- Keyboard Aware Scroll View v0.9
- Easy Toast v1.2
- Checkbox v0.4

### Backend-as-a-Service
- React Native Firebase v12.3 (Auth, Firestore, Storage, Cloud Messaging, Cloud Functions)
- Geofirestore v4.1

### Maps and Geolocation
- React Native Maps v0.27
- Maps Directions v1.8
- Geolocation Service v5.0
- Geocoding v0.4

### Push Notifications
- OneSignal v4.1
- React Native Push Notification v7.4

### Utils
- React Native Config v1.5
- React Native Permissions v2.1

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/tu-usuario/ubix-driver-app.git

2. Navigate to the project directory:

   ```bash
   cd ubix-driver-app

3. Install the dependencies:

   ```bash
   npm install

4. Set up Firebase:

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
