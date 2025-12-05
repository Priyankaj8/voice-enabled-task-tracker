# Voice-Enabled Task Tracker

A full-stack task management application inspired by tools like Linear, enhanced with voice-based task creation. Users can speak naturally, and the system extracts structured task fields such as title, priority, due date, and status.

---

## Features

- **Voice Input**: Speak to create tasks using AssemblyAI
- **Task Management**: Create, edit, delete tasks
- **Two Views**: Kanban board with drag-and-drop + List view
- **Filters**: Search and filter by status/priority
- **Smart Parsing**: Natural language date support ("tomorrow", "next Monday")
  
---

## 1. Project Setup

### a. Prerequisites

Before running the project, install:

| Tool | Version |
|------|---------|
| Node.js | v23.5.0 |
| MongoDB | Any local or Atlas DB |
| AssemblyAI API Key | Required for voice parsing |

### b. Install Steps

#### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGODB_URI=your_mongodb_url
ASSEMBLYAI_API_KEY=your_api_key
PORT=5000
```

Start the backend:

```bash
npm start
```

#### Frontend Setup

```bash
cd frontend
npm install
```

Start React app:

```bash
npm start
```

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`

### c. Running Everything Locally

1. Start MongoDB locally or use MongoDB Atlas
2. Start backend:
   ```bash
   cd backend
   npm start
   ```
3. Start frontend:
   ```bash
   cd frontend
   npm start
   ```
4. Open browser → `http://localhost:3000`

---

## 2. Tech Stack

### Frontend
- **React**
- **Redux Toolkit**
- **TailwindCSS**
- **@hello-pangea/dnd** (drag & drop)
- **Axios**
- **lucide-react** (icons)

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **AssemblyAI SDK**
- **Multer** (audio upload support)
- **chrono-node** (date parsing)

### AI Provider
- **AssemblyAI** for speech-to-text
- **chrono-node** for natural language date parsing

### Tools
- ChatGPT
- Claude

---

## 3. API Documentation

### GET `/api/tasks`

**Retrieve all tasks**

Supports filtering:
```
/api/tasks?status=In%20Progress&priority=High&search=review
```

**Response:**
```json
[
  {
    "_id": "123",
    "title": "Review PR",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2025-01-20T00:00:00.000Z",
    "description": "Check security implementation"
  }
]
```

---

### POST `/api/tasks`

**Create a new task**

**Request Body:**
```json
{
  "title": "Review project",
  "description": "Go through full report",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2025-01-20"
}
```

**Response:**
```json
{
  "_id": "456",
  "title": "Review project",
  "priority": "High",
  "status": "To Do",
  "createdAt": "2025-03-10T12:00:00.000Z"
}
```

---

### PUT `/api/tasks/:id`

**Update an existing task**

**Request Body:**
```json
{
  "status": "Done"
}
```

**Response:**
```json
{
  "_id": "456",
  "title": "Review project",
  "status": "Done"
}
```

---

### DELETE `/api/tasks/:id`

**Delete a task**

**Response:**
```json
{
  "message": "Task deleted"
}
```

---

### POST `/api/parse`

**Parse voice transcript into structured task data**

**Request:**
```json
{
  "transcript": "Create a high priority task to review code by tomorrow"
}
```

**Response:**
```json
{
  "transcript": "Create a high priority task to review code by tomorrow",
  "parsed": {
    "title": "Review code",
    "priority": "High",
    "dueDate": "2025-03-10T00:00:00.000Z",
    "status": "To Do",
    "description": ""
  }
}
```

---

### POST `/api/transcribe`

**Transcribe audio to text using AssemblyAI**

**Request:**
- Form-data with `audio` file (audio/webm, audio/mp3, etc.)

**Response:**
```json
{
  "transcript": "Create a high priority task to review code by tomorrow"
}
```

---

## 4. Decisions & Assumptions

### Architecture
- Backend follows modular structure:
  - `routes/` for REST endpoints
  - `models/` for MongoDB schema
  - `services/` for parsing logic
  - `middleware/` for error handling

### Voice Parsing
- Used **chrono-node** for natural language date extraction
- Simple regex + keyword matching for priority and status detection
- Default status = "To Do"
- Priority keywords: "urgent", "critical", "high priority" → High
- Priority keywords: "low priority" → Low
- Default priority = "Medium"

### Assumptions
- Single-user application (no authentication required)
- Assignment does not require email workflows
- Speech recognition handled by browser's Web Speech API (Chrome/Edge)
- AssemblyAI used as third-party speech-to-text service
- Tasks persist in MongoDB
- Drag & drop updates task status immediately

---

## 5. AI Tools Usage

### ChatGPT helped with:

#### 1. Debugging Backend Errors
- Fixing AssemblyAI integration issues
- Resolving "LeMUR access denied"
- Solving MongoDB connection problems
- Fixing parser errors & API failures
- Debugging 500 / missing transcript errors

#### 2. Improving Code Architecture
- Folder structure improvements
- Modularizing backend services
- Adding meaningful separation of concerns
- Implementing error handling middleware

#### 3. README + Documentation
- Writing this README
- Summarizing backend & frontend design
- Documenting assumptions & decisions

### Claude assisted with:
- Improving backend architecture
- Refactoring main modules for clarity
- Debugging frontend React components
- Implementing Redux store structure

### What They Helped With:
- **Boilerplate code**: Initial Express server setup, React component structure
- **Debugging**: Fixing CORS issues, MongoDB connection errors, API endpoint failures
- **Design**: Suggesting modular architecture, component organization
- **Parsing ideas**: Natural language date parsing with chrono-node
- **Error handling**: Implementing try-catch blocks, proper HTTP status codes

### Notable Prompts:
- "How to integrate AssemblyAI for speech-to-text in Node.js?"
- "Parse natural language dates like 'tomorrow' and 'next Monday' in JavaScript"
- "Fix MongoDB 'buffering timed out' error"
- "How to prevent form submission in React without using <form> tags?"

### What I Learned:
- How to integrate third-party APIs (AssemblyAI) with proper error handling
- Natural language processing basics with chrono-node
- Implementing drag-and-drop with @hello-pangea/dnd
- Structuring full-stack applications with modular architecture
- Managing state with Redux Toolkit
- Proper REST API design patterns

---

## Author

**Priyanka J**  
Voice-Enabled Task Tracker
---

- React, Redux, and Express communities for excellent documentation
