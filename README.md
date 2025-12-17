# RAG News QA API

A backend-only Retrieval-Augmented Generation (RAG) system for answering news-related queries using Node.js, PostgreSQL, Redis, and the Gemini API. The API ingests news articles, stores them in a vector store, and uses semantic search plus an LLM to generate contextual answers. Chat history and sessions are persisted for analytics and debugging.

High-level flow:  
**Ingest → Vector Embeddings → Vector DB → Gemini / Mock Gemini → Chat Logs & History**

-----

## 1. Project Overview

This project exposes a REST API that allows a client (Postman, frontend, or any HTTP client) to:

- Ingest news articles and embed them into a vector store.
- Ask questions about the ingested news using a RAG pipeline.
- Persist chat sessions and responses in PostgreSQL.
- Retrieve and manage per-session chat history.

The focus is on the backend architecture and RAG pipeline, not on a GUI or frontend. All interactions are demonstrated via Postman and a short demo video.

-----

## 2. Objectives

- **Backend-only RAG system**  
  Build a clean, production-style backend that can ingest documents, search them via embeddings, and generate answers using an LLM.

- **Persistent sessions & chat history**  
  Store every query, answer, response time, and session in PostgreSQL to enable analytics and debugging.

- **Well-structured REST API**  
  Provide simple, well-documented endpoints that can be tested via Postman and easily integrated into any future frontend.

-----

## 3. Tech Stack

- **Runtime & Framework**
  - Node.js
  - Express

- **Data & Storage**
  - PostgreSQL (primary database)
  - pgAdmin (database UI)
  - Redis (session cache)
  - In-memory vector store (cosine similarity for semantic search)

- **LLM & RAG**
  - Google Gemini API (or mock Gemini service when quota is exceeded)
  - Custom embedding service (using Gemini embeddings or mock embeddings)

- **DevOps & Tooling**
  - Docker & Docker Compose (API + Postgres + Redis + pgAdmin)
  - Postman (API testing, `postman-collection.json` included)

-----

## 4. System Architecture

**Main components**

- **`ingestController` + `ragService`**
  - Responsible for ingesting news articles.
  - Generates embeddings, stores them in the in-memory vector store, and records metadata in `ingested_articles`.

- **`chatController` + `ragService` + `geminiService`**
  - Handles chat requests.
  - Uses `ragService` to perform vector search and build context.
  - Uses `geminiService` (real Gemini or mock) to generate an answer.
  - Saves query, answer, and response time into `chat_logs`.

- **`historyController`**
  - Exposes endpoints to fetch and delete chat history by `sessionId`.

- **Database tables**
  - `chat_sessions` – stores each session UUID and last activity.
  - `chat_logs` – stores each query, answer, response time, and timestamp.
  - `ingested_articles` – stores ingested articles metadata.

You can include an architecture diagram in the repo (draw.io / PowerPoint) showing:

`Client (Postman) → Express API → RAG Service → {Vector Store + Gemini} → PostgreSQL + Redis`

-----

## 5. API Design

### 5.1 Health Check

**Method:** `GET`  
**URL:** `/api/health`  

**Description:** Simple health check to confirm the API is running.

**Sample Response:**

{
"success": true,
"message": "API is running"
}


-----

### 5.2 Create Session

**Method:** `POST`  
**URL:** `/api/session`  

**Description:** Create a new chat session and return a `sessionId` (UUID). This `sessionId` must be used in all chat requests.

**Request Body:** _none_

**Sample Response:**

{
"success": true,
"sessionId": "33c86ca5-181d-4f17-b083-6cbef28eb44f",
"message": "Session created successfully"
}

------

### 5.3 Ingest Articles

**Method:** `POST`  
**URL:** `/api/ingest`  

**Description:** Ingests a set of news articles into the RAG pipeline. Generates embeddings, stores them in the vector store, and writes metadata into `ingested_articles`.

**Request Body (optional):**

{
 "articles": [
   {
    "title": "AI in Healthcare",
    "content": "Artificial intelligence is transforming   healthcare...",
    "source": "TechNews"
   }
     ]
}

If `articles` is omitted, a default `newsData` set from the backend is ingested.

**Sample Response:**

{
"success": true,
"message": "Successfully ingested 50 articles",
"count": 50
}


-----

### 5.4 Chat

**Method:** `POST`  
**URL:** `/api/chat`  

**Description:** Main RAG endpoint. Takes a `sessionId` and `query`, retrieves relevant documents, calls Gemini (or mock), logs the result to `chat_logs`, and returns the answer with top sources.

