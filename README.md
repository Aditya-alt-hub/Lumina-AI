# Lumina AI 

Lumina AI is a full-stack **Multi-AI Agent Platform** built using the MERN stack, LangChain, LangGraph, RAG, and a microservices architecture.

The platform provides AI-powered chat and agent workflows with secure authentication, Redis-based session management and rate limiting, subscription management, and temporary generation of PDF, PPT, and image artifacts.

---

## Features

- 🤖 AI-powered chat and agent workflows
- 🧠 LangChain-based AI workflows
- 🔄 LangGraph for stateful and multi-step agent workflows
- 📚 Retrieval-Augmented Generation (RAG)
- 🔐 Firebase Authentication
- 🍪 Secure HTTP-only session cookies
- ⚡ Redis/Valkey-based session management
- 🚦 Redis-based agent rate limiting and usage control
- 💬 Conversation and message management
- 📄 AI-generated PDF files
- 📊 AI-generated PPT presentations
- 🖼️ AI-generated images
- 💳 Subscription and payment management
- 🌐 RESTful APIs
- 🔀 Centralized API Gateway
- 🧩 Microservices architecture
- 🐳 Dockerized backend services
- ☁️ Cloud deployment using Render and Vercel

---

## System Architecture

```text
                         ┌──────────────────────┐
                         │      React.js        │
                         │       Frontend       │
                         │        Vercel        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     API Gateway      │
                         │    Node.js/Express   │
                         │        Render        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │    Auth     │       │    Chat     │       │    Agent    │
       │   Service   │       │   Service   │       │   Service   │
       └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │   Firebase  │       │  MongoDB    │       │ LangChain   │
       │     Auth    │       │   Atlas     │       │ LangGraph   │
       └─────────────┘       └─────────────┘       │     RAG     │
                                                   └──────┬──────┘
                                                          │
                                                          ▼
                                                   Temporary Files


                         ┌──────────────────────┐
                         │   Payment Service    │
                         │    Node.js/Express   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                             Payment / Plans


                         ┌──────────────────────┐
                         │    Redis / Valkey    │
                         │                      │
                         │ • Session Management │
                         │ • Rate Limiting      │
                         │ • Usage Control      │
                         └──────────────────────┘
```

---

## Microservices

Lumina AI uses a **microservices architecture** where different application responsibilities are separated into independent backend services.

### API Gateway

The API Gateway acts as the single entry point between the frontend and backend services.

**Responsibilities:**

- Request routing
- Authentication middleware
- Session validation
- CORS handling
- Inter-service communication
- Forwarding authenticated user information

**Routes:**

```text
/api/auth
/api/chat
/api/agent
/api/payment
```

---

### Authentication Service

The Authentication Service manages user authentication and session creation.

**Technologies:**

- Firebase Authentication
- Firebase Admin SDK
- MongoDB
- Redis/Valkey
- HTTP-only cookies

**Authentication Flow:**

```text
User
  │
  ▼
Firebase Authentication
  │
  ▼
Firebase ID Token
  │
  ▼
Authentication Service
  │
  ▼
Firebase Admin SDK
  │
  ▼
Token Verification
  │
  ▼
MongoDB User
  │
  ▼
Redis Session
  │
  ▼
HTTP-only Cookie
```

---

### Chat Service

The Chat Service manages conversations and messages.

**Responsibilities:**

- Create conversations
- Retrieve conversations
- Store messages
- Retrieve message history
- Associate conversations with authenticated users

**Flow:**

```text
Frontend
   │
   ▼
API Gateway
   │
   ▼
Chat Service
   │
   ▼
MongoDB Atlas
```

---

### AI Agent Service

The Agent Service is responsible for AI-powered workflows and agent execution.

**Technologies:**

- LangChain
- LangGraph
- RAG
- LLM APIs
- Redis/Valkey

**Capabilities:**

- Multi-step AI workflows
- Stateful agent execution
- Context retrieval
- AI-generated content
- PDF generation
- PPT generation
- Image generation
- Temporary artifact storage
- Agent usage limiting

---

### Payment Service

The Payment Service handles subscription and plan-related functionality.

**Plans:**

```text
Free
Basic
Pro
```

