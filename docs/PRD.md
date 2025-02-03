# Product Requirements Document (PRD)

**Product Name:** HomeYum 
**Date:** February 3, 2025  
**Author:** Dallas

---

## 1. Introduction

HomeYum is a mobile application that transforms short-form cooking and recipe videos into a comprehensive meal planning and cooking experience. By combining a TikTok-style video feed with rich recipe metadata—including ingredients, nutritional information, step-by-step instructions, and meal scheduling—HomeYum empowers users to easily discover, save, and plan healthy homemade meals.

---

## 2. Purpose & Vision

### Purpose
Help users quickly discover and convert online recipe videos into actionable meal plans, reducing the time and effort involved in cooking healthy meals while cutting down on expensive takeout choices.

### Vision
Create an engaging, user-friendly platform where cooking inspiration meets efficient meal planning. Users will experience a smooth transition from watching a video to preparing a meal, complete with integrated scheduling, personalized try lists, and feedback loops that drive continuous improvement.

---

## 3. Problem Statement

### Core Problem
People often resort to expensive, unhealthy food choices due to the time and effort required to plan meals and cook at home. Although recipe videos are abundant on platforms like TikTok, users lack an easy way to translate these inspirations into a well-organized, actionable cooking plan.

### Key Pain Points
- **Time & Effort:** Planning meals and gathering recipes is time-consuming.
- **Fragmented Experience:** Recipe videos do not always provide complete details (ingredients, steps, nutrition) needed for cooking.
- **Lack of Personalization:** Users cannot easily save or schedule recipes they want to try later.

---

## 4. Goals and Success Metrics

### Goals
- Enable users to quickly capture recipe inspiration from short-form videos.
- Provide a seamless transition from recipe discovery to meal planning and execution.
- Gather and display complete recipe metadata (ingredients, nutrition, steps) to aid the cooking process.
- Create a feedback loop that helps users refine their meal choices over time.

### Success Metrics
- **Data Accuracy:** Users can reliably obtain recipe, ingredient, and nutrition info from a TikTok recipe video link.
- **Engagement:** High adoption of the video feed with active interactions (likes, dislikes, try list additions).
- **Conversion:** A significant percentage of users scheduling and preparing meals from their try lists.
- **User Feedback:** Positive ratings and feedback on the meal rating feature and overall app usability.

---

## 5. Target Audience

- **Primary Users:**  
  Health-conscious individuals and busy professionals who want to cook at home but need inspiration and a streamlined planning process.
  
- **Secondary Users:**  
  Social media-savvy food enthusiasts who enjoy short-form video content and value a platform that integrates discovery with actionable meal planning.

---

## 6. User Stories & Acceptance Criteria

### 6.1 User Authentication & Profile

#### Story 1: Sign Up / Log In  
**User Story:**  
_As a new user, I want to create an account (or log in) so that I can save my video interactions, plans, and preferences._

**Acceptance Criteria:**
- Users can sign up using email or social media.
- Secure authentication is provided with password recovery.
- Upon login, the user is redirected to the video feed.

### 6.2 Video Feed & Reactions

#### Story 2: TikTok-Style Video Feed  
**User Story:**  
_As a user, I want to see a continuously auto-playing feed of short-form cooking/recipe videos so that I can easily discover new meal ideas without manual interaction._

**Acceptance Criteria:**
- **Auto-Play and Looping:**
  - When the user opens the app, the first video in the feed starts playing automatically.
  - Videos play in full-screen (or a focused view) one at a time.
  - Once a video ends, the next video starts automatically.
- **Swipe Navigation:**
  - The user can swipe up or down to move to the next or previous video.
  - Swiping pauses the current video and loads the next video which starts playing automatically.
- **Video Information Overlay:**
  - Each video displays basic info such as the title and preview image (if available) as an overlay.
  - The overlay should be unobtrusive but accessible (e.g., semi-transparent text at the bottom or side).
- **Responsive Performance:**
  - Videos load seamlessly as the user swipes to avoid any noticeable lag.
  - Pre-loading of the next video is implemented to ensure a smooth transition.
- **Algorithmic or Chronological Ordering:**
  - The feed can be set to display videos in a chronological order (e.g., newest first) or an algorithmically determined order based on user preferences and interactions.

#### Story 3: Reacting to Videos  
**User Story:**  
_As a user, I want to react to a video by adding it to my “Try List,” liking, or disliking it so that I can keep track of recipes I want to try and express my opinion._

**Acceptance Criteria:**
- Users can “Like,” “Dislike,” or “Add to Try List” directly from the video feed.
- The reaction is saved to the user’s profile.
- Each reaction triggers a UI feedback (e.g., icon state changes).

### 6.3 Try List & Meal Planning

#### Story 4: Manage Try List  
**User Story:**  
_As a user, I want to view and manage my “Try List” so that I can plan which recipes to cook in the future._

**Acceptance Criteria:**
- Users can see all videos they’ve added to their Try List.
- Users can optionally attach a scheduled date to a recipe.
- Users can edit or remove items from the list.

#### Story 5: Schedule a Meal  
**User Story:**  
_As a user, I want to schedule a meal from my Try List so that I can plan my cooking schedule._

**Acceptance Criteria:**
- Users can select a date/time for a recipe.
- A calendar view displays scheduled meals (e.g., Today’s Plan, This Week).

### 6.4 Recipe Details and Feedback

#### Story 6: Recipe Details and Metadata  
**User Story:**  
_As a user, I want each video to have attached recipe data (ingredients, nutritional info) so that I can understand the meal composition before cooking._

