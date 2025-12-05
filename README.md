# Eternal Vows - Wedding Website

Una moderna aplicación web para bodas construida con React, diseñada para gestionar RSVP, compartir la historia de la pareja, detalles del evento y un libro de visitas interactivo.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Firebase/Firestore** - Cloud database for persistent RSVP and guest book storage
- **Local Storage** - Client-side fallback for offline functionality
- **GitHub API Integration** - Optional backup sync to GitHub Issues/Discussions
- **Responsive Design** - Fully responsive layout optimized for all devices
- **Multi-language Support** - Language toggle for English/Spanish content
- **Form Validation** - Custom form handling and validation
- **Download Capabilities** - ICS calendar files and text confirmations

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
wedding/
├── public/                     # Static assets
│   ├── assets/images/          # Image assets
│   └── data/                   # Static data files
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # UI primitives (Button, Input, etc.)
│   │   ├── Header.jsx          # Site header
│   │   └── ErrorBoundary.jsx   # Error handling
│   ├── pages/                  # Page components
│   │   ├── homepage/           # Landing page
│   │   ├── rsvp/               # RSVP form and admin
│   │   ├── wedding-details/    # Venue, timeline, FAQ
│   │   ├── our-story/          # Couple's story timeline
│   │   └── guest-book/         # Interactive guest book
│   ├── config/                 # Configuration files
│   │   └── firebase.js         # Firebase/Firestore setup
│   ├── utils/                  # Utility functions
│   │   ├── rsvpStorage.js      # RSVP storage (localStorage + Firebase)
│   │   └── guestBookStorage.js # Guest book storage (localStorage + Firebase)
│   ├── styles/                 # Global styles
│   ├── App.jsx                 # Main application component
│   ├── Routes.jsx              # Application routes
│   └── Index.jsx               # Application entry point
├── build/                      # Production build output
├── index.html                  # HTML template
├── package.json                # Project dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── vite.config.mjs             # Vite configuration
```

## 📄 Pages

The application includes the following pages:

- **Homepage** (`/`) - Welcome page with hero section, RSVP counter, and quick links
- **RSVP** (`/rsvp`) - Multi-step RSVP form for guests to confirm attendance
- **RSVP Admin** (`/rsvp-admin`) - Admin dashboard to manage RSVPs
- **Wedding Details** (`/wedding-details`) - Venue information, timeline, dress code, and FAQ
- **Our Story** (`/our-story`) - Interactive timeline of the couple's journey
- **Guest Book** (`/guest-book`) - Interactive guest book with filtering and statistics

## 🧩 Adding Routes

To add new routes, update the `Routes.jsx` file:

```jsx
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import NewPage from './pages/new-page';

// Add your new route inside the <RouterRoutes> component
<Route path="/new-page" element={<NewPage />} />
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- **@tailwindcss/forms** - Enhanced form styling
- **@tailwindcss/typography** - Beautiful typographic defaults
- **@tailwindcss/aspect-ratio** - Aspect ratio utilities
- **@tailwindcss/container-queries** - Container-based responsive design
- **tailwindcss-fluid-type** - Fluid typography scaling
- **tailwindcss-animate** - Animation utilities
- **tailwindcss-elevation** - Material-style elevation shadows

## 💾 Data Storage

The application uses a **hybrid storage system** combining localStorage and Firebase/Firestore:

### localStorage (Fast, Offline-First)
- Provides instant loading and works offline
- Acts as a local cache for better performance
- No configuration needed

### Firebase/Firestore (Persistent, Cloud-Synced)
- Stores data persistently in the cloud
- Syncs across devices automatically
- Survives browser cache clears
- Requires configuration (see `FIREBASE_SETUP.md`)

### Data Types:
- **RSVP Data** - Guest responses, meal preferences, and special requirements
- **Guest Book Messages** - Messages with language filtering and statistics
- **Admin Data** - Approval status and manual edits

Storage utilities are located in `src/utils/`:
- `rsvpStorage.js` - RSVP management (localStorage + Firebase sync)
- `guestBookStorage.js` - Guest book management (localStorage + Firebase sync)

### Setup Firebase:
See detailed instructions in `FIREBASE_SETUP.md` to configure Firebase/Firestore for persistent cloud storage.

## 📱 Responsive Design

The app is fully responsive with mobile-first design using Tailwind CSS breakpoints, optimized for phones, tablets, and desktop devices.


## 📦 Deployment

The application is configured for GitHub Pages deployment:

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

The site will be deployed to: `https://fabiyfeli.cl` (custom domain with DNS)

### Deployment Configuration

- The `homepage` field in `package.json` is set to the GitHub Pages URL
- Custom domain: `fabiyfeli.cl` (configured via DNS and CNAME)
- Build output goes to the `build/` directory
- Includes `_redirects`, `CNAME`, and `404.html` for proper routing

## 🌐 Environment

The application runs entirely on the client-side with no backend server required. Data is stored in:
1. **localStorage** - For instant access and offline functionality
2. **Firebase/Firestore** - For persistent cloud storage (optional, requires setup)
3. **GitHub API** - For optional backup synchronization (admin feature)

## 🔧 Configuration

### Firebase Setup (Required for Production)
1. Create a Firebase project at https://console.firebase.google.com/
2. Copy your credentials to `src/config/firebase.js`
3. Configure Firestore security rules (see `FIREBASE_SETUP.md`)
4. Deploy and test

### GitHub API (Optional)
Admin panels support GitHub sync for additional backup:
- RSVP Admin → Sync to GitHub repository file
- Guest Book Admin → Sync to GitHub Issues/Discussions

## 🙏 Acknowledgments

- Powered by React 18 and Vite
- Styled with Tailwind CSS
- Icons by Lucide React
- Built with ❤️ by Faby & Feli
