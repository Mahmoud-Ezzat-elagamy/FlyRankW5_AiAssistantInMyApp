# 🎴 FlyRank — AI-Powered Interactive Card Board

An interactive, modern card board application powered by **Next.js 16**, **React 19**, **Tailwind CSS v4**, and the **Vercel AI SDK** with **Google Gemini**. 

Users can manage cards manually or converse naturally with an embedded AI assistant to create and delete cards in real time using function/tool calling.

---

## ✨ Features & Functionalities

### 1. 🤖 Context-Aware AI Chat Sidebar
- **Slide-over Drawer**: Smooth slide-over sidebar with backdrop blur and responsive design.
- **Floating AI Trigger**: Accessible floating toggle pill in the top-right corner with a pulsing live status indicator.
- **Streaming Responses**: Real-time message streaming powered by `@ai-sdk/react`.

### 2. ➕ Natural Language Card Creation (`addCard` Tool)
- Tell the AI: *"Create a card about Docker fundamentals"*.
- The model invokes the `addCard` tool with a structured title, description, and relevant `#tags`.
- Cards are prepended to the board with smooth layout animations.

### 3. 🗑️ Smart Card Deletion (`removeCard` Tool)
- **Delete by Title / Keyword**: *"Delete the Docker card"* or *"Remove the card about React hooks"*.
- **Delete by ID**: *"Remove card 7f3b89..."*.
- **Live Board Context**: The client sends a snapshot of all active cards with every message. The model performs semantic matching to find the exact target card and executes `removeCard` with its ID.

### 4. 🎨 Visual Tool Lifecycles (No JSON Dumps)
Every tool call lifecycle is rendered as a clean, human-friendly UI block:
- **`streaming-call`**: Amber badge showing live streaming parameters.
- **`call`**: Spinner showing execution progress.
- **`output-available`**: 
  - Emerald badge for card additions (`Card Created` / `Added to UI`).
  - Rose/red badge with trash icon for card removals (`Card Removed` / `Removed from UI`).
- **`output-error`**: Formatted error message.

### 5. 💾 Client-Side Persistence & Smooth Transitions
- Cards are synchronized with browser `localStorage` for persistence across reloads.
- Built-in SSR safety prevents hydration and pre-rendering issues.
- Responsive grid supporting desktop, tablet, and mobile layouts with dark mode compatibility.

### 6. 🧠 Managing the `useChat()` State Machine
The application utilizes the state lifecycle of the Vercel AI SDK's `useChat()` hook to provide an intuitive user experience:

| State (`status`) | Description | How We Handled It in UI |
| :--- | :--- | :--- |
| **`'ready'`** | Idle; ready for user input | Chat input form is enabled and ready to accept prompts. |
| **`'submitted'`** | Message sent; waiting for the model to start responding | Displays bouncing indicator dots with **`AI is thinking...`** and locks the input form. |
| **`'streaming'`** | Response tokens and tool events are actively arriving | Displays bouncing indicator dots with **`AI is typing...`** and updates tool lifecycle parts live. |
| **`'error'`** | API or network request failed | Renders a styled alert banner displaying the error message. |

#### 🔍 Why `status` Instead of Checking Last Message Role?
A common pitfall is checking `messages[messages.length - 1]?.role === 'user'` to show a thinking loader. However, as soon as `sendMessage()` is executed, the AI SDK immediately appends an empty assistant message `{ role: 'assistant', parts: [] }` in anticipation of the stream. Thus, the last message's role is never `'user'` during the wait phase.

By explicitly checking `(status === 'submitted' || status === 'streaming')`:
1. **Immediate Feedback**: The user instantly sees **"AI is thinking..."** the millisecond they press Enter.
2. **Smooth Transition**: It shifts to **"AI is typing..."** as soon as the first stream chunks arrive.
3. **Submission Guard**: `disabled={status === 'streaming' || status === 'submitted'}` prevents race conditions or double-submitting while the AI is busy.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **AI Framework** | [Vercel AI SDK](https://sdk.vercel.ai/) (`ai` v7, `@ai-sdk/react`, `@ai-sdk/google`) |
| **LLM Model** | Google Gemini (`gemini-3.1-flash-lite`) |
| **Schema Validation** | [Zod](https://zod.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`
- **Google AI API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/flyrank-w5.git
   cd flyrank-w5
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 How to Use

### 1. Adding Cards
- Click the floating **AI Chat** button in the top right.
- Send prompts like:
  - *"Create a card about TypeScript best practices"*
  - *"Make a card for Next.js 16 features"*
  - *"Add a card about CSS Grid tricks with tags css, design"*
- Watch the AI create the card and add it directly to the board.

### 2. Deleting Cards
- **Via UI**: Click the trash / delete button directly on any card.
- **Via AI Chat**:
  - *"Remove the TypeScript card"*
  - *"Delete the card with id [paste id here]"*
  - *"Remove the card about Next.js"*

---

## 📁 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # AI SDK endpoint with Gemini & tools (addCard, removeCard)
│   │   ├── globals.css               # Tailwind CSS v4 styling
│   │   ├── layout.tsx                # Root layout & font setup
│   │   └── page.tsx                  # Main board view with state & localStorage sync
│   └── components/
│       ├── BackGrround.tsx           # Subtle decorative background
│       ├── CardContainer.tsx         # Responsive cards grid layout
│       ├── ChatInputForm.tsx         # Isolated chat input form
│       ├── Hero.tsx                  # Hero header section
│       ├── MyAIChat.tsx              # Slide-over sidebar & AI tool event coordinator
│       └── ToolLifecycleRenderer.tsx # Visual lifecycle renderer for tool states
├── .env.local                        # Local environment variables (ignored in git)
├── next.config.ts                    # Next.js configuration
├── package.json                      # Project dependencies & scripts
└── tsconfig.json                     # TypeScript configuration
```

---

## ☁️ Deploying to Vercel

1. Push your repository to **GitHub**.
2. Import the repository into **[Vercel](https://vercel.com/)**.
3. In **Project Settings ➔ Environment Variables**, add:
   - **Key:** `GOOGLE_GENERATIVE_AI_API_KEY`
   - **Value:** Your Google AI Studio API key
4. Click **Deploy**.

> **Note:** The API route already includes `export const maxDuration = 60;` to support long streaming responses on Vercel serverless functions without timing out.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
