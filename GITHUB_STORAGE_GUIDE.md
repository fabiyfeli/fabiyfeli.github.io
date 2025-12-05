# GitHub Storage Setup Guide

## Overview
Your wedding website now stores RSVP data in your GitHub repository at `public/data/rsvps.json`. This means:
- ✅ Data is backed up in GitHub
- ✅ Version controlled (you can see history of changes)
- ✅ No external database needed
- ✅ Free and reliable

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to GitHub.com and sign in
2. Click your profile picture → **Settings**
3. Scroll down to **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token (classic)**
6. Give it a name like "Wedding RSVP Access"
7. Set expiration (recommend: 90 days or No expiration)
8. **Important:** Check the **`repo`** scope (this gives full repository access)
9. Click **Generate token** at the bottom
10. **Copy the token immediately** (you won't see it again!)
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Configure Token in Admin Panel

1. Go to your website's admin panel: `https://fabiyfeli.cl/rsvp-admin`
2. Login with password: `FabiYFeli2026`
3. Click the **"Config Token"** button
4. Paste your GitHub token
5. Click **"Guardar Token"**

### 3. How to Use

#### Loading RSVPs from GitHub
- Click **"Cargar de GitHub"** button
- This fetches the latest data from your repository
- Updates the admin panel with GitHub data

#### Saving RSVPs to GitHub
- Click **"Guardar en GitHub"** button
- This commits all current RSVPs to your repository
- Creates a new commit with timestamp

#### Workflow Recommendation
1. When you first set up: Click "Guardar en GitHub" to create initial file
2. Before making changes: Click "Cargar de GitHub" to get latest data
3. After making changes: Click "Guardar en GitHub" to save

## How It Works

### Data Flow
```
User submits RSVP
    ↓
Saved to localStorage (instant)
    ↓
Admin clicks "Guardar en GitHub"
    ↓
Data committed to GitHub repository
    ↓
Available at: public/data/rsvps.json
```

### Fallback System
- Primary storage: GitHub repository
- Backup storage: Browser localStorage
- If GitHub is unavailable, system uses localStorage
- You can export/import CSV as additional backup

## Troubleshooting

### "Error al guardar en GitHub"
**Cause:** Token expired or doesn't have repo permissions  
**Solution:** 
1. Generate a new token with `repo` scope
2. Update token in Config Token modal

### "401 Unauthorized"
**Cause:** Invalid or expired token  
**Solution:** Generate and configure a new token

### "403 Forbidden"
**Cause:** Token doesn't have write permissions  
**Solution:** Make sure token has `repo` scope checked

### "409 Conflict"
**Cause:** File was modified elsewhere  
**Solution:**
1. Click "Cargar de GitHub" first
2. Then click "Guardar en GitHub"

## Security Notes

- ✅ Token is stored only in your browser (localStorage)
- ✅ Token is never shared or sent anywhere except GitHub
- ✅ Only you (as admin) can access the token configuration
- ⚠️ Don't share your token with anyone
- ⚠️ If compromised, revoke token on GitHub and generate new one

## File Location

RSVPs are stored at:
```
https://github.com/fabiyfeli/fabiyfeli.github.io/blob/main/public/data/rsvps.json
```

You can:
- View the file directly on GitHub
- Download it manually
- See commit history
- Revert to previous versions if needed

## Alternative: GitHub Issues (Future Feature)

Currently RSVPs are saved as JSON file. A future enhancement could create a GitHub Issue for each RSVP submission, which would:
- Create individual issues with RSVP details
- Add labels (attending/not-attending)
- Allow comments and discussions
- Send email notifications

This feature is prepared but not yet activated.

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify your token has correct permissions
3. Try the CSV export as temporary backup
4. Contact technical support with error details
