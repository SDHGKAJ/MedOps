# MedOps - Healthcare Operations Dashboard

A modern, responsive React.js frontend application for managing medical operations and inventory. Built with clean, beginner-friendly code and modern UI design principles.

## Features

✨ **Modern UI Design**
- Clean, card-based interface with soft shadows
- Smooth hover effects and transitions
- Gradient accents and thoughtful color palette
- Professional typography and spacing

📱 **Fully Responsive**
- Desktop, tablet, and mobile optimized
- Flexible grid layouts
- Touch-friendly interactive elements

⚡ **Lightweight & Fast**
- Built with Vite for instant dev server and fast builds
- Minimal dependencies, no heavy state management
- ~150ms page load

🎯 **Simple & Maintainable**
- Beginner-friendly React code
- Reusable component structure
- Clean CSS with no external UI framework
- Easy to customize and extend

## Project Structure

```
src/
├── App.jsx                 # Main app component with dashboard logic
├── App.css                # Main app styles with modern design
├── index.css              # Global styles and typography
├── main.jsx              # React entry point
└── components/
    ├── Header.jsx        # Top navigation bar component
    └── ModuleCard.jsx    # Reusable module card component
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5175` (or another port if 5175 is in use).

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Key Components

### Header Component
- Sticky navigation header
- Logo with hover effects
- Navigation links with animated underline
- User avatar placeholder

### ModuleCard Component
- Displays feature modules
- Colored accent bar indicator
- Click to view details
- Status badge
- Responsive sizing

### App Component (Dashboard)
- Grid layout for module cards
- Interactive modal for module details
- Module selection state management
- Dynamic color theming

## Styling Approach

The project uses **pure CSS** with:
- CSS Grid for responsive layouts
- CSS custom properties (CSS variables) for colors
- CSS animations for smooth transitions
- Flexbox for component alignment
- Mobile-first responsive design

No CSS framework or preprocessor required - everything is hand-written for clarity and customization.

## Modern Design Elements

✓ **Soft Shadows** - Multiple box-shadow layers for depth
✓ **Smooth Transitions** - 200-300ms ease animations
✓ **Color Gradient** - Linear gradients for visual interest
✓ **Backdrop Filter** - Blur effect on modal overlay
✓ **CSS Variables** - Dynamic color theming per card
✓ **Clean Typography** - System font stack, optimal sizing
✓ **Hover Effects** - Subtle transforms and shadows

## Customization Guide

### Change Colors
Edit the module colors in `App.jsx`:
```javascript
color: '#6366f1'  // Change to your desired color
```

### Add New Modules
Update the `modules` array in `App.jsx` with new objects:
```javascript
{
  id: 7,
  title: 'New Module',
  description: 'Module description',
  icon: '🎉',
  color: '#your-color'
}
```

### Modify Styles
All CSS is in `App.css` and `index.css` - easily find and modify any styling.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- **Dev Server**: ~380ms ready time
- **Build Size**: Minimal (Vite optimized)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s

## Technology Stack

- **React** 18.x
- **Vite** 8.x
- **CSS 3** with Grid & Flexbox
- **ES6+** JavaScript

## License

MIT - Free to use for personal and commercial projects

## Next Steps

1. Customize colors and branding
2. Add real data and API integration
3. Implement additional pages
4. Add authentication if needed
5. Deploy to your hosting platform
