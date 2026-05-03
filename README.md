# SysCtrl: Enterprise Task Architecture

SysCtrl is a highly optimized, full-stack operational dashboard built to facilitate high-velocity team coordination. Designed with a dark cyber-aesthetic, it moves away from generic, overly-bright interfaces to provide a low-strain, high-contrast command center for engineering and product teams.

## Core Capabilities

- **Secure Operations Center**: JWT-backed authentication ensuring isolation of organizational data.
- **Hierarchical Access Protocol**: 
  - Administrative accounts possess full operational rights (project deployment, task delegation).
  - Member accounts operate strictly within assigned parameters.
- **Real-Time Kanban Matrix**: Drag-and-drop enabled state machines for tracking issue progression across the development lifecycle.
- **Metrics Telemetry**: The main dashboard aggregates live statistics across all active operations for instant productivity analysis.

## Technical Infrastructure

The system is deployed using a decoupled MERN architecture:

### Client Application
- Framework: React 18 + Vite for high-speed module replacement
- Styling Engine: TailwindCSS using a custom dark-mode design system with neon UI tokens
- Motion: Framer-Motion for non-blocking UI state transitions
- Icons: Lucide React

### Server API
- Environment: Node.js / Express runtime
- Persistence: MongoDB via Mongoose ODM
- Security: Custom JWT middleware protecting all protected endpoints

## Local Deployment Guide

To initialize the SysCtrl environment locally, ensure you have Node.js (v18+) and an active MongoDB URI.

### 1. Initialize API Server

Navigate to the `backend` directory to establish the server:

```bash
cd backend
npm install
```

Configure your environment variables inside `backend/.env`:
```
PORT=5000
MONGO_URI=your_cluster_uri
JWT_SECRET=your_secure_hash
```

Boot the server:
```bash
npm run dev
```

### 2. Initialize Client Interface

In a separate terminal session, navigate to the client application:

```bash
cd frontend
npm install
```

Map the client to the API via `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Launch the interface:
```bash
npm run dev
```

The system will now be accessible via your local loopback at port 5173.