**Acceptance Criteria:**
- The detailed video view includes:
  - A list of ingredients.
  - Step-by-step recipe instructions.
  - Nutritional facts (calories, macros, etc.).

#### Story 7: Rate a Meal  
**User Story:**  
_As a user, after trying a recipe, I want to rate the meal so that I can keep track of my favorites and provide feedback._

**Acceptance Criteria:**
- Users can give a rating (e.g., 1–5 stars).
- Ratings are stored and can be viewed in a “My Ratings” list.

---

## 7. App Layout & Navigation

### 7.1 Screens and Views

- **Login/Signup Screen:**  
  - User authentication via email and/or social media.
  
- **Main Tabs:**
  - **Home/Feed:**  
    - **For You (Discovery):**  
      - Auto-playing video feed with curated content.
    - **My Plan (Daily/Weekly):**  
      - Overview of scheduled meals and try list.
    - **Educate:**  
      - Educational content interspersed in the feed (e.g., cooking tips, nutritional facts).
      
  - **Meals:**  
    - **Meal Plan:**  
      - Calendar view and scheduled meal details.
    - **Try List:**  
      - A list of videos/recipes the user wants to try.
    - **Ratings/History:**  
      - **You:** Personal meal ratings and history.
      - **Friends:** Social comparison features (if enabled in later phases).
      
  - **Profile:**  
    - User settings, account details, and personalization options.

---

## 8. MVP Scope and Roadmap

### Week 1: MVP (Core Features)
- **Video Feed:**  
  - Continuous auto-playing video feed.
  - Swipe navigation with basic overlays.
  - Like, dislike, and “Add to Try List” functionalities.
- **Try List Management:**  
  - View and manage saved videos.
  - Option to attach a scheduling date.
- **Meal Scheduling:**  
  - Calendar view integration for scheduling meals.
- **Recipe Details:**  
  - Display ingredients, step-by-step instructions, and nutritional info in the detailed view.
- **User Authentication:**  
  - Sign up / log in screens with secure authentication.

### Generation AI / Data Automation Phase
- **Automated Video Data Processing:**  
  - Accept and process TikTok recipe links.
  - Auto-extract recipe details, grocery lists, costs, and nutritional data.
  
### Future Enhancements (Post-MVP)
- **Social Features:**  
  - Friend search, follow features, shared try lists, and global rating feeds.
- **Meal Plan Generation:**  
  - AI-driven meal plan suggestions based on user preferences.
- **Educational Content:**  
  - Enhanced “Educate” view with curated food education content.
- **Enhanced Feedback Loops:**  
  - Weekly recaps, refined rating feedback, and personalized recommendations.

---

## 9. Customer Journey & User Flow

1. **Discovery:**  
   - A user sees a recipe video on TikTok and is intrigued by the ease of getting complete recipe details.
2. **Onboarding:**  
   - The user is prompted to sign up/log in and try HomeYum.
3. **Engagement:**  
   - The user browses the continuously auto-playing video feed.
   - They “like” a video or add it to their Try List.
4. **Planning:**  
   - In the “My Plan” tab, the user schedules a meal by attaching a date/time to a Try List item.
5. **Cooking:**  
   - On the scheduled day, the user accesses the detailed recipe, gathers ingredients, and cooks.
6. **Feedback:**  
   - After cooking, the user rates the meal and adds personal notes.
7. **Retention:**  
   - Weekly recaps and recommendations encourage continuous engagement.

---

## 10. Success Metrics & Feedback

- **Adoption Metrics:**  
  - Number of sign-ups and active users.
  - Engagement rate with video feed (views, swipes, reactions).
- **Conversion Metrics:**  
  - Percentage of Try List items converted into scheduled meals.
  - User ratings and feedback submissions.
- **Data Accuracy:**  
  - Success rate of auto-processing TikTok links and extracting recipe details.
- **Retention Metrics:**  
  - Frequency of app use and return visits.
  - Positive user feedback in weekly recaps and surveys.

### Feedback Loop
- In-app prompts for meal rating and weekly recaps.
- A mechanism for users to provide direct feedback on features.
- Iterative updates based on user behavior analytics and qualitative insights.

---

## 11. Technical Considerations

- **Authentication:**  
  - Implement secure sign-up/log-in (email and OAuth for social media).
- **Video Playback:**  
  - Optimize auto-play functionality, preloading, and responsive transitions.
- **Backend Services:**  
  - API endpoints for recipe data, scheduling, user reactions, and automated data processing.
- **Data Integration:**  
  - Integration with external services/APIs for TikTok video link processing and AI data extraction (post-MVP).
- **Scalability:**  
  - Modular design to support additional features (e.g., social sharing, friend feeds) in future releases.

---

## 12. Out of Scope for MVP

- Advanced social features (friend following, shared meal planning).
- Full AI-driven meal plan generation (initial version supports manual scheduling).
- In-depth educational content beyond basic video interspersion.
- Detailed grocery cost breakdowns (planned for future iterations).

---

## 13. Conclusion

HomeYum aims to bridge the gap between recipe discovery and meal preparation. By addressing the core pain points—time, effort, and incomplete recipe information—the app is designed to guide users from inspiration to execution, fostering healthier cooking habits and more engaging meal planning.

This PRD outlines the MVP’s core functionalities, user flows, and technical requirements. As user feedback is gathered, subsequent iterations will enhance personalization, social interactions, and intelligent meal planning features.

**Prepared by:** Dallas 
**Review and Updates:** Scheduled quarterly based on user feedback and engagement data.
