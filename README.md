# Eternal Vows - Wedding Website

Una moderna aplicación web para bodas construida con React, diseñada para gestionar RSVP, compartir la historia de la pareja, detalles del evento y un libro de visitas interactivo.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Local Storage** - Client-side data persistence for RSVP and guest book
- **Responsive Design** - Fully responsive layout optimized for all devices
- **Multi-language Support** - Language toggle for English/Spanish content
- **Form Validation** - Custom form handling and validation

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
│   ├── utils/                  # Utility functions
│   │   ├── rsvpStorage.js      # RSVP local storage management
│   │   └── guestBookStorage.js # Guest book local storage
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

The application uses browser localStorage for data persistence:

- **RSVP Data** - Guest responses and meal preferences stored locally
- **Guest Book Messages** - Messages, reactions, and statistics stored locally

Storage utilities are located in `src/utils/`:
- `rsvpStorage.js` - RSVP management functions
- `guestBookStorage.js` - Guest book management functions

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

The site will be deployed to: `https://fabiyfeli.github.io`

### Deployment Configuration

- The `homepage` field in `package.json` is set to the GitHub Pages URL
- Build output goes to the `build/` directory
- Includes `_redirects`, `CNAME`, and `404.html` for proper routing

## 🌐 Environment

The application runs entirely on the client-side with no backend server required. All data is stored in the browser's localStorage.

## 🙏 Acknowledgments

- Powered by React 18 and Vite
- Styled with Tailwind CSS
- Icons by Lucide React
- Built with ❤️ by Faby & Feli
