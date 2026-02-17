# Guitar Learning Hub 🎸

A comprehensive web application for self-taught guitar players featuring a custom YouTube video player with advanced loop controls, structured learning paths, and a bookmark system.

## Features

### 🔁 Advanced Loop Controls
- Set custom loop start and end points
- Save and load multiple loops per video
- Perfect for practicing difficult sections repeatedly

### 📚 Structured Learning Paths
- **Beginner Path**: Start your guitar journey
- **Intermediate Path**: Take your skills to the next level
- **Advanced Path**: Master advanced techniques

### ⭐ Bookmark System
- Save videos you're working on
- Track your progress across all skill levels
- Quick access to your favorite lessons

### 🎥 Custom Video Player
- Built-in YouTube player with enhanced controls
- Precise time selection
- Persistent loop storage using localStorage

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## How to Use

1. **Choose Your Path**: Select your skill level (Beginner, Intermediate, or Advanced)
2. **Browse Videos**: Explore curated video lessons for your level
3. **Bookmark Videos**: Click the star icon to save videos you're working on
4. **Practice with Loops**:
   - Click "Set Loop Start" at the beginning of the section you want to practice
   - Click "Set Loop End" at the end of that section
   - Click "Loop ON" to enable looping
   - Name and save your loop for future practice sessions

## Tech Stack

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **react-youtube**: YouTube player integration
- **LocalStorage**: Persistent data storage

## Project Structure

```
guitar-learning-hub/
├── src/
│   ├── components/
│   │   ├── VideoPlayer.jsx      # Custom YouTube player with loop controls
│   │   ├── LearningPath.jsx     # Learning path display component
│   │   └── Bookmarks.jsx        # Bookmarked videos display
│   ├── data/
│   │   └── learningPaths.js     # Curated video content
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Future Enhancements

- User authentication and cloud sync
- Progress tracking and statistics
- Custom playlists
- Speed control for videos
- Metronome integration
- Community features and sharing

## License

MIT

---

Built for self-taught guitarists 🎸 Practice smarter, not harder!
