# crumbgetit - AI-Powered Chef Assistant

A modern React application that connects users with AI-powered chef assistants for personalized cooking experiences.

## Features

- Dark mode interface
- Responsive design for all devices
- Interactive chef cards with animations
- React Router navigation
- Tailwind CSS styling

## Project Structure

```
src/
├── components/
│   ├── Header.jsx        # Navigation header
│   ├── ChefCard.jsx      # Compact chef display card
│   └── DetailedChefCard.jsx # Expanded chef information card
├── pages/
│   ├── LandingPage.jsx   # Home page
│   ├── Features.jsx      # Features overview
│   └── Chefs.jsx         # Detailed chefs listing
├── data/
│   └── chefs.js          # Chef data and descriptions
└── App.jsx              # Main application component
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Technology Stack

- React 19
- Vite
- React Router
- Tailwind CSS

## Component Documentation

### ChefCard

Displays a chef's basic information in a compact, animated card format.

Props:

- `chef: ChefInfo` - Chef information object

### DetailedChefCard

Shows comprehensive chef information including specialty and description.

Props:

- `chef: ChefInfo` - Chef information object

### Header

Navigation component with responsive menu.

## Development Guidelines

1. Maintain dark mode color scheme
2. Use Tailwind classes for styling
3. Keep components small and focused
4. Follow existing animation patterns
5. Ensure mobile responsiveness

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License
