# Ascent

Reach new heights with Ascent. Track your skill mastery journey, compete with friends on the leaderboard, and visualize your progress as you climb the mountain to expertise - all in one place!

## Story

Ascent transforms learning into an adventure. Every skill you master is a peak conquered, every step completed brings you closer to the summit. Watch your goat companion climb the mountain as you progress, see where your friends are on the same path, and celebrate your achievements as you reach new heights of knowledge.

## Inspiration

We were inspired by gamified learning platforms that make education engaging and social fitness apps like Strava that track progress and foster friendly competition. We wanted to create a platform that combines the visual satisfaction of progress tracking with the motivation of social learning and competition. The mountain theme represents the journey of learning - challenging, rewarding, and always moving upward.

## What it does

Ascent is a comprehensive skill mastery platform that focuses on three core principles: **Visualize**, **Connect**, and **Compete**.

**Visualize**: Ascent's visualization characteristic transforms abstract learning progress into tangible, beautiful mountain climbs. Every skill becomes a mountain, every step a point on the trail, and your progress is represented by a goat climber ascending toward the peak. Key features include:

- **Mountain Progress Visualization**: Watch your goat companion climb the mountain as you complete steps. The visualization shows your exact progress percentage, completed steps, and the path ahead.
- **Progress Analytics Dashboard**: Comprehensive analytics showing time spent per skill, learning velocity over time, 30-day completion trends, and personalized insights about your learning patterns.
- **Skill Timeline View**: See your entire learning journey laid out chronologically, celebrating milestones and achievements along the way.
- **Day/Night Cycle**: A beautiful ambient day/night cycle that creates an immersive learning environment, with the sun and moon moving across the sky as you learn.

**Connect**: Connection is at the heart of Ascent. Learning is better together, and our platform makes it easy to see what your friends are learning and how they're progressing:

- **Friend Ghost Tracking**: See your friends' progress on shared skills as ghost emojis (👻) alongside your goat on the mountain path. Hover to see their current step and last activity time.
- **Friends on Path**: View which friends are learning the same skills as you, making it easy to connect and discuss your learning journey.
- **Profile Viewing**: Visit your friends' profiles to see their completed skills, current learning paths, and achievements (if their account is public).
- **Social Feed**: Stay updated on your friends' progress, completions, and achievements in a dedicated feed.

**Compete**: Friendly competition drives motivation. Ascent makes learning competitive in the best way:

- **Leaderboard System**: Compare yourself to friends or the entire community. Filter by category, see rankings based on skills mastered and completion speed, and track your position as you climb the ranks.
- **Achievements & Streaks**: Unlock achievements as you complete skills and maintain daily learning streaks. Celebrate your milestones with special animations and badges.
- **Ranking Metrics**: See how you stack up with metrics like total skills completed, average days to complete, and learning velocity.

## Additional Features

- **Multi-Language Support**: Full internationalization with English and Spanish support, making Ascent accessible to a global audience.
- **Code Playgrounds**: Built-in coding playgrounds for programming-related skills, allowing you to practice directly in the platform.
- **Custom Roadmaps**: Create and publish your own skill roadmaps for the community, or follow expertly crafted paths.
- **Privacy Controls**: Control who can see your profile and progress with public/private account settings.
- **Floating Particles**: Beautiful ambient particles that create an immersive, dynamic learning environment.
- **Reset Progress**: Easily reset your progress on any skill to start fresh or practice again.

## How we built it

**Frontend:**
- **React**: Modern frontend framework for building interactive user interfaces
- **Framer Motion**: Smooth animations and transitions throughout the platform
- **React Router**: Client-side routing for seamless navigation
- **i18next**: Internationalization framework for multi-language support
- **CSS3**: Custom styling with glass morphism effects and mountain-themed design

**Backend:**
- **Node.js**: JavaScript runtime for server-side operations
- **Express.js**: Fast, minimalist web framework for building RESTful APIs
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling for Node.js
- **JWT**: Secure authentication with JSON Web Tokens
- **bcryptjs**: Password hashing for secure user authentication

**Infrastructure:**
- **Docker**: Containerization for consistent development and deployment
- **Docker Compose**: Orchestration for multi-container applications
- **CORS**: Cross-origin resource sharing for API access
- **Helmet**: Security middleware for Express applications
- **Rate Limiting**: Protection against API abuse

## Challenges we ran into

- **Complex State Management**: Managing progress tracking across multiple components and ensuring data consistency between frontend and backend
- **Mountain Visualization**: Creating a smooth, accurate mountain path visualization that correctly represents progress and handles edge cases
- **Friend Progress Tracking**: Implementing real-time friend progress display on the mountain path with proper positioning and hover interactions
- **Leaderboard Aggregation**: Building efficient database queries to calculate rankings, filter by categories, and handle large datasets
- **Double-Click Event Handling**: Resolving issues with step completion where clicks were registering on wrong steps due to event propagation
- **Day/Night Cycle Animation**: Creating smooth, gradual transitions between day and night that feel natural and don't distract from learning

## Accomplishments that we're proud of

We're extremely proud of our **mountain visualization system** - it's unique, beautiful, and makes progress tracking genuinely engaging. The goat climber ascending the mountain as you learn is both fun and motivating. We're also proud of our **comprehensive analytics dashboard** that provides real insights into learning patterns, and our **leaderboard system** that adds healthy competition to skill mastery. The **friend ghost tracking** feature is particularly innovative, allowing users to see exactly where their friends are on the same learning path. Finally, we're proud of the overall **polish and attention to detail** - from the day/night cycle to floating particles, every element contributes to an immersive learning experience.

## What we learned

- **Scope Management**: Starting with a clear MVP and iteratively adding features is crucial for hackathon success
- **Component Architecture**: Building reusable, well-structured React components saves time and makes the codebase maintainable
- **Database Design**: Proper schema design with indexes is essential for performance, especially with aggregation queries for leaderboards
- **User Experience**: Small details like hover tooltips, smooth animations, and visual feedback significantly enhance the user experience
- **Internationalization**: Planning for i18n from the start makes adding new languages much easier
- **Event Handling**: Understanding React event propagation and using proper event handlers prevents frustrating bugs

## What's next for Ascent

- **Daily Challenges & Streaks**: Implement daily skill challenges and visual streak tracking to increase daily engagement
- **AI-Powered Recommendations**: Suggest next skills based on completed skills and learning patterns
- **Study Groups/Teams**: Allow users to form study groups and compete as teams
- **Mentorship System**: Connect learners with mentors who have mastered skills they're learning
- **Skill Marketplace**: Enable users to create and monetize premium skill roadmaps
- **Mobile App**: Native mobile application for iOS and Android
- **Real-Time Notifications**: Push notifications for friend progress, achievements, and leaderboard updates
- **Skill Prerequisites**: Unlock skills by completing prerequisites, creating a skill tree system
- **Resource Contributions**: Allow users to add and rate learning resources for each skill
- **Time Tracking**: More detailed time tracking with session timers and productivity insights

## Built With

- react
- framer-motion
- express.js
- mongodb
- mongoose
- docker
- i18next
- node.js
- jwt
- bcryptjs

## Try it out

[GitHub Repo](https://github.com/Kolby-Schulz/Hacklahoma-2026)

---

**Ascent - Reach New Heights** 🏔️
