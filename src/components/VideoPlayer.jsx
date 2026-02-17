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
  const intervalRef = useRef(null);

  const opts = {
    height: '480',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  const onStateChange = (event) => {
    if (event.data === 1) { // Playing
      setIsPlaying(true);
    } else if (event.data === 2) { // Paused
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (player && isPlaying) {
      intervalRef.current = setInterval(() => {
        const time = player.getCurrentTime();
        setCurrentTime(time);

        // Loop functionality
        if (isLooping && loopEnd > loopStart && time >= loopEnd) {
          player.seekTo(loopStart, true);
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
  }, [player, isPlaying, isLooping, loopStart, loopEnd]);

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

  const handleSetLoopStart = () => {
    setLoopStart(currentTime);
    if (loopEnd === 0 || loopEnd <= currentTime) {
      setLoopEnd(currentTime + 10); // Set end 10 seconds ahead
    }
  };

  const handleSetLoopEnd = () => {
    setLoopEnd(currentTime);
  };

  const handleToggleLoop = () => {
    if (!isLooping && loopStart >= loopEnd) {
      alert('Please set loop start before loop end');
      return;
    }
    setIsLooping(!isLooping);
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

  return (
    <div className="video-player">
      <div className="video-container">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      <div className="controls">
        <div className="playback-controls">
          <button onClick={handlePlayPause}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="seek-bar">
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

        <div className="loop-controls">
          <h3>Loop Controls</h3>
          <div className="loop-buttons">
            <button onClick={handleSetLoopStart}>
              Set Loop Start ({formatTime(loopStart)})
            </button>
            <button onClick={handleSetLoopEnd}>
              Set Loop End ({formatTime(loopEnd)})
            </button>
            <button 
              onClick={handleToggleLoop}
              className={isLooping ? 'active' : ''}
            >
              {isLooping ? '🔁 Looping ON' : '🔁 Loop OFF'}
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
      </div>
    </div>
  );
}
