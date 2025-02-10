# HomeYum Next Steps Product Plan

## Purpose
Transform HomeYum into a compelling video-based recipe and meal planning app. Key aspects include:
- A primary video feed focused on your own recipe videos for daily inspiration.
- A Discover tab where users can browse public recipes (videos marked public by those who upload or via external links).
- Seamless integration for importing videos from TikTok (login with TikTok) and, optionally, checking YouTube for Creative Commons content.
- In-app meal planning, including scheduling meals, recaps/reviews of past meals, and actionable suggestions for dietary improvement.
- An AI assistant chat interface to help users with recipes, meal planning, and diet insights.
- A polished, high-performance user experience with smooth transitions and intuitive navigation.

## Key Features & Priorities

### 1. Global UI & Navigation Enhancements
- **Global Plus Button:**  
  - Position a plus (“+”) button in the top right corner (using absolute positioning) on every page.
  - Purpose: Provide fast access for creating a new recipe entry or uploading a video.
- **Smooth Transitions:**  
  - Ensure a seamless link from the video feed to the detailed recipe view (the “recipe book”).
  - Maintain consistency in navigation and visual layout across different sections.

### 2. Video-Based Recipe Feed
- **Personal Recipe Feed:**  
  - Main view shows your own videos (or those you’ve imported/uploaded) with auto-play and swipe-to-navigate functionality.
- **Discover Tab:**  
  - A dedicated section to browse public recipes shared by other users.
  - Allow users to mark their own uploads as public, while linked videos remain marked as “not yours.”
  
### 3. Video Upload & External Integration
- **User Video Upload:**  
  - Allow users to upload their own cooking videos.
  - Offer an option to set the video as public or private.
- **External Video Integration:**  
  - Support linking external videos, automatically treating these as non-original content.
  - Integrate a check for YouTube Creative Commons videos when linking external sources.
- **TikTok Integration:**  
  - Enable TikTok login for importing videos from a user’s account.
  - Design a smooth onboarding flow to help users bring their prior content into HomeYum.

### 4. Meal Planning & Scheduling
- **Meal Planner:**  
  - Implement a calendar/scheduling tool to attach a date to a recipe from the Try List.
  - Create a clear view that shows “Today’s Plan” or a weekly schedule.
- **Recipe Details:**  
  - Expand the detailed recipe view to include ingredients, step-by-step instructions, and nutritional information.
  - Ensure a seamless transition from video inspiration to recipe reading.
- **Diet Recaps & Reviews:**  
  - Generate periodic recaps of past meals.
  - Provide suggestions for dietary improvements based on user input and meal history.

### 5. AI Assistant Integration
- **Chat Interface:**  
  - Integrate an AI chat assistant within the app for users to ask questions about recipes, meal plans, and diet advice.
  - Position the chat access prominently (for example, a dedicated button in the navigation).
- **Contextual Assistance:**  
  - Use AI to generate recaps or offer personalized tips based on recent meal data.
  - Ensure the AI chat can handle questions about both recipe details and meal planning.

### 6. User Experience & Performance
- **Flawless Navigation:**  
  - Provide smooth, responsive transitions (especially crucial for video playback and scene changes).
  - Pre-load videos where possible to avoid any lag or stutter.
- **Responsive, Intuitive UI:**  
  - Ensure designs are optimized for both mobile and tablet devices.
  - Conduct user testing to fine-tune layouts, button placements (like the global plus button), and other UI elements.
- **Performance Optimization & Testing:**  
  - Continuous performance monitoring and bug fixes to maintain a high level of user satisfaction.
  - Implement feedback loops (in-app surveys, rating systems) to gather real-world insights for further improvements.

## Project Roadmap & Timeline (Tentative)
- **Phase 1 (Weeks 1-2): Infrastructure & Global UI**
  - Establish the global navigation framework (including the plus button).
  - Finalize UI designs and layouts for consistent experience.
- **Phase 2 (Weeks 3-4): Video Feed & Recipe Transition**
  - Build the core video feed with auto-play and swipe navigation.
  - Develop seamless transitions from the video feed to a detailed recipe view.
- **Phase 3 (Weeks 5-6): Video Upload & External Integration**
  - Implement the video upload flow with public/private status selection.
  - Integrate TikTok login and develop initial import features.
  - Add basic support for external video links and Creative Commons verification.
- **Phase 4 (Weeks 7-8): Meal Planning & Scheduling**
  - Develop the meal scheduling/calendar view.
  - Enhance the recipe details page to include all relevant metadata.
- **Phase 5 (Weeks 9-10): AI Assistant & Advanced Features**
  - Build and integrate a functional AI chat assistant.
  - Deploy recaps/review features with actionable dietary suggestions.
- **Phase 6 (Ongoing): Optimization & UX Polish**
  - Continuously optimize performance, responsiveness, and bug fixes.
  - Address user feedback and iterate on new feature enhancements (e.g., advanced nutritional analysis).

## Success Metrics & Acceptance Criteria
- **User Engagement:**  
  - Increased activity within the video feed and Discover tab.
  - High adoption rates for scheduled meals and try list usage.
- **Data Accuracy & Integration:**  
  - Reliable extraction and presentation of recipe details from videos.
  - Seamless integration with TikTok and smooth video import process.
- **Performance & UX:**  
  - Lag-free video playback and responsive UI across devices.
  - Positive in-app feedback and high user satisfaction ratings.
- **AI Effectiveness:**  
  - High user interaction with the AI assistant resulting in better meal planning and diet improvements.

## Action Items
- Finalize and lock down UI/UX designs with a focus on the global plus button and smooth navigation.
- Develop backend endpoints to support recipe metadata aggregation, scheduling, and user profiles.
- Build integration workflows for TikTok login and external video handling.
- Prototype and test the AI chat interface for recipe and dietary queries.
- Launch internal beta tests to gather early user feedback and iterate accordingly.

## Conclusion
This plan maps out the journey to evolve HomeYum into a video-based recipe and meal planning powerhouse. With a prioritized focus on UI enhancements, robust video handling, and AI-driven features, the aim is to deliver a seamless, engaging, and valuable user experience that guides users from recipe inspiration to meal execution.