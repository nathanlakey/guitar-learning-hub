import React from 'react';
import './LearningPath.css';

export default function LearningPath({ path, onSelectVideo, bookmarkedVideos, onToggleBookmark }) {
  const isBookmarked = (videoId) => bookmarkedVideos.includes(videoId);

  return (
    <div className="learning-path">
      <div className="path-header">
        <h2>{path.title}</h2>
        <p>{path.description}</p>
      </div>
      <div className="videos-grid">
        {path.videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt={video.title}
              />
              <button
                className="bookmark-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(video.id);
                }}
              >
                {isBookmarked(video.id) ? '⭐' : '☆'}
              </button>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <button onClick={() => onSelectVideo(video)}>
                ▶ Watch & Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
