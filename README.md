# **Pulse**
### *A Real-Time Polling & Decision-Making App*

Pulse helps groups make fast, organized decisions without messy chat threads.  
Create polls instantly, share links, and collect structured feedback in real time.

---

## 🚀 **Hosted URLs**
| Service | URL |
|--------|-----|
| **Frontend (Vercel)** | https://pulse-front-end-sigma.vercel.app |
| **Backend (Render)** | https://pulsebackend-mn4p.onrender.com |
| **Backend GitHub Repo** | https://github.com/Crunchymon/PulseBackend |

---

## 🧩 **Problem Statement**

Coordinating group decisions — such as picking a meeting time or deciding where to eat — often becomes chaotic in chat apps. Information gets buried, votes get missed, and decisions take longer than necessary.

**Pulse solves this problem** by offering a simple, centralized, and shareable platform where users can create polls and collect responses instantly.

---

## 🏛️ **System Architecture**

Pulse follows a fully decoupled architecture: **Frontend → Backend (API) → Database**

### **Tech Breakdown**
- **Frontend:** Next.js (React), TypeScript, TailwindCSS, Shadcn/UI, @react-oauth/google
- **Backend:** Node.js, Express.js, TypeScript, Prisma, Zod, google-auth-library
- **Database:** MySQL  
- **Authentication:** JWT + bcrypt + Google OAuth 2.0
- **Hosting:** - Frontend → Vercel  
  - Backend → Render  
  - Database → PlanetScale / Railway  

---

## ✨ **Key Features**

### 🔐 **Authentication & Authorization**
- **Google OAuth 2.0:** One-click secure login and signup with Google.
- **Custom Auth:** Email/password signup & login using custom **JWT-based auth**.
- **Security:** Secure password hashing using **bcrypt** and protected routes via JWT verification.

---

### 🗳️ **Poll Management (CRUD)**
- **Create**, **read**, **update**,and **delete** polls (only by the owner).
- Users can:
  - **Vote** on any poll.
  - **Retract** their vote.
- Full validation on poll creation & voting (Zod).

---

### 🔍 **Dashboard: Search, Filter, Sort & Pagination**
Accessible via `/dashboard`.

| Feature | Description |
|--------|-------------|
| **Search** | Search polls by question text |
| **Filter** | Search input acts as the main filter |
| **Sort** | Sort by creation date (Newest → Oldest or reverse) |
| **Pagination** | 10 polls per page with navigation controls |

Supports:
- **My Polls**
- **Polls I Voted On**

---

### 🔄 **Real-Time Experience (Short Polling)**
- The poll details page auto-refreshes every few seconds.
- Provides a near real-time view of vote count updates.

---

### 🧭 **Frontend Routing**
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/login` | Login (Custom + Google) |
| `/signup` | Signup (Custom + Google) |
| `/dashboard` | Manage polls |
| `/create` | Create a new poll |
| `/profile` | User profile |
| `/polls/:id` | Poll details page |

---

## 🧰 **Tech Stack Overview**

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js, React, TypeScript, Axios, TailwindCSS, Shadcn/UI |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, Zod |
| **Database** | MySQL |
| **Auth** | JWT, bcrypt, **Google OAuth 2.0** |
| **Hosting** | Vercel (FE), Render (BE), PlanetScale/Railway (DB) |

---

## 📡 **API Overview**

### **Auth Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Login & receive JWT | Public |
| `/api/auth/google` | POST | **Authenticate via Google** | Public |

---

### **User Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/users/me` | GET | Get current user profile | Authenticated |
| `/api/users/me` | PATCH | Update user profile (Name) | Authenticated |

---

### **Poll Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/polls` | POST | Create a new poll | Authenticated |
| `/api/polls` | GET | Get user-created polls (with search, sort, pagination) | Authenticated |
| `/api/polls/:id` | GET | Get poll details | Public |
| `/api/polls/:id` | PATCH | Edit poll question | Authenticated (Owner Only) |
| `/api/polls/:id` | DELETE | Delete your own poll | Authenticated (Owner Only) |

---

### **Voting Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/votes` | POST | Cast a vote | Authenticated |
| `/api/votes/:pollId` | DELETE | Retract a vote | Authenticated |

---

## 🎯 **Conclusion**

Pulse delivers a clean, fast, and efficient way for groups to make decisions with real-time feedback.  
Its decoupled architecture makes it scalable, maintainable, and ideal for modern applications.