import React, { useState } from 'react';
import './VideoPlayer.css';

export default function VideoPlayer({ videoId, savedLoops = [], onSaveLoop }) {
  const [customUrl, setCustomUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [loopName, setLoopName] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);

  // Extract video ID from various YouTube URL formats
  const extractYouTubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url;
  };

  const currentVideoId = useCustomUrl && customUrl ? extractYouTubeId(customUrl) : videoId;

  const handleUseCustomUrl = () => {
    if (customUrl.trim()) {
      setUseCustomUrl(true);
    }
  };

  const handleResetToOriginal = () => {
    setUseCustomUrl(false);
    setCustomUrl('');
  };

  const handleSaveLoop = () => {
    if (!loopName.trim()) {
      alert('Please enter a name for this loop');
      return;
    }
    onSaveLoop({
      name: loopName,
      timestamp: Date.now()
    });
    setLoopName('');
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    
    const newNote = {
      text: noteText,
      created: Date.now()
    };
    setNotes([...notes, newNote]);
    setNoteText('');
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="video-player">
      <div className="custom-url-section">
        <div className="custom-url-input">
          <input
            type="text"
            placeholder="Paste your own YouTube URL or video ID here..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            disabled={useCustomUrl}
          />
          {!useCustomUrl ? (
            <button onClick={handleUseCustomUrl} disabled={!customUrl.trim()}>
              Use This Video
            </button>
          ) : (
            <button onClick={handleResetToOriginal} className="reset-btn">
              Reset to Original
            </button>
          )}
        </div>
        <p className="url-hint">
          💡 Tip: Use your own YouTube videos or find guitar tutorials that work for you!
        </p>
      </div>

      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideoId}?rel=0&modestbranding=1&controls=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="youtube-iframe"
        />
      </div>

      <div className="video-info-section">
        <div className="helpful-links">
          <h3>🎸 Helpful Resources</h3>
          <div className="link-grid">
            <a href="https://www.youtube.com/results?search_query=guitar+lesson+beginner" target="_blank" rel="noopener noreferrer">
              Find Beginner Lessons
            </a>
            <a href="https://www.youtube.com/results?search_query=guitar+chords+tutorial" target="_blank" rel="noopener noreferrer">
              Chord Tutorials
            </a>
            <a href="https://www.youtube.com/results?search_query=guitar+fingerpicking" target="_blank" rel="noopener noreferrer">
              Fingerpicking Lessons
            </a>
            <a href="https://www.youtube.com/results?search_query=guitar+scales+tutorial" target="_blank" rel="noopener noreferrer">
              Guitar Scales
            </a>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="loop-controls">
          <h3>📚 Save Your Practice Points</h3>
          <div className="save-loop">
            <input
              type="text"
              placeholder="Name this practice point..."
              value={loopName}
              onChange={(e) => setLoopName(e.target.value)}
            />
            <button onClick={handleSaveLoop}>💾 Save</button>
          </div>
        </div>

        {savedLoops.length > 0 && (
          <div className="saved-loops">
            <h3>Saved Practice Points</h3>
            <div className="loops-list">
              {savedLoops.map((loop, index) => (
                <div key={index} className="loop-item">
                  <span className="loop-name">{loop.name}</span>
                  <span className="loop-time">
                    {new Date(loop.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="notes-section">
          <div className="notes-header">
            <h3>Notes & Annotations</h3>
            <button onClick={() => setShowNotes(!showNotes)}>
              {showNotes ? '▼ Hide' : '▶ Show'}
            </button>
          </div>
          
          {showNotes && (
            <>
              <div className="add-note">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button onClick={handleAddNote}>📝 Add Note</button>
              </div>

              {notes.length > 0 && (
                <div className="notes-list">
                  {notes.map((note, index) => (
                    <div key={index} className="note-item">
                      <span className="note-text">{note.text}</span>
                      <button 
                        className="delete-note"
                        onClick={() => handleDeleteNote(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="keyboard-shortcuts">
          <details>
            <summary>⌨️ YouTube Player Tips</summary>
            <div className="shortcuts-list">
              <div><kbd>K</kbd> or <kbd>Space</kbd> Play/Pause</div>
              <div><kbd>J</kbd> Rewind 10 seconds</div>
              <div><kbd>L</kbd> Forward 10 seconds</div>
              <div><kbd>←/→</kbd> Skip 5 seconds</div>
              <div><kbd>&lt;/&gt;</kbd> Slow down / Speed up</div>
              <div><kbd>F</kbd> Fullscreen</div>
              <div><kbd>M</kbd> Mute/Unmute</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
