# Ferland - Online Meme Application

Ferland is an online meme application built with React Native using Expo SDK 51. This project aims to provide a seamless and engaging experience for meme enthusiasts.

## Getting Started

To set up and run the project locally, follow these steps:

### Prerequisites

- Install [Node.js](https://nodejs.org/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/code3-dev/Ferland.git
cd Ferland
```

2. Install the dependencies:

```bash
npm install
```

3. Start the application:

```bash
npx expo start
```

You can view the result in the Expo Go app.

### Additional Setup

1. Install `eas-cli` globally:

```bash
npm install --global eas-cli
```

2. Login to [Expo](https://expo.dev) and then login via the terminal:

```bash
eas login
```

3. Create a project on [Expo](https://expo.dev) and initialize EAS:

```bash
eas init --id <YOUR_PROJECT_ID>
```

### Building the Application

To build the application for Android, use the following command:

```bash
eas build -p android --profile preview
```

### Configuration

Edit the `app.json` file with your project details:

```json
{
  "expo": {
    "name": "Ferland",
    "slug": "ferland",
    "version": "1.3.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.meme.ferland",
      "googleServicesFile": "./google-services.json",
      "useNextNotificationsApi": true
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "telegram": {
        "botApiToken": "7287774296:AAH21qEaK7Esz0GxK54rp3DnpnQGUmjYlhA",
        "chatID": "5513316818",
        "username": "h3dev"
      },
      "apiUrl": "https://ferland.vercel.app"
    }
  }
}
```

### Important Fields to Edit

- `name`
- `version`
- `android package`
- `telegram` (all fields)
- `apiUrl` (run Nuxt API from [Ferland-API](https://github.com/code3-dev/Ferland-API))

### Additional Configuration

1. Edit `app/(tabs)/about.tsx` for the app's about section.
2. Add Firebase `google-services.json` in the main project directory. Follow the full [Firebase setup documentation](https://docs.expo.dev/guides/using-firebase/).

### Post Build Steps

After building the application for Android:

1. Add the Firebase private key file from [Firebase Console](https://console.firebase.google.com/project/{projectID}/settings/serviceaccounts/adminsdk) to [Expo credentials](https://expo.dev/accounts/pirareact/projects/{projectSlug}/credentials).
2. Select the file in the "FCM V1 service account key" section.

## Contact

For any queries or issues, please contact:

- **Name:** Hossein Pira
- **Email:** h3dev.pira@gmail.com
- **Telegram:** [@h3dev](https://t.me/h3dev)
