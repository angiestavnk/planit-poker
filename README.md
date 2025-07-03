# Planit Poker – React + TypeScript + Vite

A simple **planning poker app** that uses **WebSockets** to simulate real-time collaborative estimation.

---

## Demo

[Click to watch the demo video](https://github.com/angiestavnk/planit-poker/raw/master/02.07.2025_23.24.17_REC.mp4)

---

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

Check your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

Install required development tools:

```bash
npm install --save-dev tsx
```

---

### 2. Run the app

#### Start the WebSocket server:

```bash
npx tsx server/server.ts
```

You should see:

```
WebSocket server running on ws://localhost:3000
```

#### Start the client:

```bash
npm run dev
```

Then open your browser at:  
[http://localhost:5173](http://localhost:5173)

---

### 3. How to Use the App

1. **Open two browser windows or tabs** — this simulates two different users.
2. In **each window**:
   - Enter a **name** in the input field.
   - Click the **"Enter the room"** button.
3. You will see:
   - A shared list of estimation cards
   - The active ticket being estimated
4. Each user can:
   - Click a card to **send a vote**
   - See everyone's estimates once all users have voted
   - Click **"Reset round"** to start a new estimate for evryone
