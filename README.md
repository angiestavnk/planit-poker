# Planit Poker – React + TypeScript + Vite

Simple planit poker app that uses WebSockets.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node)

You can check your installed versions with:

```bash
node -v
npm -v

1. **Install dependencies:**

```bash
npm install

Install required global tools (if not already available):

```bash
npm install tsx --save-dev (to run server)

2. **Run application:**

- Run server

```bash
npx tsx server/server.ts

In terminal you should see the message `WebSocket server running on ws://localhost:3000`

- Run client

```bash
npm run dev

Open http://localhost:5173 in your browser.

3.  **How to Use the App**

 - Open two browser windows (or tabs) side by side** — this simulates two different users this simulates two different users.
  In **each window**:
 - Enter a **unique name** in the input field.
 - Click the **"Enter the room"** button.
 - Each participant sees the same list of possible votes and ticket that is being estimated.
 - Click on a card to **cast your vote**.
 - Once everyone in the room has voted, the estimates are revealed automatically.
 - User can then reset the round and vote again on a new ticket.
