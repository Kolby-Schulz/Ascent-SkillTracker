# Skill Detail Page - Feature Documentation

## Overview

The Skill Detail page displays comprehensive information about a selected skill, including its name and a carousel of sub-skills that users need to learn to master that skill.

---

## Features

### 1. Skill Header
- **Title**: Large, prominent display of the skill name (e.g., "Guitar")
- **Description**: Brief description of the skill
- **Back Button**: Navigate back to the dashboard

### 2. Sub-Skills Carousel
- **Interactive Carousel**: Swipe/click through sub-skills in order
- **Navigation Buttons**: Previous/Next arrows on both sides
- **Indicators**: Dots showing current position in the carousel
- **Progress Info**: Current step number (e.g., "Viewing sub-skill 2 of 6")

### 3. Sub-Skill Cards
Each card displays:
- **Step Number**: "Step 1 of 6"
- **Title**: Name of the sub-skill
- **Description**: Brief explanation of what to learn
- **Animations**: Smooth slide transitions using Framer Motion

---

## Available Skills

The system currently includes three pre-configured skills:

### 1. Guitar
Sub-skills:
1. Holding the guitar and pick
2. Tuning the guitar
3. Basic chords
4. Strumming patterns
5. Reading tabs
6. Rhythm basics

### 2. Web Development
Sub-skills:
1. HTML fundamentals
2. CSS styling
3. JavaScript basics
4. React fundamentals
5. Backend with Node.js
6. Database integration

### 3. Photography
Sub-skills:
1. Camera basics
2. Exposure triangle
3. Composition rules
4. Lighting techniques
5. Photo editing
6. Portrait photography

---

## User Flow

1. **From Dashboard**: User clicks on any skill card (Guitar, Web Development, or Photography)
2. **Navigation**: System routes to `/skill/{skillId}` (e.g., `/skill/guitar`)
3. **View Sub-Skills**: User can browse through all sub-skills using:
   - Left/Right arrow buttons
   - Dot indicators at the bottom
   - Swipe gestures (touch devices)
4. **Return**: Click "Back" button to return to dashboard

---

## Routing

### Route Configuration
```javascript
<Route path="/skill/:skillId" element={
  <ProtectedRoute>
    <SkillDetail />
  </ProtectedRoute>
} />
```

### URL Format
- Guitar: `/skill/guitar`
- Web Development: `/skill/web-development`
- Photography: `/skill/photography`

---

## Components

### SkillDetail.js
**Location**: `frontend/src/pages/SkillDetail.js`

**Key Features**:
- Uses `useParams()` to get `skillId` from URL
- Manages carousel state (current index, direction)
- Handles navigation (next, previous, go to specific slide)
- Uses Framer Motion for smooth animations
- Mock data structure for skills (ready for API integration)

### SkillDetail.css
**Location**: `frontend/src/pages/SkillDetail.css`

**Styling**:
- Gradient background matching app theme
- Responsive design (mobile-first)
- White card container with shadow
- Purple gradient carousel cards
- Interactive button hover effects
- Smooth transitions

---

## Animations

Using **Framer Motion**:

### Page Transitions
- Fade in on mount
- Fade out on unmount

### Header Animation
- Slide down with delay
- Opacity fade in

### Carousel Animations
- Slide in from right (next)
- Slide in from left (previous)
- Spring animation for smooth motion
- Exit animation in opposite direction

---

## Data Structure

### Skill Object
```javascript
{
  name: 'Guitar',
  description: 'Master the art of playing guitar',
  subSkills: [
    {
      id: 1,
      title: 'Holding the guitar and pick',
      description: 'Learn proper posture...',
      order: 1
    },
    // ... more sub-skills
  ]
}
```

---

## Dashboard Integration

### Updates to Dashboard.js

1. **Import useNavigate**: Added React Router navigation
2. **Skill ID Mapping**: Maps display names to URL-friendly IDs
3. **Updated Skills**: Changed initial skills to Guitar, Web Development, Photography
4. **Click Handler**: `handleSkillClick()` navigates to skill detail page
5. **Updated UI**: Changed hint text to "Click to view • Drag to reorder"

