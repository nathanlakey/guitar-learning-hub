import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import './VideoPlayer.css';

export default function VideoPlayer({ videoId, savedLoops = [], onSaveLoop }) {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [loopName, setLoopName] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSettingLoop, setIsSettingLoop] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceSpeed, setPracticeSpeed] = useState(0.5);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const intervalRef = useRef(null);

  const opts = {
    height: '480',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      fs: 1,
      enablejsapi: 1,
      origin: window.location.origin,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    event.target.setPlaybackRate(playbackRate);
    setVideoError(false);
  };

  const onError = (event) => {
    console.error('YouTube player error:', event.data);
    setVideoError(true);
  };

  const onStateChange = (event) => {
    if (event.data === 1) { // Playing
      setIsPlaying(true);
      setVideoError(false);
    } else if (event.data === 2) { // Paused
      setIsPlaying(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkipForward();
          break;
        case 'l':
        case 'L':
          handleToggleLoop();
          break;
        case 's':
        case 'S':
          handleSetLoopStart();
          break;
        case 'e':
        case 'E':
          handleSetLoopEnd();
          break;
        case '1':
          handleSetSpeed(0.25);
          break;
        case '2':
          handleSetSpeed(0.5);
          break;
        case '3':
          handleSetSpeed(0.75);
          break;
        case '4':
          handleSetSpeed(1);
          break;
        case '5':
          handleSetSpeed(1.25);
          break;
        case '6':
          handleSetSpeed(1.5);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player, isPlaying, currentTime, isLooping, loopStart, loopEnd]);

  useEffect(() => {
    if (player && isPlaying) {
      intervalRef.current = setInterval(() => {
        const time = player.getCurrentTime();
        setCurrentTime(time);

        // Loop functionality with counter
        if (isLooping && loopEnd > loopStart && time >= loopEnd) {
          player.seekTo(loopStart, true);
          setLoopCount(prev => prev + 1);
          
          // Practice mode: gradually increase speed
          if (practiceMode && loopCount > 0 && loopCount % 5 === 0) {
            const newSpeed = Math.min(practiceSpeed + 0.1, 1);
            setPracticeSpeed(newSpeed);
            handleSetSpeed(newSpeed);
          }
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [player, isPlaying, isLooping, loopStart, loopEnd, loopCount, practiceMode, practiceSpeed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleSkipBackward = () => {
    if (player) {
      const newTime = Math.max(0, currentTime - 5);
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const handleSkipForward = () => {
    if (player) {
      const newTime = Math.min(duration, currentTime + 5);
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const handleSetSpeed = (speed) => {
    setPlaybackRate(speed);
    if (player) {
      player.setPlaybackRate(speed);
    }
  };

  const handleSetLoopStart = () => {
    setLoopStart(currentTime);
    if (loopEnd === 0 || loopEnd <= currentTime) {
      setLoopEnd(currentTime + 10); // Set end 10 seconds ahead
    }
    setLoopCount(0); // Reset counter when setting new loop
  };

  const handleSetLoopEnd = () => {
    setLoopEnd(currentTime);
    setLoopCount(0); // Reset counter
  };

  const handleToggleLoop = () => {
    if (!isLooping && loopStart >= loopEnd) {
      alert('Please set loop start before loop end');
      return;
    }
    setIsLooping(!isLooping);
    if (!isLooping) {
      setLoopCount(0); // Reset counter when starting loop
    }
  };

  const handleTogglePracticeMode = () => {
    setPracticeMode(!practiceMode);
    if (!practiceMode) {
      setPracticeSpeed(0.5);
      handleSetSpeed(0.5);
    } else {
      handleSetSpeed(1);
    }
  };

  const handleClickSeekBar = () => {
    if (isSettingLoop) {
      if (loopStart === 0 || loopEnd > 0) {
        // Set start
        setLoopStart(currentTime);
        setLoopEnd(0);
      } else {
        // Set end
        setLoopEnd(currentTime);
        setIsSettingLoop(false);
      }
    }
  };

  const handleSaveLoop = () => {
    if (!loopName.trim()) {
      alert('Please enter a name for this loop');
      return;
    }
    if (loopStart >= loopEnd) {
      alert('Loop start must be before loop end');
      return;
    }
    onSaveLoop({
      name: loopName,
      start: loopStart,
      end: loopEnd,
      timestamp: Date.now()
    });
    setLoopName('');
  };

  const handleLoadLoop = (loop) => {
    setLoopStart(loop.start);
    setLoopEnd(loop.end);
    setLoopCount(0);
    if (player) {
      player.seekTo(loop.start, true);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (player) {
      player.seekTo(seekTime, true);
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    
    const newNote = {
      text: noteText,
      timestamp: currentTime,
      created: Date.now()
    };
    setNotes([...notes, newNote]);
    setNoteText('');
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleJumpToNote = (timestamp) => {
    if (player) {
      player.seekTo(timestamp, true);
      setCurrentTime(timestamp);
    }
  };

  return (
    <div className="video-player">
      <div className="video-container">
        {videoError ? (
          <div className="video-error">
            <div className="error-content">
              <h3>⚠️ Video Unavailable</h3>
              <p>This video cannot be embedded. Watch it directly on YouTube:</p>
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-link"
              >
                🎥 Open in YouTube
              </a>
              <p className="error-hint">
                Tip: Use your own YouTube videos or videos that allow embedding for the best experience.
              </p>
            </div>
          </div>
        ) : (
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            onError={onError}
          />
        )}
      </div>

      <div className="controls">
        <div className="playback-controls">
          <button onClick={handleSkipBackward} title="Skip back 5s (←)">
            ⏪ -5s
          </button>
          <button onClick={handlePlayPause} title="Play/Pause (Space)">
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={handleSkipForward} title="Skip forward 5s (→)">
            ⏩ +5s
          </button>
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="speed-controls">
          <label>Speed:</label>
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map(speed => (
            <button
              key={speed}
              onClick={() => handleSetSpeed(speed)}
              className={playbackRate === speed ? 'active' : ''}
              title={`Set speed to ${speed}x (${speed === 0.25 ? '1' : speed === 0.5 ? '2' : speed === 0.75 ? '3' : speed === 1 ? '4' : speed === 1.25 ? '5' : '6'})`}
            >
              {speed}x
            </button>
          ))}
        </div>

        <div className="seek-bar">
          <div className="seek-bar-container">
            {loopStart > 0 && loopEnd > loopStart && (
              <div 
                className="loop-range-indicator"
                style={{
                  left: `${(loopStart / duration) * 100}%`,
                  width: `${((loopEnd - loopStart) / duration) * 100}%`
                }}
              />
            )}
            {notes.map((note, index) => (
              <div
                key={index}
                className="note-marker"
                style={{ left: `${(note.timestamp / duration) * 100}%` }}
                title={note.text}
              />
            ))}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              step="0.1"
              className="seek-slider"
            />
          </div>
        </div>

        <div className="loop-controls">
          <h3>Loop Controls {isLooping && loopCount > 0 && <span className="loop-counter">(Loop #{loopCount})</span>}</h3>
          <div className="loop-buttons">
            <button onClick={handleSetLoopStart} title="Set loop start (S)">
              Set Loop Start ({formatTime(loopStart)})
            </button>
            <button onClick={handleSetLoopEnd} title="Set loop end (E)">
              Set Loop End ({formatTime(loopEnd)})
            </button>
            <button 
              onClick={handleToggleLoop}
              className={isLooping ? 'active' : ''}
              title="Toggle loop (L)"
            >
              {isLooping ? '🔁 Looping ON' : '🔁 Loop OFF'}
            </button>
            <button
              onClick={handleTogglePracticeMode}
              className={practiceMode ? 'active' : ''}
              title="Auto-increase speed every 5 loops"
            >
              {practiceMode ? `🎯 Practice Mode (${practiceSpeed.toFixed(2)}x)` : '🎯 Practice Mode OFF'}
            </button>
          </div>

          <div className="save-loop">
            <input
              type="text"
              placeholder="Name this loop..."
              value={loopName}
              onChange={(e) => setLoopName(e.target.value)}
            />
            <button onClick={handleSaveLoop}>💾 Save Loop</button>
          </div>
        </div>

        {savedLoops.length > 0 && (
          <div className="saved-loops">
            <h3>Saved Loops</h3>
            <div className="loops-list">
              {savedLoops.map((loop, index) => (
                <div key={index} className="loop-item">
                  <span className="loop-name">{loop.name}</span>
                  <span className="loop-time">
                    {formatTime(loop.start)} - {formatTime(loop.end)}
                  </span>
                  <button onClick={() => handleLoadLoop(loop)}>Load</button>
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
                  placeholder="Add a note at current time..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button onClick={handleAddNote}>📝 Add Note</button>
              </div>

              {notes.length > 0 && (
                <div className="notes-list">
                  {notes.sort((a, b) => a.timestamp - b.timestamp).map((note, index) => (
                    <div key={index} className="note-item">
                      <button 
                        className="note-timestamp"
                        onClick={() => handleJumpToNote(note.timestamp)}
                      >
                        {formatTime(note.timestamp)}
                      </button>
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
            <summary>⌨️ Keyboard Shortcuts</summary>
            <div className="shortcuts-list">
              <div><kbd>Space</kbd> Play/Pause</div>
              <div><kbd>←</kbd> Skip back 5s</div>
              <div><kbd>→</kbd> Skip forward 5s</div>
              <div><kbd>S</kbd> Set loop start</div>
              <div><kbd>E</kbd> Set loop end</div>
              <div><kbd>L</kbd> Toggle loop</div>
              <div><kbd>1-6</kbd> Set speed (0.25x - 1.5x)</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
