
Pulse
A Real-Time Polling & Decision-Making App

Problem Statement

Making quick group decisions, such as choosing a time to meet or a place to eat, often becomes disorganized and difficult to track in messy chat threads. Pulse aims to solve this by providing a clean, centralized, and shareable platform for users to instantly create polls and gather structured feedback.

System Architecture

The project will follow a decoupled architecture: Frontend → Backend (API) → Database.
Frontend: Next.js (React) with TypeScript
Backend: Node.js + Express.js with TypeScript
Database: MySQL (relational)
Authentication: JWT-based login and registration
Hosting:
Frontend → Vercel
Backend → Render
Database → Railway or PlanetScale

Key Features

Category
Features
Authentication & Authorization
• User registration, login, and logout using a self-built JWT-based system. 
• Users can only delete the polls that they have created.
CRUD Operations
• Authenticated users can Create, Read, and Delete their own polls. 
• Authenticated users can Vote on any poll (Create operation on a Vote record). • Authenticated users can Retract their vote (Delete operation on a Vote record).
Filtering, Searching, Sorting, Pagination
A dedicated /dashboard page where users manage polls:     
• Searching: Users can search their created polls by the poll question text.     
• Filtering: The search functionality acts as the primary filter for the list.     
• Sorting: Users can sort their created polls by createdAt date (Newest First / Oldest First).     
• Pagination: Poll lists (both "My Polls" and "Voted On") will be paginated, displaying a limited number of items per page (e.g., 10) with controls to navigate between pages.
Dynamic Data Fetching
• The poll results page will dynamically update by automatically re-fetching data every few seconds (short polling) to provide a near real-time voting experience.
Frontend Routing
• Pages will include: Homepage (/), Login (/login), Signup (/signup), Dashboard (/dashboard), Create Poll (/create), Profile (/profile), and the dynamic Poll page (/polls/:id).
Hosting
• The frontend and backend will be deployed to separate, publicly accessible URLs.
Social Login (Stretch Goal)
• (If time permits) Implement "Sign in with Google" (OAuth 2.0) as an alternative login method to allow for one-click user registration.


Tech Stack

Layer
Technologies
Frontend
React.js (Next.js), TypeScript, Axios, Shadcn/UI (with TailwindCSS)
Backend
Node.js, Express.js, TypeScript, Prisma, Zod
Database
MySQL
Authentication
JWT (JSON Web Tokens), bcrypt
Hosting
Vercel, Render, PlanetScale


API Overview

Endpoint
Method
Description
Access
/api/auth/signup
POST
Register a new user.
Public
/api/auth/login
POST
Authenticate a user and return a JWT.
Public
/api/users/me
GET
Get the profile of the currently logged-in user.
Authenticated
/api/polls
POST
Create a new poll.
Authenticated
/api/polls
GET
Get polls created by the user, supporting search, sorting (by createdAt), and pagination.
Authenticated
/api/polls/:id
GET
Get a single poll's data.
Public
/api/polls/:id
DELETE
Delete a poll created by the user.
Authenticated (Owner)
/api/votes
POST
Cast a vote for an option.
Authenticated
/api/votes/:pollId
DELETE
Retract a vote from a specific poll.
Authenticated


