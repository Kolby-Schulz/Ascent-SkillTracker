# Create Roadmap & Profile Feature

## Overview
This feature allows users to create custom skill roadmaps and view/manage them through a dedicated profile page. Users can help others learn new skills by designing comprehensive learning paths with multiple sub-skills.

## Features Implemented

### 1. Create Button in Sidebar
- **Location**: Left sidebar in Dashboard Layout
- **Icon**: ➕ (Plus sign)
- **Route**: `/dashboard/create`
- Added between Dashboard and Learn Skill items for easy discoverability

### 2. Create Roadmap Screen (`/dashboard/create`)

#### Components
- **Skill Name Input**: 
  - Large, editable field at the top
  - Placeholder: "Enter your skill name"
  - Max length: 50 characters
  - Required field with validation

- **Learning Path Section**:
  - Dynamic subtitle: "Master these X essential sub-skills"
  - Count updates automatically as steps are added/removed

- **Sub-skill Carousel**:
  - Beautiful animated carousel with smooth transitions
  - Each card contains:
    - Editable title (max 100 characters)
    - Editable description (max 300 characters)
    - Step number indicator (e.g., "Step 1 of 6")
    - Remove button for the current step
  - Navigation: Previous/Next buttons and dot indicators
  - Progress text: "Viewing sub-skill X of Y"

- **Add New Step Button**:
  - Allows adding unlimited sub-skills
  - Automatically navigates to new step
  - Updates all counters dynamically

- **Action Buttons**:
  - **Clear All**: Resets all fields (with confirmation)
  - **Save Draft**: Saves roadmap as draft (unpublished)
  - **Publish**: Publishes roadmap for others to see

#### Validation
- Skill name is required
- At least one sub-skill required
- All sub-skill titles and descriptions required
- Character limits enforced (50 for name, 100 for titles, 300 for descriptions)

### 3. Profile Dropdown Update

#### New Options
1. **Profile** → Navigate to profile page
2. **Settings** → Existing behavior
3. **Logout** → Existing behavior

Profile option added as first item in the dropdown menu.

### 4. Profile Page (`/dashboard/profile`)

#### Features
- **User Header**:
  - Large avatar with user initial
  - Username display
  - Statistics: Total roadmaps created, total students
  - "Create New Roadmap" button

- **Filter Tabs**:
  - All (shows all roadmaps)
  - Published (public roadmaps)
  - Drafts (unpublished roadmaps)
  - Dynamic counts for each filter

- **Roadmap Cards**:
  - Status badge (Published/Draft)
  - Roadmap name
  - Sub-skill count
  - Student count (for published)
  - Created and updated dates
  - Action buttons:
    - View: Preview the roadmap
    - Edit: Edit the roadmap
    - Delete: Remove the roadmap (with confirmation)

- **Empty State**:
  - Friendly message when no roadmaps exist
  - Call-to-action button to create first roadmap
  - Different messages for filtered views

- **Loading State**:
  - Animated spinner while fetching data

## Backend API

### Model: `Roadmap`
```
{
  name: String (required, max 50 chars)
  description: String (optional, max 500 chars)
  creator: ObjectId (ref: User, required)
  status: String (enum: ['draft', 'published'], default: 'draft')
  subSkills: [
    {
      title: String (required, max 100 chars)
      description: String (required, max 300 chars)
      order: Number (required, min 1)
    }
  ]
  category: String (optional)
  tags: [String] (optional)
  studentsCount: Number (default: 0)
  visibility: String (enum: ['public', 'unlisted', 'private'], default: 'public')
  timestamps: true
}
```

### API Endpoints

#### Public Routes
- `GET /api/v1/roadmaps` - Get all published roadmaps (with filters)
- `GET /api/v1/roadmaps/:id` - Get single roadmap by ID

#### Protected Routes (Authentication Required)
- `POST /api/v1/roadmaps` - Create new roadmap
- `GET /api/v1/roadmaps/user/my-roadmaps` - Get user's own roadmaps
- `PUT /api/v1/roadmaps/:id` - Update roadmap (owner only)
- `DELETE /api/v1/roadmaps/:id` - Delete roadmap (owner only)
- `PUT /api/v1/roadmaps/:id/publish` - Publish a draft
- `PUT /api/v1/roadmaps/:id/unpublish` - Revert to draft

### Validation
All endpoints include comprehensive validation using express-validator:
- Field type validation
- Length constraints
- Required field checks
- Enum value validation
- MongoDB ObjectId validation

### Authorization
- Create: Any authenticated user
- Update/Delete: Owner only
- View: Public for published, owner only for drafts/private