---

## Mobile Responsiveness

### Breakpoints

**Tablet (≤768px)**:
- Smaller title (36px)
- Reduced carousel height (350px)
- Adjusted button sizes (50px)

**Mobile (≤480px)**:
- Compact title (28px)
- Taller carousel (400px) for better readability
- Smaller buttons (40px)
- Reduced padding

---

## Future Enhancements

### Backend Integration
Replace mock data with API calls:
```javascript
// Fetch skill from backend
const fetchSkill = async (skillId) => {
  const response = await apiClient.get(`/skills/${skillId}`);
  return response.data;
};
```

### Planned Features
1. **Progress Tracking**: Mark sub-skills as completed
2. **Completion Badges**: Visual indicators for completed skills
3. **Time Estimates**: Expected time to complete each sub-skill
4. **Resources**: Links to learning materials
5. **Notes**: User-generated notes for each sub-skill
6. **Skill Graph**: Visual roadmap of dependencies
7. **Share**: Share progress with others
8. **Bookmarks**: Save favorite sub-skills

---

## Testing the Feature

### Manual Testing Steps

1. Start the application:
   ```bash
   docker-compose up
   ```

2. Login/Register at http://localhost:3000

3. Navigate to dashboard

4. Click on "Guitar" skill card

5. Verify:
   - URL changes to `/skill/guitar`
   - Title shows "Guitar"
   - Carousel displays first sub-skill
   - Navigation buttons work
   - Indicators update correctly
   - Back button returns to dashboard

6. Test other skills:
   - Web Development
   - Photography

---

## Key Files Modified/Created

### Created
- `frontend/src/pages/SkillDetail.js` - Main component
- `frontend/src/pages/SkillDetail.css` - Styling

### Modified
- `frontend/src/pages/Dashboard.js` - Added click handler and navigation
- `frontend/src/App.js` - Added new route

---

## Carousel Controls

### Keyboard Navigation (Future)
- Arrow Left: Previous sub-skill
- Arrow Right: Next sub-skill
- Escape: Return to dashboard

### Touch Gestures
- Swipe Left: Next sub-skill
- Swipe Right: Previous sub-skill

### Mouse
- Click arrows: Navigate
- Click dots: Jump to specific sub-skill

---

## Design Decisions

1. **Carousel vs List**: Chose carousel for focused, step-by-step learning experience
2. **Purple Gradient**: Maintains consistency with app theme
3. **Large Cards**: Prioritizes readability and visual hierarchy
4. **Step Numbers**: Clear progress indication
5. **Smooth Animations**: Professional feel with Framer Motion
6. **Mobile-First**: Optimized for all screen sizes

---

## Performance Notes

- **Lazy Loading**: AnimatePresence only renders current slide
- **Optimized Animations**: Hardware-accelerated transforms
- **Minimal Re-renders**: useCallback for event handlers
- **Lightweight**: No external carousel library needed

---

## Accessibility

- **ARIA Labels**: Navigation buttons have descriptive labels
- **Keyboard Support**: Tab navigation (future enhancement)
- **Semantic HTML**: Proper heading hierarchy
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Visible focus states

---

## Example Usage

### Navigating Directly via URL
```
http://localhost:3000/skill/guitar
http://localhost:3000/skill/web-development
http://localhost:3000/skill/photography
```

### Programmatic Navigation
```javascript
// In any component
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/skill/guitar');
```

---

## Troubleshooting

### Skill Not Found
- Verify `skillId` in URL matches data keys
- Check `skillsData` object in SkillDetail.js
- Ensure proper URL encoding (spaces = hyphens)

### Carousel Not Animating
- Check Framer Motion is installed
- Verify AnimatePresence wrapper
- Check variants configuration

### Navigation Not Working
- Ensure React Router is configured
- Check route definition in App.js
- Verify ProtectedRoute wrapper

---

**Status**: ✅ Feature Complete and Functional
**Last Updated**: February 7, 2026
