// 🧍 USERS COLLECTION
const users = {
    "user_001": {
      displayName: "Alice Smith",
      email: "alice@example.com",
      status: "Available",
      profileImageUrl: "https://example.com/alice.jpg",
      createdAt: new Date("2024-11-01T10:00:00"),
      lastSeen: new Date("2025-03-24T08:30:00"),
    },
    "user_002": {
      displayName: "Bob Johnson",
      email: "bob@example.com",
      status: "Busy",
      profileImageUrl: "https://example.com/bob.jpg",
      createdAt: new Date("2024-11-05T15:20:00"),
      lastSeen: new Date("2025-03-24T09:10:00"),
    },
  };

  

  // 💬 CHATS COLLECTION
  const chats = {
    "chat_001": {
      userA: "user_001",
      userB: "user_002",
      lastMessage: "See you later!",
      lastMessageTime: new Date("2025-03-24T09:05:00"),
      unreadA: 0,
      unreadB: 2,
      createdAt: new Date("2024-12-01T12:00:00"),
    },
  };
  

  // 📨 MESSAGES COLLECTION (FLAT)
const messages = {
    "msg_001": {
      chatId: "chat_001",
      senderId: "user_001",
      text: "Hey Bob!",
      imageUrl: null,
      fileUrl: null,
      type: "text",
      sentAt: new Date("2025-03-24T09:00:00"),
    },
    "msg_002": {
      chatId: "chat_001",
      senderId: "user_002",
      text: "Hi Alice! How are you?",
      imageUrl: null,
      fileUrl: null,
      type: "text",
      sentAt: new Date("2025-03-24T09:01:00"),
    },
    "msg_003": {
      chatId: "chat_001",
      senderId: "user_001",
      text: "See you later!",
      imageUrl: null,
      fileUrl: null,
      type: "text",
      sentAt: new Date("2025-03-24T09:05:00"),
    },
  };
  

  export default {
    users,
    chats,
    messages,
  };