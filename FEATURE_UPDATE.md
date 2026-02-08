# Feature Update: Create Roadmap & Profile

## What's New? 🎉

We've added a powerful new feature that allows users to create custom skill roadmaps and manage them through a dedicated profile page!

## Quick Start

### For Users
1. **Create a Roadmap**:
   - Click the "➕ Create" button in the left sidebar
   - Enter your skill name
   - Add sub-skills with titles and descriptions
   - Save as draft or publish immediately

2. **Manage Your Roadmaps**:
   - Click your profile picture (top right)
   - Select "Profile" from the dropdown
   - View, edit, or delete your roadmaps
   - Filter by All, Published, or Drafts

### For Developers

#### Frontend Changes
New files created:
- `frontend/src/pages/CreateRoadmap.js` - Roadmap creation interface
- `frontend/src/pages/CreateRoadmap.css` - Styling for create screen
- `frontend/src/pages/Profile.js` - User profile with roadmap management
- `frontend/src/pages/Profile.css` - Profile page styling
- `frontend/src/services/roadmapService.js` - API integration

Modified files:
- `frontend/src/components/DashboardLayout.js` - Added Create button and Profile dropdown
- `frontend/src/App.js` - Added new routes

#### Backend Changes
New files created:
- `backend/src/models/Roadmap.js` - Roadmap data model
- `backend/src/controllers/roadmapController.js` - Roadmap business logic
- `backend/src/routes/roadmapRoutes.js` - API routes
- `backend/src/validations/roadmapValidation.js` - Input validation

Modified files:
- `backend/src/app.js` - Registered roadmap routes

#### Database
New collection: `roadmaps`
- Stores user-created skill roadmaps
- Embedded sub-skills within each roadmap
- Indexes on creator, status, and text search

## Installation

No additional dependencies required! Just pull the latest code and restart your servers.

```bash
# Update your code
git pull origin main

# Frontend (if needed)
cd frontend
npm install

# Backend (if needed)
cd backend
npm install

# Start your servers
npm run dev
```

## API Endpoints

### Create Roadmap
```http
POST /api/v1/roadmaps
Authorization: Bearer <token>

{
  "name": "Piano Fundamentals",
  "description": "Learn piano from scratch",
  "status": "published",
  "subSkills": [
    {
      "title": "Understanding the keyboard",
      "description": "Learn the layout of piano keys",
      "order": 1
    },
    {
      "title": "Basic hand position",
      "description": "Proper finger placement and posture",
      "order": 2
    }
  ]
}
```

### Get My Roadmaps
```http
GET /api/v1/roadmaps/user/my-roadmaps
Authorization: Bearer <token>
```

### Get All Published Roadmaps
```http
GET /api/v1/roadmaps
```

### Update Roadmap
```http
PUT /api/v1/roadmaps/:id
Authorization: Bearer <token>

{
  "name": "Updated name",
  "status": "published",
  "subSkills": [...]
}
```

### Delete Roadmap
```http
DELETE /api/v1/roadmaps/:id
Authorization: Bearer <token>
```

### Publish/Unpublish
```http
PUT /api/v1/roadmaps/:id/publish
PUT /api/v1/roadmaps/:id/unpublish
Authorization: Bearer <token>
```

## Testing

You can test the feature by:

1. **Login** to your account
2. **Click "Create"** in the sidebar
3. **Fill in** the skill name and sub-skills
4. **Save or Publish** your roadmap
5. **View your profile** to see all created roadmaps
6. **Edit or Delete** roadmaps as needed

## Known Limitations

- No rich text editing (plain text only)
- No image/video uploads
- No collaboration features yet
- No analytics/metrics
- Maximum 50 characters for skill names
- Maximum 100 characters for sub-skill titles
- Maximum 300 characters for sub-skill descriptions

## What's Next?

Potential future enhancements:
- Preview mode
- Roadmap templates
- Collaboration features
- Analytics dashboard
- Rich text editor
- Image uploads
- Public discovery page
- Rating system
- Comments and feedback

## Documentation

For detailed documentation, see:
- [Create Roadmap Feature Documentation](./docs/create-roadmap-feature.md)
- [API Specification](./docs/api-spec.md)

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your authentication token is valid
3. Ensure all required fields are filled
4. Check character limits are not exceeded

## Migration Notes

**No database migration required** - the feature uses a new collection that will be created automatically when the first roadmap is saved.

## Rollback

If you need to rollback this feature:
1. Remove the Create button from `DashboardLayout.js`
2. Remove the routes from `App.js` and `backend/src/app.js`
3. The database collection can remain (no harm in keeping it)

---

**Version**: 1.0.0  
**Release Date**: February 7, 2026  
**Contributors**: Development Team
