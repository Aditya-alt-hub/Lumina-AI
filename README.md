# Lumina AI

A full-stack **Multi-AI Agent Platform** built with the MERN stack, LangChain, LangGraph, RAG, and a scalable microservices architecture.

Lumina AI provides AI-powered conversations and agent workflows while supporting authentication, session management, usage limiting, generated files, and subscription/payment functionality.

---

##  Features

- 🤖 AI-powered chat and agent workflows
- 🧠 **LangChain** integration for AI application development
- 🔄 **LangGraph** for stateful and multi-step agent workflows
- 📚 **RAG (Retrieval-Augmented Generation)** for contextual AI responses
- 🔐 Firebase Authentication with Firebase Admin SDK
- 🍪 Secure HTTP-only session cookies
- ⚡ Redis/Valkey-based session management
- 🚦 Redis-based AI agent rate limiting and usage controls
- 💬 Conversation and message management
- 📄 AI-generated PDF files
- 📊 AI-generated presentations
- 🖼️ AI-generated images
- 💳 Subscription and payment management
- 🌐 RESTful APIs
- 🔀 Centralized API Gateway
- 🧩 Microservices-based backend
- 🐳 Dockerized backend services
- ☁️ Cloud deployment with Render and Vercel

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      React.js       │
                         │      Frontend       │
                         │       Vercel        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     API Gateway     │
                         │   Node.js/Express   │
                         │       Render        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │    Auth     │       │    Chat     │       │    Agent    │
       │   Service   │       │   Service   │       │   Service   │
       └─────────────┘       └─────────────┘       └─────────────┘
              │                     │                     │
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │   Firebase  │       │  MongoDB    │       │ LangChain   │
       │    Auth     │       │   Atlas     │       │ LangGraph   │
       └─────────────┘       └─────────────┘       │    RAG      │
                                                   └─────────────┘
                                                          │
                                                          ▼
                                                   Temporary Files

                         ┌─────────────────────┐
                         │   Payment Service   │
                         │   Node.js/Express    │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │    Redis / Valkey   │
                         │ Sessions & Limiting │
                         └─────────────────────┘
Microservices
API Gateway

Acts as the single entry point for the frontend.

Responsibilities:

Request routing
Authentication middleware
CORS configuration
Service communication
User session validation

Routes:

/api/auth
/api/chat
/api/agent
/api/payment
Authentication Service

Handles user authentication and account management.

Technologies:

Firebase Authentication
Firebase Admin SDK
MongoDB
Redis/Valkey
HTTP-only cookies

Authentication flow:

User
 ↓
Firebase Authentication
 ↓
Firebase ID Token
 ↓
Auth Service
 ↓
Firebase Admin Verification
 ↓
MongoDB User
 ↓
Redis Session
 ↓
HTTP-only Cookie
Chat Service

Responsible for conversational functionality.

Features:

Create conversations
Retrieve conversations
Store messages
Retrieve message history
User-specific conversation management
AI Agent Service

The Agent Service is the core AI component of Lumina AI.

Technologies:

LangChain
LangGraph
RAG
LLM APIs
Redis
Temporary file storage

The service supports multi-step AI workflows and generated artifacts such as:

PDF
PPT
Images

Generated files are stored temporarily and automatically expire after a configured period.

Payment Service

Handles subscription and plan-related functionality.

Supported plans include:

Free
Basic
Pro

The service manages billing-related operations and user plan information.

AI Architecture

Lumina AI uses LangChain and LangGraph to build structured AI workflows.

User Request
     ↓
API Gateway
     ↓
Agent Service
     ↓
LangGraph Workflow
     ↓
 ┌───────────────┐
 │ Agent / Tools │
 └───────┬───────┘
         ↓
      RAG Layer
         ↓
Context Retrieval
         ↓
       LLM
         ↓
Generated Response
LangChain

Used for:

LLM integration
Prompt management
AI chains
Tool integration
Retrieval workflows
LangGraph

Used for:

Stateful workflows
Multi-step agent execution
Workflow orchestration
Conditional AI processing
RAG

Retrieval-Augmented Generation is used to provide relevant contextual information to the AI before generating responses.

User Query
    ↓
Retriever
    ↓