## Frontend Services

### `roadmapService.js`
Provides API integration methods:
- `createRoadmap(roadmapData)` - Create new roadmap
- `getRoadmaps(filters)` - Get all roadmaps with filters
- `getMyRoadmaps(status)` - Get user's roadmaps
- `getRoadmapById(id)` - Get single roadmap
- `updateRoadmap(id, data)` - Update roadmap
- `deleteRoadmap(id)` - Delete roadmap
- `publishRoadmap(id)` - Publish roadmap
- `unpublishRoadmap(id)` - Unpublish roadmap

## UI/UX Highlights

### Design Patterns
- **Glass morphism**: Modern frosted glass effect for dropdowns
- **Gradient buttons**: Eye-catching gradient backgrounds for primary actions
- **Smooth animations**: Framer Motion animations throughout
- **Responsive design**: Mobile-first approach with breakpoints at 768px and 480px
- **Clear hierarchy**: Visual hierarchy with typography and spacing
- **Status indicators**: Color-coded badges for published/draft status

### Accessibility
- ARIA labels on navigation buttons
- Keyboard navigation support
- Semantic HTML structure
- Clear focus states
- Descriptive error messages

### User Experience
- **Auto-save awareness**: Clear distinction between draft and publish
- **Confirmation dialogs**: Prevent accidental deletions
- **Loading states**: Visual feedback during async operations
- **Empty states**: Helpful messages with clear CTAs
- **Real-time validation**: Immediate feedback on form errors
- **Dynamic counters**: Automatic updates of step counts

## File Structure

### Frontend
```
frontend/src/
├── pages/
│   ├── CreateRoadmap.js (New)
│   ├── CreateRoadmap.css (New)
│   ├── Profile.js (New)
│   └── Profile.css (New)
├── components/
│   └── DashboardLayout.js (Modified)
├── services/
│   └── roadmapService.js (New)
└── App.js (Modified)
```

### Backend
```
backend/src/
├── models/
│   └── Roadmap.js (New)
├── controllers/
│   └── roadmapController.js (New)
├── routes/
│   └── roadmapRoutes.js (New)
├── validations/
│   └── roadmapValidation.js (New)
└── app.js (Modified)
```

## Testing

### Manual Testing Checklist
- [ ] Create button appears in sidebar
- [ ] Create button navigates to Create Roadmap screen
- [ ] Skill name input accepts and validates text
- [ ] Sub-skill cards are editable
- [ ] Add step button creates new sub-skill
- [ ] Remove step button deletes current sub-skill (with minimum 1)
- [ ] Counters update correctly when adding/removing steps
- [ ] Carousel navigation works (prev/next/dots)
- [ ] Clear All button clears all fields (with confirmation)
- [ ] Save Draft saves roadmap as draft
- [ ] Publish button publishes roadmap
- [ ] Profile option appears in dropdown
- [ ] Profile page displays user's roadmaps
- [ ] Filter tabs work correctly
- [ ] View/Edit/Delete buttons function properly
- [ ] Empty state displays when no roadmaps exist
- [ ] Loading state shows during data fetch
- [ ] API endpoints respond correctly
- [ ] Validation errors display appropriately
- [ ] Authorization checks work for owner-only actions

## Future Enhancements

### Suggested Improvements
1. **Preview Mode**: See how roadmap looks to learners before publishing
2. **Templates**: Start from existing roadmaps and customize
3. **Categories/Tags**: Better organization and discovery
4. **Rich Text Editor**: Format sub-skill descriptions with markdown
5. **Drag-and-Drop Reordering**: Reorder sub-skills visually
6. **Cover Images**: Add thumbnail images for roadmaps
7. **Collaboration**: Invite co-creators to edit roadmaps
8. **Analytics**: View engagement metrics (views, completions, ratings)
9. **Versioning**: Track changes and maintain history
10. **Public Profile**: Shareable profile page showcasing roadmaps
11. **Search & Discovery**: Browse and search community roadmaps
12. **Learning Progress**: Track user progress through roadmaps
13. **Comments & Feedback**: Allow learners to provide feedback
14. **Export/Import**: Share roadmaps as JSON files
15. **Duplicate**: Clone existing roadmaps to create variations

## Related Documentation
- [API Specification](./api-spec.md)
- [Architecture Overview](./architecture.md)
- [Authentication Flow](./auth-flow.md)

## Notes
- All API calls use JWT authentication tokens
- Backend uses MongoDB for data persistence
- Frontend uses React with Framer Motion for animations
- Responsive design works on mobile, tablet, and desktop
- All sensitive operations require authentication and authorization
