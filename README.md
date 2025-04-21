# 💬 Smart Chat

Smart Chat is a modern and engaging messaging app built with React Native. It supports real-time messaging, profile customization, audio calling using Agora, multi-language support, and built-in games — all wrapped in a smooth and elegant UI.

---

> [!Note]
> This app is built for mobile chat experiences that are quick, fun, and expandable. It supports future upgrades such as video calling and monetizable games.

> [!Tip]
> You can use the demo link to install the app quickly on any mobile device. Or clone and run it locally using Expo.

---

## 📱 Installation & Quick Start

Install via Expo:

🔗 [**Smart Chat - Expo Build Link**](https://expo.dev/accounts/mobiledev-smart-app/projects/Mobile-App-Client/builds/449c9840-b37c-467e-b219-d29b0626c4c5)

Or scan the QR code:

![Install QR](./assets/qr-install.png)

Clone and run locally:

```bash
git clone https://github.com/Group15-Mobile-Development-ReactNative/Mobile-App-Client.git
cd Mobile-App-Client
npm install
npx expo start
```

---

## 📞 Call Setup (Agora)

To set up the calling feature, open the following file:

```
/constants/agoraConfig.ts
```

Replace the values accordingly:

```ts
export const AGORA_APP_ID = "e959d7e7cdb6477a88315c48d2fe1fd1";
export const AGORA_TEMP_TOKEN = "007eJxTYJjL7S+7V99zV3Ypi0DDqbCEF6r6MasDD3dpOK2eIqTqOEuBIdXS1DLFPNU8OSXJzMTcPNHCwtjQNNnEIsUoLdUwLcXQr/RzekMgI4NQ8WoWRgYIBPG5GZwzEkscCwqcE3NyGBgALbEe/w==";
export const CHANNEL_NAME = "ChatAppCall";
```

➡️ Visit [Agora Console](https://sso2.agora.io/) → Create Project → Enable Primary Certificate → Generate Temporary Token → Use in `agoraConfig.ts`

---

## 👨🏻‍🏫 Introduction

**Smart Chat** is built to offer a clean, WhatsApp-like chat experience with extra features including built-in mini games, dark mode, and user analytics. The interface includes:

- Smooth navigation using bottom tabs
- Real-time chatting and message tracking
- Profile editing and account deletion
- Secure authentication and data management with Firebase

---

## 🧪 Features

- 🔐 Email & Google Sign-in
- 💬 Text + Image Messaging
- 📞 Agora-based Audio Calling
- ✏️ Profile Edit and Status Updates
- 🚮 Message & Chat Deletion
- 🌗 Dark Mode Support
- 🌍 Language Selection (English, Suomi)
- 📊 Chat Statistics with Pie Chart
- 🎮 Mini Games to kill wait time
- ⚙️ Settings + Static Info Pages

---

## 🖼️ App UI Preview

> [!Note]
> For full functionality breakdowns of each page, refer to future prompts. Below are screen previews.

### Login & Register
| Login | Register |
|-------|----------|
| ![Login](./screenshots/login.png) | ![Register](./screenshots/register.png) |

### Chat Interface
| Chat List | Message View |
|-----------|---------------|
| ![Chats](./screenshots/chats.png) | ![Messages](./screenshots/chat.png) |

### Profile Management
| Profile Page | Edit Modal |
|--------------|------------|
| ![Profile](./screenshots/profile.png) | ![Edit](./screenshots/edit-profile.png) |

### Additional Pages
| Stats | Games | Settings |
|-------|-------|----------|
| ![Stats](./screenshots/stats.png) | ![Games](./screenshots/games.png) | ![Settings](./screenshots/settings.png) |

---

## 📚 Pages Overview (In Progress)

> ⚠️ Detailed explanations of each page (Login, Register, Chats, Search, Profile, More, Settings, etc.) will be added in separate prompts.

---

## 🧩 Technologies Used

- React Native + Expo
- Firebase (Firestore, Auth, Storage)
- Agora SDK (Audio Calls)
- React Navigation
- Recharts (for Stats)
- NativeWind + Tailwind CSS

---

## 📂 Folder Structure (Partial)

```bash
Mobile-App-Client/
├── app/
│   ├── (tabs)/
│   ├── components/
│   ├── screens/
├── assets/
├── constants/
└── utils/
```

---

## 🛠️ Contribution

Feel free to fork, suggest improvements, or create pull requests.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push and submit a PR

---

## 📜 License

This project is licensed under the MIT License.

---

## 👥 Author

Built by **Group 15**:

- Ryan Wickramaratne
- Shane Dinod