**Request Body:**

{
"sessionId": "33c86ca5-181d-4f17-b083-6cbef28eb44f",
"query": "What are the latest updates in AI?"
}


**Sample Response:**

{
 "success": true,
 "sessionId": "33c86ca5-181d-4f17-b083-6cbef28eb44f",
 "query": "What are the latest updates in AI?",
 "answer": "Based on the provided news articles, here are the latest updates in AI: ...",
 "sources": [
   {
   "title": "AI Revolution in Healthcare",
   "content": "Artificial intelligence is transforming healthcare...",
   "source": "TechNews Daily"
   }
 ],
 "responseTimeMs": 8270,
 "retrievedCount": 5
}


-----

### 5.5 Get History

**Method:** `GET`  
**URL:** `/api/history/:sessionId`  

**Description:** Returns the chat history for a given `sessionId` from `chat_logs`.

**Sample Response:**

{
  "success": true,
  "sessionId": "33c86ca5-181d-4f17-b083-6cbef28eb44f",
  "history": [
   {
    "user_query": "What is machine learning?",
    "llm_response": "Machine learning is a field that uses...",
    "response_time_ms": 6232,
    "created_at": "2025-12-17T06:01:32.006Z"
   }
 ],
   "total": 1
}


If there is no history, `history` will be `[]` and `total` will be `0`.

-----

### 5.6 Delete History

**Method:** `DELETE`  
**URL:** `/api/history/:sessionId`  

**Description:** Deletes all chat logs for a given `sessionId` from `chat_logs`.

**Sample Response:**

{
"success": true,
"message": "History deleted successfully",
"sessionId": "33c86ca5-181d-4f17-b083-6cbef28eb44f"
}


-----

## 6. Data Flow

### 6.1 Ingest Flow

1. Client calls `POST /api/ingest` with articles or uses default dataset.
2. `ingestController` passes articles to `ragService.ingestNewsArticles`.
3. `ragService`:
   - Builds text from `title + content`.
   - Calls `embeddingService.generateBatchEmbeddings`.
   - Stores `[document, embedding]` in the in-memory vector store.
   - Inserts article metadata into `ingested_articles`.

### 6.2 Query (Chat) Flow

1. Client calls `POST /api/chat` with `{ sessionId, query }`.
2. `chatController`:
   - Validates input.
   - Calls `ragService.answerQuery(sessionId, query, topK)`.
3. `ragService.answerQuery`:
   - Generates an embedding for the query.
   - Retrieves top-K similar documents from vector store.
   - Builds a context prompt and calls `geminiService.generateResponse`.
   - Returns `{ answer, sources, responseTimeMs }`.
4. `chatController`:
   - Inserts one row into `chat_logs` with session, query, answer, response time.
   - Updates Redis cache for that session.
   - Responds to client with answer + sources.
5. **Rate Limiting:**
   - A global rate limiter restricts each IP to 100 requests per 15 minutes.
   - A stricter `chatLimiter` restricts `/api/chat` to 10 requests per minute per IP to prevent abuse and protect the external LLM.

### 6.3 History Flow

1. Client calls `GET /api/history/:sessionId`.
2. `historyController` queries `chat_logs` for that session and returns rows in reverse chronological order.

-----

## 7. Setup & Run Instructions

### 7.1 Prerequisites

- Docker and Docker Compose installed.
- (Optional) Node.js and npm/yarn if you want to run without Docker.
- A Gemini API key (optional if using mock Gemini).

### 7.2 Environment Variables

Copy `.env.example` to `.env` and fill values:

NODE_ENV=production
PORT=3000

DB_HOST=postgres # inside Docker network
DB_PORT=5432
DB_NAME=rag_news_db
DB_USER=postgres
DB_PASSWORD=put your db password 

REDIS_HOST=redis
REDIS_PORT=6379

GEMINI_API_KEY=YOUR_KEY_HERE # or leave and use mock


For pgAdmin / host connections you may expose Postgres via a port mapping (e.g. `5433:5432`), but inside the Docker network the host is `postgres`.

### 7.3 Run with Docker (recommended)

1. Clone the repository
git clone https://github.com/Abhrajyotipatra/rag-news-api-proj
cd rag-news-api

2. Create .env file
cp .env.example .env
Edit .env and fill DB_PASSWORD, GEMINI_API_KEY, etc.

3. Build and start all services
docker-compose up -d --build

4. Check logs to make sure everything started correctly
docker logs rag_api --tail=50


You should see messages like:

-  Database connected`
-  Vector DB initialized`
-  Server running on port 3000`

### 7.4 Test with Postman

1. Import `postman-collection.json` from the repo into Postman.
2. Hit the endpoints in this order:

   1. `POST /api/session` – copy the `sessionId`.
   2. `POST /api/ingest` – ingest sample articles.
   3. `POST /api/chat` – use the `sessionId` and a query (e.g., “What is machine learning?”).
   4. `GET /api/history/:sessionId` – confirm logs are stored.
   5. (Optional) `DELETE /api/history/:sessionId`.

3. Optionally, open pgAdmin and view `chat_logs` to see rows.

-----

## 8. Problems Faced & Solutions

### 8.1 Gemini Quota & 429 / 503 Errors

- **Problem:**  
  The free tier of Gemini quickly hit rate or quota limits, causing 429/503 errors and 500 responses from the API.
- **Why:**  
  Free-tier tokens and requests are limited, and the model can be temporarily overloaded.
- **Solution:**  
  Added a **mock Gemini service** that can be used when the real API is not available. Separated the RAG logic from logging so the system remains testable even without live Gemini. This allowed the RAG pipeline and history logging to be fully verified without incurring billing or relying on external availability.

### 8.2 Duplicate / Missing Chat History

- **Problem:**  
  Some queries appeared twice in history, and behavior was confusing when checking `GET /history`.
- **Why:**  
  Both `ragService.answerQuery` and `chatController.chat` were inserting into `chat_logs`, causing duplicate rows. In some refactors, inserts happened inconsistently.
- **Solution:**  
  Removed all database insert logic from `ragService`. Now **only `chatController`** performs the `INSERT INTO chat_logs`. `ragService` is responsible purely for RAG logic (embeddings + retrieval + generation), which simplified debugging and eliminated duplicates.

### 8.3 PostgreSQL vs pgAdmin Confusion

- **Problem:**  
  `rag_news_db` was visible from inside the Docker container via `psql`, but not visible or connectable in pgAdmin. Errors like “database does not exist” appeared.
- **Why:**  
  pgAdmin was connected to a **host** Postgres on `localhost:5432`, not the **container** Postgres (`rag_postgres`). They are separate instances, so one had `rag_news_db` and the other did not.
- **Solution:**  
  Exposed the container Postgres on a different host port (e.g. `5433:5432`) or connected pgAdmin to the container IP directly. Then configured pgAdmin to connect to `localhost:5433` (or the container IP) with `rag_news_db` as the maintenance database. After that, tables like `chat_logs` became visible and editable.

### 8.4 Vector Store & Embeddings

- **Problem:**  
  Need a simple but reliable semantic search without integrating a heavy external vector database.
- **Why:**  
  This project focuses on backend design and RAG logic, not infrastructure complexity.
- **Solution:**  
  Implemented an **in-memory vector store** using cosine similarity. Ensured all embeddings have consistent dimensions and handled the case where retrieval returns zero documents (Gemini is informed that context is empty and should respond accordingly). This keeps the system easy to run and affordable for demos.

-----

## 9. Testing

- **Postman Collection**  
  The repository includes `postman-collection.json` with all endpoints and example requests. It is used to systematically test:
  - Session creation
  - Ingestion
  - Chat pipeline
  - History retrieval and deletion
  - Health check

- **Manual Tests**
  - Multiple sessions tested to ensure history is isolated by `sessionId`.
  - Verified that responses are logged with realistic `response_time_ms`.
  - Confirmed that when no context is available, the model or mock responds with a polite “no relevant articles” message.

- **Screenshots**
  - Screenshots of successful `/api/chat` and `/api/history/:sessionId` responses and pgAdmin views of `chat_logs` can be added to a `docs/` folder or the report.

-----

## 10. Future Work

- **Frontend Dashboard (Optional)**
  - Build a small React or Next.js frontend to visualize sessions, history, and sources.
  - Add filters, charts (response times, number of queries per session), and interactive exploration of retrieved documents.

- **Production Vector Store**
  - Replace the in-memory vector store with a persistent solution such as:
    - pgvector (vector extension inside PostgreSQL),
    - Pinecone,
    - Qdrant, Weaviate, or Milvus.

- **Cloud Deployment**
  - Deploy the API to Render, Railway, or a VPS.
  - Use hosted PostgreSQL and Redis.
  - Secure the API with HTTPS and simple authentication.
  - Optionally, expose only selected endpoints for public use.

---

This README is meant to serve both as documentation for evaluators and as a practical guide for anyone who wants to clone and run the project on their own machine.