Relevant Context
    ↓
Prompt + Context
    ↓
LLM
    ↓
Grounded Response
Redis

Redis is used for multiple backend requirements.

Session Management
Session ID
    ↓
Redis
    ↓
User Session
Agent Rate Limiting

Redis is also used to control AI-agent usage and prevent excessive requests.

User Request
     ↓
Rate Limit Check
     ↓
Redis
     ↓
 ┌──────────────┐
 │ Limit OK?    │
 └──────┬───────┘
        │
   Yes  │  No
    ↓   │   ↓
 Agent  │  Reject
        │

This helps protect AI resources and improve backend reliability.

Database

Lumina AI uses MongoDB Atlas as the primary cloud database.

MongoDB stores application data such as:

Users
Conversations
Messages
Plans
Credits
Application data

The application uses MongoDB Atlas instead of relying on a local MongoDB server in production.

Security

Security features implemented in the application include:

Firebase Authentication
Firebase Admin SDK token verification
HTTP-only session cookies
Redis-backed session validation
Role/access protection through middleware
CORS configuration
Environment variables for secrets
Redis-based rate limiting
Server-side authentication checks

Sensitive credentials are stored using environment variables and are not committed to GitHub.

Docker

Each backend service is containerized independently.

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

This allows individual services to be built and deployed independently.

Tech Stack
Frontend
React.js
Vite
Redux Toolkit
Axios
JavaScript
Backend
Node.js
Express.js
REST APIs
Microservices
API Gateway
AI / GenAI
LangChain
LangGraph
RAG
LLM APIs
AI Agents
Database & Caching
MongoDB
MongoDB Atlas
Redis
Valkey
Authentication
Firebase Authentication
Firebase Admin SDK
HTTP-only Cookies
DevOps & Deployment
Docker
Render
Vercel
Git
GitHub
Project Structure
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
Installation
1. Clone the repository
git clone https://github.com/Aditya-alt-hub/Lumina-AI.git
cd Lumina-AI
2. Install frontend dependencies
cd frontend
npm install
3. Install backend dependencies
cd ../backend
npm install

Install dependencies for each service:

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
Environment Variables

Create .env files for the required services.

Example:

MONGO_URI=your_mongodb_atlas_connection_string

REDIS_URL=your_redis_url

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"

FRONTEND_URL=http://localhost:5173

AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
PAYMENT_SERVICE=http://localhost:8004

Frontend:

VITE_SERVER_URL=http://localhost:8000

Never commit .env files, Firebase private keys, API keys, or other credentials to GitHub.

Running Locally

Start the individual services:

Auth
cd backend/services/auth
npm start
Chat
cd backend/services/chat
npm start
Agent
cd backend/services/agent
npm start
Payment
cd backend/services/payment
npm start
Gateway
cd backend/gateway
npm start
Frontend
cd frontend
npm run dev

The frontend communicates with the backend through the API Gateway.

Deployment
Frontend

Deployed using Vercel.

React/Vite
    ↓
Vercel
Backend

Backend microservices are containerized with Docker and deployed independently using Render.

API Gateway  → Render
Auth         → Render
Chat         → Render
Agent        → Render
Payment      → Render
Database
MongoDB Atlas
Redis
Render Key Value / Valkey
Key Technical Highlights
Microservices-based backend architecture
Centralized API Gateway
Stateful AI agents with LangGraph
LangChain-based LLM workflows
Retrieval-Augmented Generation (RAG)
Redis-based rate limiting
Redis-backed authentication sessions
Firebase authentication
MongoDB Atlas cloud database
Docker containerization
RESTful API design
Cloud deployment
Temporary AI artifact storage
Environment-based configuration
Screenshots

Add screenshots of the application here:

docs/
├── dashboard.png
├── chat.png
├── agent.png
└── login.png

Example:

![Dashboard](docs/dashboard.png)
![AI Chat](docs/chat.png)
![AI Agent](docs/agent.png)
Future Improvements
Horizontal scaling of individual microservices
Persistent object storage for user-requested files
Advanced agent observability and tracing
Background job processing
Improved RAG retrieval and document management
Automated CI/CD pipelines
Production-grade Redis persistence and monitoring
