
# Social Media App

React Native Group Messaging App A React Native application that allows users to create an account, login to their account, create groups, join groups, view group members and send real-time messages in the joined groups.


## Installation and Prerequisites

Getting Started, 
Prerequisites:
 1. Node.js npm or yarn 
 2. React Native CLI 
 
## Clone

To clone this project run

```bash
  git clone origin https://github.com/Spawar1530/social-media-app.git
```


## Installation

Install social-media-app with npm

```bash
npm install or yarn install
```
    
## Run Locally

Start the metro server

```bash
  npm start or yarn start
```

Run the app on Android

```bash
  npx react-native run-android
```



## Generate APK

```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
````

then:
```bash
cd android
````

then:
```bash
./gradlew assembleDebug
````

There! you’ll find the apk file in the following path:
```bash
social-media-app/android/app/build/outputs/apk/debug/app-debug.apk
````
## Features

- Create a new account or login to your existing account
- Create a new group or join an existing group
- View group members and send real-time messages in the joined groups
-  Built With React Native Firebase Realtime Database and Firebase Authentication




## Demo

Link to demo
https://drive.google.com/file/d/12K5uA3F3MYK0qs2id4HCJDzCieA7yBku/view?usp=sharing