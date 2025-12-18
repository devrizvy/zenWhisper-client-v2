# 🌊 zenWhisper

<div align="center">

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███████╗███████╗███╗   ██╗██╗    ██╗██╗  ██╗██╗███████╗██████╗ ███████╗██████╗ ║
║   ╚══███╔╝██╔════╝████╗  ██║██║    ██║██║  ██║██║██╔════╝██╔══██╗██╔════╝██╔══██╗║
║     ███╔╝ █████╗  ██╔██╗ ██║██║ █╗ ██║███████║██║███████╗██████╔╝█████╗  ██████╔╝║
║    ███╔╝  ██╔══╝  ██║╚██╗██║██║███╗██║██╔══██║██║╚════██║██╔═══╝ ██╔══╝  ██╔══██╗║
║   ███████╗███████╗██║ ╚████║╚███╔███╔╝██║  ██║██║███████║██║     ███████╗██║  ██║║
║   ╚══════╝╚══════╝╚═╝  ╚═══╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝║
║                                                           ║
║              🎓 Collaborative Study Platform              ║
║           "In the stillness of mind, wisdom whispers"    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Live Demo](https://zenwhisper.com) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/yourusername/zenwhisper/issues) • [✨ Request Feature](https://github.com/yourusername/zenwhisper/issues)

</div>

---

## 🌟 About The Project

**zenWhisper** is a modern, real-time collaborative study platform designed specifically for students who want to learn together. Built with a calming "zen" aesthetic, it provides a distraction-free environment where students can connect, share knowledge, and enhance their learning experience.

### 🎯 Purpose

In today's digital learning landscape, students need more than just chat apps—they need **focused study environments**. zenWhisper bridges the gap by offering:

- 💬 **Real-time Messaging** - Connect instantly with study partners
- 🏫 **Virtual Classrooms** - Create dedicated group study spaces
- 📝 **Smart Notes** - Take and organize notes collaboratively
- 🤖 **AI Summaries** - Transform lengthy PDFs into concise study materials
- 🎓 **Collaborative Learning** - Study together, succeed together

---

## ✨ Features

### 🔥 Core Features

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  📱 Private Chats        │  🏫 Virtual Classrooms          │
│  ─────────────────────  │  ────────────────────────        │
│  • One-on-one messaging  │  • Group study rooms            │
│  • Typing indicators     │  • Real-time collaboration      │
│  • Online status         │  • Member management            │
│  • Message history       │  • Room-wide announcements      │
│                          │                                  │
│  📝 Smart Notes          │  🤖 AI Summaries                │
│  ─────────────────────  │  ────────────────────────        │
│  • Rich text editor      │  • PDF summarization            │
│  • Auto-save             │  • Note condensation            │
│  • Share with groups     │  • Key points extraction        │
│  • Organized folders     │  • Study guide generation       │
│                          │                                  │
└─────────────────────────────────────────────────────────────┘
```

### 🎨 User Experience

- **Zen Aesthetic**: Calming teal/green color palette designed for focus
- **Glass Morphism**: Modern, elegant UI with smooth animations
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Dark Mode**: Easy on the eyes during late-night study sessions
- **Keyboard Shortcuts**: Navigate efficiently without breaking flow

### 🔐 Security & Privacy

- End-to-end encrypted messaging
- JWT-based authentication
- Secure password hashing
- Privacy-first approach
- GDPR compliant

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/yourusername/zenwhisper.git
cd zenwhisper
```

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

4️⃣ **Start the development server**

```bash
npm run dev
```

5️⃣ **Open your browser**

Navigate to `http://localhost:5173` and start exploring! 🎉

---

## 🛠️ Tech Stack

### Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🎨 UI/UX                                                   │
│  ├─ React 19.2.0         - UI Framework                    │
│  ├─ TypeScript 5.9.3     - Type Safety                     │
│  ├─ Tailwind CSS 4.1.17  - Styling                         │
│  ├─ shadcn/ui            - Component Library               │
│  └─ Lucide React         - Icon System                     │
│                                                             │
│  🔄 State Management                                        │
│  ├─ TanStack Query       - Server State                    │
│  ├─ Context API          - Global State                    │
│  └─ React Router 7       - Navigation                      │
│                                                             │
│  🌐 Communication                                           │
│  ├─ Socket.IO Client     - Real-time Events                │
│  ├─ Axios                - HTTP Requests                   │
│  └─ React Hot Toast      - Notifications                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Backend (Separate Repository)

- **Node.js + Express** - Server framework
- **Socket.IO** - WebSocket server
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## 📂 Project Structure

```
zenwhisper/
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 ui/                    # Reusable UI components
│   │   └── app-sidebar.tsx           # Navigation sidebar
│   │
│   ├── 📁 pages/
│   │   ├── 📁 Chats/                 # Private messaging
│   │   │   ├── ChatList.tsx
│   │   │   ├── ChatFeed.tsx
│   │   │   └── UsersList.tsx
│   │   ├── 📁 Group/                 # Virtual classrooms
│   │   │   ├── Room.tsx
│   │   │   └── RoomChat.tsx
│   │   ├── 📁 Notes/                 # Note-taking system
│   │   ├── 📁 AISummary/             # AI summarization
│   │   ├── 📁 Settings/              # User preferences
│   │   └── ...
│   │
│   ├── 📁 contexts/
│   │   └── AuthContext.tsx           # Authentication state
│   │
│   ├── 📁 hooks/
│   │   ├── usePrivateMessages.tsx    # Private chat logic
│   │   ├── useRoomMessages.tsx       # Room chat logic
│   │   ├── useSocketChat.ts          # WebSocket management
│   │   └── useUsers.tsx              # User data fetching
│   │
│   ├── 📁 services/
│   │   ├── axios.ts                  # HTTP client
│   │   ├── apiService.ts             # REST API methods
│   │   └── socketService.ts          # WebSocket service
│   │
│   ├── 📁 Layout/
│   │   └── MainLayout.tsx            # App shell
│   │
│   └── 📄 index.css                  # Global styles + Zen theme
│
├── 📄 .env                            # Environment variables
├── 📄 package.json                    # Dependencies
├── 📄 vite.config.ts                  # Vite configuration
├── 📄 tailwind.config.js              # Tailwind configuration
└── 📄 README.md                       # You are here!
```

---

## 💡 Usage Examples

### 1️⃣ Starting a Private Chat

```typescript
// Navigate to the chat page
navigate('/chat/users');

// Select a user to start chatting
handleUserSelect(selectedUser);

// Send a message
sendPrivateMessage({
  chatId: chatId,
  receiverEmail: partnerEmail,
  receiverUsername: partnerUsername,
  message: "Hey! Want to study together?"
});
```

### 2️⃣ Creating a Virtual Classroom

```typescript
// Create a new classroom
const roomId = generateRoomId(); // Auto-generated 8-digit ID
createNewRoom({
  roomId: roomId,
  roomName: "Biology Exam Prep"
});

// Join the classroom
joinRoom(roomId, username);

// Send a message to the room
sendRoomMessage({
  roomId: roomId,
  room: "Biology Exam Prep",
  message: "Let's review Chapter 5!"
});
```

### 3️⃣ Using AI Summary (Coming Soon)

```typescript
// Upload a PDF
uploadPDF(file);

// Get AI summary
const summary = await generateSummary(pdfId);

// Save to notes
saveToNotes(summary);
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors - Zen Theme */
--primary: oklch(0.65 0.12 155);           /* Calming Teal */
--primary-foreground: oklch(0.98 0.02 155); /* Light Text */

--accent: oklch(0.55 0.08 145);            /* Accent Green */
--accent-foreground: oklch(0.98 0.02 145);

/* Background Colors */
--background: oklch(0.098 0.006 240);      /* Deep Dark Blue */
--foreground: oklch(0.95 0.01 240);        /* Light Text */

--card: oklch(0.13 0.008 230);             /* Card Background */
--popover: oklch(0.13 0.008 230);          /* Popover Background */

/* Sidebar Colors */
--sidebar: oklch(0.11 0.007 225);          /* Sidebar Background */
--sidebar-foreground: oklch(0.85 0.01 225); /* Sidebar Text */
```

### Typography

**Font Family**: JetBrains Mono Variable

```css
font-family: 'JetBrains Mono Variable', monospace;
```

### Animations

```css
/* Zen Wave Animation */
@keyframes zen-wave {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(0.5deg); }
  75% { transform: translateY(2px) rotate(-0.5deg); }
}

/* Zen Pulse Animation */
@keyframes zen-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Message Fade In */
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Private messaging
- [x] Virtual classrooms
- [x] Real-time chat
- [x] Typing indicators
- [x] Online status

### Phase 2: Enhanced Features 🚧
- [ ] Rich text notes editor
- [ ] AI PDF summarization
- [ ] File sharing in chats
- [ ] Video/voice calls
- [ ] Screen sharing
- [ ] Calendar integration

### Phase 3: Advanced Features 📋
- [ ] Study schedules & reminders
- [ ] Pomodoro timer integration
- [ ] Flashcard creation
- [ ] Quiz generation from notes
- [ ] Study analytics dashboard
- [ ] Mobile app (React Native)

### Phase 4: Community Features 🌐
- [ ] Public study groups
- [ ] Study partner matching
- [ ] Resource marketplace
- [ ] Tutor connections
- [ ] Achievement system
- [ ] Leaderboards

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use **TypeScript** for type safety
- Follow **React best practices**
- Write **meaningful commit messages**
- Add **comments** for complex logic
- Keep components **small and focused**
- Use **semantic HTML**
- Follow the **zen aesthetic** design principles

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Developer

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

Special thanks to:

- [React](https://reactjs.org/) - Amazing UI library
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Socket.IO](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Icon system
- [Vite](https://vitejs.dev/) - Lightning-fast build tool

---

## 💖 Support

If you found this project helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 📢 **Sharing** with fellow students
- ☕ **Buying me a coffee** (if you're feeling generous!)

---

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Made with ❤️ and lots of ☕                     │
│                                                             │
│         "In the stillness of mind, wisdom whispers"         │
│                                                             │
│                    🌊 zenWhisper © 2024                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

⭐ **Star us on GitHub** — it motivates us to keep improving!

[⬆ Back to Top](#-zenwhisper)

</div>