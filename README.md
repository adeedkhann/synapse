
# Synapse

Synapse is a full-stack AI chat application that lets users converse with multiple large language models through a single, unified interface. It is built on Next.js 16, streams responses in real time via the Vercel AI SDK, and routes all model requests through OpenRouter so users can switch between providers without managing separate API keys.

---

## Screenshots

<!-- Add your screenshots below. Replace the placeholder paths with the actual image paths. -->

<img width="960" height="436" alt="Screenshot 2026-06-07 170206" src="https://github.com/user-attachments/assets/ac90192c-434a-4dac-a9f7-c9cfb469ad1e" />
<img width="960" height="436" alt="Screenshot 2026-06-07 170236" src="https://github.com/user-attachments/assets/b8c6cb53-2f32-4620-8d8c-e3774e2c2806" />
<img width="960" height="436" alt="Screenshot 2026-06-07 170247" src="https://github.com/user-attachments/assets/543f27cc-2cd4-403e-beaa-2545fdd3efd5" />
<img width="960" height="436" alt="Screenshot 2026-06-07 170227" src="https://github.com/user-attachments/assets/169e4cdb-15f2-4da5-99ef-5c594d34ad89" />

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Key Design Decisions](#key-design-decisions)

---

## Features

- **Multi-Model Chat** -- Interact with any LLM available on OpenRouter (GPT-4o, Claude, Gemini, Llama, Mistral, and more) from a single chat interface. A dedicated model selector separates free and paid models so users can choose based on cost.
- **Real-Time Streaming** -- AI responses stream token-by-token to the browser using the Vercel AI SDK's `streamText` and `UIMessageStreamResponse`, providing immediate visual feedback.
- **Reasoning / Chain-of-Thought Display** -- When a model returns reasoning tokens, Synapse renders them in a collapsible "Reasoning" block above the final answer.
- **Persistent Chat History** -- Every conversation and message is stored in a PostgreSQL database via Prisma. Users can return to any previous chat and continue where they left off.
- **Chat Sidebar with Date Grouping** -- The sidebar dynamically groups conversations into Today, Yesterday, Previous 7 Days, and Older. A built-in search bar filters chats by title in real time.
- **Email/Password and GitHub OAuth Authentication** -- Users can sign up and sign in with email and password, or authenticate via GitHub OAuth. Both flows are powered by Better Auth with automatic session management, token refresh, and account linking.
- **Route Protection** -- Server-side guards (`requiresAuth` / `requiresUnAuth`) redirect unauthenticated users to the sign-in page and prevent authenticated users from seeing the login screen again.
- **Dark / Light / System Theme** -- Full theme support powered by `next-themes` with a toggle accessible from the sidebar footer. The design system uses OKLCH color tokens for both modes.
- **Responsive Layout** -- The sidebar collapses to an icon-only rail on desktop and converts to a slide-out sheet on mobile via Radix UI Sheet.
- **Welcome Prompt Tabs** -- New users see curated prompt suggestions organized into Create, Explore, Code, and Learn tabs, making it easy to start a conversation.
- **Auto-Trigger on Chat Creation** -- When a user sends their first message, Synapse creates the chat, stores the user message, navigates to the chat page, and automatically triggers the AI response without an extra round-trip.
- **Chat Deletion with Confirmation** -- Each chat can be deleted through a confirmation modal. Deletion cascades to all associated messages in the database.

---

## Tech Stack

### Framework and Runtime

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.7 | React meta-framework. Uses the App Router with route groups, server components, server actions, and API routes. |
| **React** | 19.2.4 | UI rendering with the latest features including `use`, server components, and concurrent rendering. |
| **TypeScript** | 5.x | Static type safety across the entire codebase. Configured with strict mode and bundler module resolution. |

### AI and LLM Integration

| Technology | Purpose |
|---|---|
| **Vercel AI SDK (`ai`)** | Core SDK providing `streamText`, `convertToModelMessages`, `UIMessage`, `DefaultChatTransport`, and `useChat` for real-time streaming and message management. |
| **@ai-sdk/react** | React hooks layer of the AI SDK. Provides the `useChat` hook that manages message state, streaming status, and transport. |
| **@openrouter/ai-sdk-provider** | AI SDK-compatible provider adapter for OpenRouter. Allows calling any OpenRouter-hosted model through the unified `streamText` API. |
| **OpenRouter** | External API gateway that routes requests to 100+ LLMs (OpenAI, Anthropic, Google, Meta, Mistral, etc.) using a single API key. |

### Database and ORM

| Technology | Purpose |
|---|---|
| **PostgreSQL** | Primary relational database. Stores users, sessions, accounts, chats, and messages. |
| **Prisma** | ORM and schema manager. Defines all models, relations, and indexes. Uses a generated client with a custom output directory. |
| **@prisma/adapter-pg** | Prisma driver adapter that uses the `pg` connection pool instead of Prisma's default query engine, enabling connection pooling and edge compatibility. |
| **pg** | Node.js PostgreSQL client. Provides the underlying connection pool consumed by the Prisma PG adapter. |

### Authentication

| Technology | Purpose |
|---|---|
| **Better Auth** | Authentication library with built-in session management, email/password credentials, social providers, and a Prisma adapter. Handles sign-up, sign-in, sign-out, session validation, and token management. |
| **Email/Password Auth** | Credential-based authentication. Users can register with name, email, and password, then sign in with email and password. Enabled via Better Auth's `emailAndPassword` option. |
| **GitHub OAuth** | Social login provider. Users can alternatively authenticate via GitHub and their profile (name, email, avatar) is synced to the database. |

### UI Component Library

| Technology | Purpose |
|---|---|
| **shadcn/ui (v4, Radix Maia style)** | Pre-built, customizable component primitives. The project uses 30 components including Button, Card, Dialog, Command, DropdownMenu, Sheet, Popover, Select, Tabs, and more. |
| **Radix UI** | Headless, accessible UI primitives that underpin every shadcn/ui component. Provides keyboard navigation, focus management, and ARIA attributes. |
| **AI Elements (@ai-sdk)** | Vercel AI SDK's component registry. Provides 48 pre-built AI-specific components (PromptInput, Conversation, Message, Reasoning, CodeBlock, etc.) registered via the `components.json` `@ai-elements` registry. |

### Styling

| Technology | Purpose |
|---|---|
| **Tailwind CSS** | 4.x | Utility-first CSS framework. Configured with PostCSS and the `@tailwindcss/postcss` plugin. |
| **tw-animate-css** | Animation utility classes for Tailwind. |
| **tailwind-merge** | Intelligent Tailwind class merging to avoid conflicts when composing utility classes. |
| **class-variance-authority (CVA)** | Variant-based component styling. Used by shadcn/ui components to define size, variant, and state-based class combinations. |
| **clsx** | Conditional class name construction utility. Used alongside `tailwind-merge` in the `cn()` helper. |

### State Management and Data Fetching

| Technology | Purpose |
|---|---|
| **TanStack React Query** | Server state management. Provides `useQuery` and `useMutation` hooks for fetching chats, creating chats, deleting chats, and fetching AI models with automatic cache invalidation. |
| **Next.js Server Actions** | Server-side mutation functions (`"use server"`) for chat CRUD operations with `revalidatePath` for cache busting. |

### Fonts and Typography

| Font | Purpose |
|---|---|
| **Geist Sans** | Primary sans-serif body font (`--font-geist-sans`). |
| **Geist Mono** | Monospace font for code elements (`--font-geist-mono`). |
| **Lora** | Serif font used as the default body font family (`--font-serif`). |
| **JetBrains Mono** | Heading font for a distinctive developer-oriented aesthetic (`--font-heading`). |

### Additional Libraries

| Library | Purpose |
|---|---|
| **motion** | Animation library (Framer Motion successor) for page transitions and micro-interactions. |
| **sonner** | Toast notification system. Displays success/error feedback for chat operations. |
| **next-themes** | Theme management with system preference detection, localStorage persistence, and SSR-safe hydration. |
| **react-textarea-autosize** | Auto-expanding textarea for the chat input that grows with content up to 8 rows. |
| **cmdk** | Command menu component (used within the model selector for searchable model lists). |
| **date-fns** | Date utility library for date formatting and manipulation. |
| **nanoid** | Compact, URL-friendly unique ID generator. Used by the AI SDK for message ID generation. |
| **shiki** | Syntax highlighter for rendering code blocks in AI responses. |
| **streamdown** | Streaming markdown renderer with plugins for CJK text, code blocks, math, and mermaid diagrams. |
| **lucide-react** | Icon library providing all UI icons (PlusIcon, SearchIcon, ArrowUp, Menu, etc.). |
| **embla-carousel-react** | Carousel component used by the shadcn/ui Carousel primitive. |
| **tokenlens** | Token counting utility for LLM context window awareness. |

---

## Architecture Overview

```
Browser (React 19)
    |
    |-- useChat() hook (AI SDK) ---> POST /api/chat ---> OpenRouter API ---> LLM
    |                                     |
    |                                     |-- streamText() response
    |                                     |-- onFinish: persist to PostgreSQL
    |
    |-- Server Actions ----------------> Prisma ORM ---> PostgreSQL
    |   (createChat, deleteChat, etc.)
    |
    |-- Better Auth -------------------> /api/auth/[...all] ---> GitHub OAuth
    |
    |-- React Query --------------------> Cache layer for chats & models
```

**Request flow for a new conversation:**
1. User types a message and selects a model on the home page.
2. `createChatWithMessage` server action creates a Chat + initial Message in the database.
3. The user is redirected to `/chat/[chatId]?autoTrigger=true`.
4. The `MessageViewWithForm` component detects `autoTrigger`, calls `regenerate()` which sends the stored messages to `POST /api/chat`.
5. The API route calls `streamText()` with the OpenRouter provider, streaming tokens back to the client.
6. On stream completion, the `onFinish` callback persists both the user message and the assistant response to the database.
7. The sidebar auto-refreshes via React Query cache invalidation.

---

## Project Structure

```
synapse/
|-- app/
|   |-- (auth)/                        # Auth route group (sign-in page)
|   |   |-- layout.tsx                 # Redirects authenticated users away
|   |   |-- sign-in/page.tsx           # Email/password + GitHub OAuth sign-in page
|   |   |-- sign-up/page.tsx           # Email/password + GitHub OAuth sign-up page
|   |-- (root)/                        # Main app route group (protected)
|   |   |-- layout.tsx                 # Auth guard + sidebar layout
|   |   |-- page.tsx                   # Home page with welcome tabs + input
|   |   |-- chat/[chatId]/page.tsx     # Individual chat conversation page
|   |-- api/
|   |   |-- auth/[...all]/             # Better Auth catch-all API route
|   |   |-- ai/get-models/route.ts     # Fetches available models from OpenRouter
|   |   |-- chat/route.ts              # Handles AI chat streaming (POST)
|   |-- globals.css                    # Tailwind config, theme tokens, utilities
|   |-- layout.tsx                     # Root layout (fonts, providers, toaster)
|
|-- components/
|   |-- Providers/
|   |   |-- query-provider.tsx         # TanStack React Query provider
|   |   |-- theme-provider.tsx         # next-themes provider with hydration guard
|   |-- ai-elements/                   # 48 AI SDK UI components (prompt-input,
|   |                                  #   conversation, message, reasoning, etc.)
|   |-- ui/                            # 30 shadcn/ui primitives (button, card,
|   |                                  #   dialog, command, sheet, popover, etc.)
|   |-- delete-chat-model.tsx          # Chat deletion confirmation modal
|   |-- mode-toggle.tsx                # Light/dark/system theme switcher
|
|-- modules/
|   |-- authentication/
|   |   |-- actions/index.ts           # Server actions: currentUser, requiresAuth,
|   |   |                              #   requiresUnAuth
|   |   |-- components/userButton.tsx  # User avatar dropdown with logout
|   |-- chat/
|   |   |-- actions/index.ts           # Server actions: createChatWithMessage,
|   |   |                              #   getAllChats, getChatById, deleteChat
|   |   |-- hooks/
|   |   |   |-- use-chats.ts           # React Query hooks for chat CRUD
|   |   |   |-- use-ai-models.ts       # React Query hook for fetching models
|   |   |-- components/
|   |       |-- chat-sidebar.tsx       # Sidebar with search, date grouping, collapse
|   |       |-- chat-view/
|   |       |   |-- chat-message-view.tsx    # Home page chat view container
|   |       |   |-- chat-message-form.tsx    # Message input with model selector
|   |       |   |-- chat-welcome-tabs.tsx    # Prompt suggestion tabs
|   |       |   |-- model-selector.tsx       # Searchable model picker (free/paid)
|   |       |-- messages/
|   |           |-- message-view-form.tsx    # Active chat view with streaming
|
|-- lib/
|   |-- auth.ts                        # Better Auth server config (Prisma + GitHub)
|   |-- auth-client.ts                 # Better Auth client-side instance
|   |-- db.ts                          # Prisma client singleton with PG pool adapter
|   |-- prompt.ts                      # System prompt for the Synapse AI assistant
|   |-- utils.ts                       # cn() utility (clsx + tailwind-merge)
|
|-- prisma/
|   |-- schema.prisma                  # Database schema (User, Session, Account,
|   |                                  #   Verification, Chat, Message)
|   |-- migrations/                    # SQL migration files
|   |-- generated/                     # Generated Prisma client
|
|-- public/                            # Static assets (SVGs, favicon)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **PostgreSQL** database (local or hosted, e.g., Neon, Supabase, Railway)
- **GitHub OAuth App** (create one at [github.com/settings/developers](https://github.com/settings/developers))
- **OpenRouter API Key** (get one at [openrouter.ai/keys](https://openrouter.ai/keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/adeedkhann/synapse.git
cd synapse

# Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/synapse"

# Better Auth
BETTER_AUTH_SECRET="your-auth-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OpenRouter
OPENROUTER_API_KEY="your-openrouter-api-key"

# App URL (used by Better Auth client)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Database Setup

```bash
# Generate the Prisma client
npx prisma generate

# Run migrations against your database
npx prisma migrate dev

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

The schema defines six models:

| Model | Purpose |
|---|---|
| **User** | Stores user profiles synced from GitHub OAuth. |
| **Session** | Tracks active login sessions with expiration and device info. |
| **Account** | Links OAuth provider accounts to users (GitHub tokens, etc.). |
| **Verification** | Handles email/token verification flows. |
| **Chat** | A conversation container with a title, model reference, and user association. |
| **Message** | Individual messages within a chat, storing content as JSON parts, role (USER/ASSISTANT), and type (NORMAL/ERROR/TOOL_CALL). |

---

## Running the Application

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm start

# Run ESLint
npm run lint
```

The application will be available at `http://localhost:3000`.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/chat` | Accepts messages and a model ID, streams an AI response via OpenRouter, and persists both user and assistant messages to the database on completion. |
| `GET` | `/api/ai/get-models` | Fetches the full model catalog from OpenRouter, filters to free-tier models, and returns them with pricing, context length, and provider metadata. |
| `ALL` | `/api/auth/[...all]` | Better Auth catch-all handler for sign-in, sign-out, session management, and OAuth callbacks. |

---

## Key Design Decisions

**Why OpenRouter instead of direct provider APIs?**
OpenRouter provides a unified API across 100+ models from different providers. This lets users switch models without the application needing to manage multiple API keys, SDKs, or rate limits.

**Why Better Auth over NextAuth?**
Better Auth provides a lightweight, Prisma-native authentication solution with first-class support for social providers and a clean client-side API (`authClient.signIn.social`). It avoids the configuration overhead of NextAuth while offering full control over the session schema.

**Why Prisma with the PG adapter?**
The `@prisma/adapter-pg` replaces Prisma's binary query engine with a direct PostgreSQL connection pool via the `pg` library. This reduces cold start times, enables connection pooling, and improves compatibility with serverless and edge environments.

**Why TanStack Query alongside Server Actions?**
Server actions handle mutations (create, delete) with `revalidatePath` for server-side cache invalidation. TanStack Query manages client-side cache, provides optimistic updates, loading states, and error handling through `useQuery` and `useMutation` hooks. This combination gives the best of both worlds: server-driven revalidation and rich client-side state management.

**Why a feature-based module structure?**
The `modules/` directory organizes code by domain (authentication, chat) rather than by technical layer. Each module contains its own actions, hooks, and components, making it easy to understand and modify a feature without jumping across unrelated directories.

---

## License

This project is open source. See the repository for license details.

---

Built by [Adeed Khan](https://github.com/adeedkhann)