**Responsibilities:**

- Plan management
- Subscription-related operations
- Payment processing
- User plan information
- Credit-related functionality

---

## AI Architecture

Lumina AI uses **LangChain and LangGraph** to build structured and stateful AI workflows.

```text
                    User Request
                         │
                         ▼
                   API Gateway
                         │
                         ▼
                   Agent Service
                         │
                         ▼
                  LangGraph Workflow
                         │
                  ┌──────┴──────┐
                  │             │
                  ▼             ▼
                Tools          RAG
                                │
                                ▼
                       Context Retrieval
                                │
                                ▼
                         Prompt + Context
                                │
                                ▼
                               LLM
                                │
                                ▼
                       Generated Response
```

---

## LangChain

LangChain is used to build and manage AI-powered application workflows.

**Usage includes:**

- LLM integration
- Prompt management
- AI chains
- Tool integration
- Retrieval workflows
- Agent development

---

## LangGraph

LangGraph is used to create stateful and multi-step AI agent workflows.

**Usage includes:**

- Stateful agent execution
- Multi-step workflows
- Workflow orchestration
- Conditional processing
- Agent state management

---

## Retrieval-Augmented Generation (RAG)

Lumina AI uses **Retrieval-Augmented Generation (RAG)** to provide relevant contextual information to the AI before generating responses.

```text
User Query
    │
    ▼
Retriever
    │
    ▼
Relevant Context
    │
    ▼
Context + Prompt
    │
    ▼
LLM
    │
    ▼
Knowledge-Grounded Response
```

RAG helps the AI generate responses based on retrieved contextual information rather than relying only on the model's existing knowledge.

---

## Redis / Valkey

Redis/Valkey is used for fast, temporary backend data and request control.

### Session Management

Authenticated sessions are stored in Redis.

```text
User Login
    │
    ▼
Generate Session ID
    │
    ▼
Store Session in Redis
    │
    ▼
HTTP-only Cookie
    │
    ▼
Authenticated Requests
```

The API Gateway validates the session before forwarding protected requests to backend services.

### Agent Rate Limiting

Redis is also used for **AI agent rate limiting and usage control**.

```text
User Request
     │
     ▼
Rate Limit Check
     │
     ▼
Redis / Valkey
     │
     ▼
 ┌───────────────┐
 │ Limit Allowed?│
 └───────┬───────┘
         │
     ┌───┴───┐
     │       │
    Yes      No
     │       │
     ▼       ▼
 AI Agent  Reject
```

This helps prevent excessive AI requests and controls consumption of AI resources.

---

## Database

Lumina AI uses **MongoDB Atlas** as its primary cloud database.

MongoDB is used for persistent application data such as:

- Users
- Conversations
- Messages
- Plans
- Credits
- Application data

MongoDB Atlas provides a cloud-hosted database that can be accessed by the deployed backend services.

---

## Temporary File Storage

AI-generated files such as PDFs, PPTs, and images are stored temporarily on the backend filesystem.

```text
AI Agent
   │
   ▼
Generate File
   │
   ▼
Temporary Filesystem
   │
   ▼
Download / Preview URL
   │
   ▼
User
```

Temporary files are automatically treated as expired after the configured retention period.

This approach is intended for short-lived generated artifacts rather than permanent file storage.

---

## Authentication & Security

Lumina AI implements multiple security mechanisms.

### Authentication

- Firebase Authentication
- Firebase Admin SDK
- ID token verification
- HTTP-only session cookies
- Redis-backed sessions

### API Security

- Protected API routes
- Server-side session validation
- CORS configuration
- Authentication middleware
- User-specific data access
- Redis-based rate limiting

### Environment Variables

Sensitive configuration is stored using environment variables instead of being hardcoded into the source code.

---

## Docker

The backend services are independently containerized using Docker.

```text
backend/
│
├── gateway/
│   └── Dockerfile
│
├── services/
│   ├── auth/
│   │   └── Dockerfile
│   │
│   ├── chat/
│   │   └── Dockerfile
│   │
│   ├── agent/
│   │   └── Dockerfile
│   │
│   └── payment/
│       └── Dockerfile
│
└── shared/
```

Each service has its own Dockerfile and can be built and deployed independently.

