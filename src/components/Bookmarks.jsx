import React from 'react';
import './Bookmarks.css';

export default function Bookmarks({ bookmarkedVideos, allVideos, onSelectVideo, onToggleBookmark }) {
  const bookmarkedVideoData = bookmarkedVideos
    .map(id => allVideos.find(v => v.id === id))
    .filter(Boolean);

  if (bookmarkedVideoData.length === 0) {
    return (
      <div className="bookmarks empty">
        <h2>Your Bookmarks</h2>
        <p className="empty-message">
          You haven't bookmarked any videos yet. Browse the learning paths and click the star icon to save videos you're working on.
        </p>
      </div>
    );
  }

  return (
    <div className="bookmarks">
      <h2>Your Bookmarks ({bookmarkedVideoData.length})</h2>
      <div className="bookmarks-grid">
        {bookmarkedVideoData.map((video) => (
          <div key={video.id} className="bookmark-card">
            <div className="video-thumbnail">
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt={video.title}
              />
              <button
                className="remove-bookmark"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(video.id);
                }}
                title="Remove bookmark"
              >
                ⭐
              </button>
            </div>
            <div className="bookmark-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <button onClick={() => onSelectVideo(video)}>
                ▶ Continue Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
