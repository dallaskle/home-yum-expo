# Project Development Documentation

This document outlines the current practices, strategies, and overall development approach for the project. Use it as a reference when building or modifying the app.

---

## Initial Development Practices

- **PRD Reference**
  - An initial PRD is created and stored in the repository.
  - It is referenced frequently during development.
  - **Note:** The PRD is not updated or supplemented with further documentation as development progresses.

- **Database Types**
  - A `database.types.ts` file maintains types for all database schemas.
  - These types are attached to nearly every request.

- **Commit Strategy**
  - Commits are made after nearly every agent request (e.g., "part 1", "part 2", etc.).
  - **Process:**
    - Make a request.
    - User tests it.
    - If it works, commit the change.
    - If not, try 2–3 times to adjust or discard changes and then issue a more specific/different request.

- **Frontend Testing**
  - No frontend testing has been implemented to date.

- **Frontend Structure**
  - The frontend is organized into feature folders containing:
    - `api`
    - `components`
    - `pages`
    - `stores`
  - This structure has helped prevent regression issues.

- **Database Communication & Edge Functions**
  - **Initial Phase:** All database communication was handled in frontend API files using fully public tables.
  - **Current Phase:** Business logic and database communication have been moved to edge functions, and the tables have been locked down.
    - Approximately 43 edge functions were created.
    - Each edge function was implemented and tested individually.
  - **Additional Testing:** Backend/edge function tests are created post-development, with some gaps filled manually.

- **Overall File Awareness**
  - There is a general understanding of the purpose of each file.
  - However, there isn't a detailed breakdown of what every file does.

---

## Development Approach

### New Development Strategy

1. **Planning & Prototyping**
   - Allocate sufficient time to plan and understand what you're building.
   - Create one or two prototypes (15–60 minutes each) focusing on the core functionality.
     - Validate the core idea.
     - Explore aspects like cursor usage.
     - Brainstorm ideas.
   - **Note:** Avoid extras such as authentication or settings during prototyping—these can be added later since a restart is anticipated.

2. **Backend Data Model**
   - Ensure a solid understanding of the required backend data model before diving into frontend development.

3. **Frontend Development with Client-Side Handling**
   - Begin with the frontend handling **all** database calls on the client side.
   - Initially:
     - Use public database and storage.
     - Do not implement RLS (Row-Level Security).
   - **Important:** Centralize all Firebase/DB communication in dedicated `{folder}.api` files.
     - This consolidation facilitates a smoother transition to backend handling (e.g., moving logic via cursor) once the approach is solidified.

4. **Page-Based API Calls**
   - When the frontend is nearing completion:
     - Implement page-specific API calls for single-rendering pages.
     - Consolidate API calls to reduce excessive state re-rendering.
     - Consider having an external review (e.g., by O1) to analyze and provide recommendations on these API calls.

5. **Overall Flow**
   - **Sequence:** Core Idea → Data Models → Frontend (client ↔ DB) → API Layer → Backend

---

## Frontend Structure

- **Feature Folders**
  - Each feature folder contains the following sub-folders:

  - **`api` Folder**
    - Contains all communication logic with the database.
    - **Goal:** Ensure this is the sole point of contact with Firebase to simplify the switch from frontend to backend logic later.

  - **`components` Folder**
    - Houses display elements.
    - Uses a single `useEffect` to fetch data through the store.
    - Manages component state.

  - **`pages` Folder**
    - Comprises display components.
    - Contains `useEffect` hooks for fetching page-specific data.

  - **`store` (Using Zustand)**
    - Holds all application data.
    - Manages API function calls.
    - Handles loading states.

---

## Backend Structure

- **Framework:** FastAPI

- **Components:**
  - **Router/Controller File**
    - Combines routing and controller logic into one file.
  - **Service File**
    - Contains the core business logic.
  - **Test File**
    - Tests the service logic to ensure reliability.

- **Authentication & Database:**
  - **Firebase Authentication**
    - Utilized for user authentication and authorization.
    - Integrates seamlessly with the frontend for secure access.
  - **Firebase Firestore**
    - Used as the primary database.
    - Ensures real-time data synchronization and scalability.
    - All database interactions are managed through Firebase SDKs.

---

*This document is intended to serve as a high-level reference for the project's current development processes and should be updated as practices evolve.*
