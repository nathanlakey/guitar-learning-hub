import { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import LearningPath from './components/LearningPath';
import Bookmarks from './components/Bookmarks';
import { learningPaths } from './data/learningPaths';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
  const [savedLoops, setSavedLoops] = useState({});

  // Load bookmarks and loops from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('guitarHubBookmarks');
    if (saved) {
      setBookmarkedVideos(JSON.parse(saved));
    }
    const savedLoopsData = localStorage.getItem('guitarHubLoops');
    if (savedLoopsData) {
      setSavedLoops(JSON.parse(savedLoopsData));
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('guitarHubBookmarks', JSON.stringify(bookmarkedVideos));
  }, [bookmarkedVideos]);

  // Save loops to localStorage
  useEffect(() => {
    localStorage.setItem('guitarHubLoops', JSON.stringify(savedLoops));
  }, [savedLoops]);

  const handleToggleBookmark = (videoId) => {
    setBookmarkedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setCurrentView('player');
  };

  const handleSaveLoop = (loop) => {
    setSavedLoops(prev => ({
      ...prev,
      [selectedVideo.id]: [...(prev[selectedVideo.id] || []), loop]
    }));
  };

  const getAllVideos = () => {
    return Object.values(learningPaths).flatMap(path => path.videos);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎸 Guitar Learning Hub</h1>
          <nav className="main-nav">
            <button 
              className={currentView === 'home' ? 'active' : ''}
              onClick={() => setCurrentView('home')}
            >
              🏠 Home
            </button>
            <button 
              className={currentView === 'beginner' ? 'active' : ''}
              onClick={() => setCurrentView('beginner')}
            >
              🌱 Beginner
            </button>
            <button 
              className={currentView === 'intermediate' ? 'active' : ''}
              onClick={() => setCurrentView('intermediate')}
            >
              📈 Intermediate
            </button>
            <button 
              className={currentView === 'advanced' ? 'active' : ''}
              onClick={() => setCurrentView('advanced')}
            >
              🚀 Advanced
            </button>
            <button 
              className={currentView === 'bookmarks' ? 'active' : ''}
              onClick={() => setCurrentView('bookmarks')}
            >
              ⭐ Bookmarks ({bookmarkedVideos.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {currentView === 'home' && (
          <div className="home-view">
            <div className="hero">
              <h2>Master Guitar at Your Own Pace</h2>
              <p>
                Custom video player with loop controls, personalized learning paths, 
                and bookmark your favorite lessons.
              </p>
            </div>
            <div className="features">
              <div className="feature-card">
                <h3>🔁 Advanced Loop Controls</h3>
                <p>Set custom loop points, save them, and practice difficult sections repeatedly</p>
              </div>
              <div className="feature-card">
                <h3>📚 Structured Learning Paths</h3>
                <p>Follow curated progressions from beginner to advanced</p>
              </div>
              <div className="feature-card">
                <h3>⭐ Bookmark System</h3>
                <p>Save videos you're working on and track your progress</p>
              </div>
            </div>
            <div className="cta">
              <h3>Choose Your Path</h3>
              <div className="path-buttons">
                <button onClick={() => setCurrentView('beginner')}>
                  Start as Beginner
                </button>
                <button onClick={() => setCurrentView('intermediate')}>
                  Continue as Intermediate
                </button>
                <button onClick={() => setCurrentView('advanced')}>
                  Challenge as Advanced
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'player' && selectedVideo && (
          <div className="player-view">
            <button 
              className="back-button"
              onClick={() => setCurrentView('home')}
            >
              ← Back to Learning Paths
            </button>
            <h2>{selectedVideo.title}</h2>
            <p className="video-description">{selectedVideo.description}</p>
            <VideoPlayer
              videoId={selectedVideo.youtubeId}
              savedLoops={savedLoops[selectedVideo.id] || []}
              onSaveLoop={handleSaveLoop}
            />
          </div>
        )}

        {currentView === 'beginner' && (
          <LearningPath
            path={learningPaths.beginner}
            onSelectVideo={handleSelectVideo}
            bookmarkedVideos={bookmarkedVideos}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'intermediate' && (
          <LearningPath
            path={learningPaths.intermediate}
            onSelectVideo={handleSelectVideo}
            bookmarkedVideos={bookmarkedVideos}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'advanced' && (
          <LearningPath
            path={learningPaths.advanced}
            onSelectVideo={handleSelectVideo}
            bookmarkedVideos={bookmarkedVideos}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'bookmarks' && (
          <Bookmarks
            bookmarkedVideos={bookmarkedVideos}
            allVideos={getAllVideos()}
            onSelectVideo={handleSelectVideo}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built for self-taught guitarists 🎸 Practice smarter, not harder</p>
      </footer>
    </div>
  );
}

export default App;