---

## Tech Stack

### Frontend

- React.js
- Vite
- Redux Toolkit
- Axios
- JavaScript

### Backend

- Node.js
- Express.js
- REST APIs
- Microservices
- API Gateway

### AI / Generative AI

- LangChain
- LangGraph
- RAG
- LLM APIs
- AI Agents

### Database & Caching

- MongoDB
- MongoDB Atlas
- Redis
- Valkey

### Authentication

- Firebase Authentication
- Firebase Admin SDK
- HTTP-only Cookies
- Session Management

### DevOps & Deployment

- Docker
- Render
- Vercel
- Git
- GitHub

---

## Project Structure

```text
Lumina-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   │
│   ├── gateway/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── services/
│   │   │
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── agent/
│   │   └── payment/
│   │
│   ├── shared/
│   │   └── redis/
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aditya-alt-hub/Lumina-AI.git
```

```bash
cd Lumina-AI
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

Install dependencies for each service:

```bash
cd services/auth
npm install

cd ../chat
npm install

cd ../agent
npm install

cd ../payment
npm install

cd ../../gateway
npm install
```

---

## Environment Variables

Create the required `.env` files for the frontend and backend services.

### Backend

```env
MONGO_URI=your_mongodb_atlas_connection_string

REDIS_URL=your_redis_connection_string

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

FRONTEND_URL=http://localhost:5173

AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
PAYMENT_SERVICE=http://localhost:8004
```

### Frontend

```env
VITE_SERVER_URL=http://localhost:8000
```

> **Important:** Never commit `.env` files, Firebase private keys, API keys, database credentials, Redis credentials, or payment credentials to GitHub.

---

## Running Locally

Start each backend service individually.

### Auth Service

```bash
cd backend/services/auth
npm start
```

### Chat Service

```bash
cd backend/services/chat
npm start
```

### Agent Service

```bash
cd backend/services/agent
npm start
```

### Payment Service

```bash
cd backend/services/payment
npm start
```

### API Gateway

```bash
cd backend/gateway
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

The frontend communicates with the backend through the API Gateway.

---

## Request Flow

A typical authenticated AI request follows this flow:

```text
                         User
                           │
                           ▼
                    React Frontend
                           │
                           ▼
                     API Gateway
                           │
                           ▼
                   Session Validation
                           │
                           ▼
                    Redis / Valkey
                           │
                     Session Valid
                           │
                           ▼
                     Agent Service
                           │
                           ▼
                    Rate Limit Check
                           │
                           ▼
                  LangGraph Workflow
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                   RAG          Tools
                    │             │
                    └──────┬──────┘
                           ▼
                          LLM
                           │
                           ▼
                   Generated Result
                           │
                           ▼
                    React Frontend
```

---

## Deployment

### Frontend

The React/Vite frontend is deployed using **Vercel**.

```text
React + Vite
     │
     ▼
  Vercel
```

### Backend

Backend microservices are Dockerized and deployed independently using **Render**.

```text
API Gateway  → Render
Auth         → Render
Chat         → Render
Agent        → Render
Payment      → Render
```

### Database

```text
MongoDB Atlas
```

### Redis

```text
Render Key Value / Valkey
```

---

## Live Application

**Live Demo:**

https://lumina-ai-q1ra.vercel.app

**GitHub Repository:**

https://github.com/Aditya-alt-hub/Lumina-AI

---

## Key Technical Highlights

- Microservices architecture
- Centralized API Gateway
- LangChain AI workflows
- LangGraph stateful agents
- Retrieval-Augmented Generation (RAG)
- Redis-based rate limiting
- Redis-backed session management
- Firebase Authentication
- MongoDB Atlas
- RESTful API design
- Docker containerization
- Cloud deployment
- Temporary AI artifact storage
- Environment-based configuration

---

## Future Improvements

- Advanced AI agent observability
- Background job processing
- Improved RAG document management
- Automated CI/CD pipelines
- Horizontal scaling of microservices
- Production-grade Redis persistence
- Advanced application monitoring
- Improved AI workflow optimization

---

## Author

**Aditya Bhadauria**

GitHub:  
https://github.com/Aditya-alt-hub
