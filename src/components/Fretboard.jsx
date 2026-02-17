import React, { useState } from 'react';
import './Fretboard.css';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALES = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Minor': [0, 2, 3, 5, 7, 8, 10],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11]
};

const TUNING = ['E', 'A', 'D', 'G', 'B', 'E']; // Standard tuning (low to high)
const FRETS = 15;

export default function Fretboard() {
  const [selectedScale, setSelectedScale] = useState('Pentatonic Minor');
  const [rootNote, setRootNote] = useState('A');
  const [showNoteNames, setShowNoteNames] = useState(true);

  const getNoteAtFret = (stringNote, fret) => {
    const startIndex = NOTES.indexOf(stringNote);
    return NOTES[(startIndex + fret) % 12];
  };

  const isNoteInScale = (note) => {
    const rootIndex = NOTES.indexOf(rootNote);
    const scaleIntervals = SCALES[selectedScale];
    
    const scaleNotes = scaleIntervals.map(interval => 
      NOTES[(rootIndex + interval) % 12]
    );
    
    return scaleNotes.includes(note);
  };

  const isRootNote = (note) => {
    return note === rootNote;
  };

  return (
    <div className="fretboard-container">
      <div className="fretboard-header">
        <h1>🎸 Master The Fretboard</h1>
        <p>Visualize scales across the entire fretboard</p>
      </div>

      <div className="fretboard-controls">
        <div className="control-group">
          <label>Root Note:</label>
          <select value={rootNote} onChange={(e) => setRootNote(e.target.value)}>
            {NOTES.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Scale:</label>
          <select value={selectedScale} onChange={(e) => setSelectedScale(e.target.value)}>
            {Object.keys(SCALES).map(scale => (
              <option key={scale} value={scale}>{scale}</option>
            ))}
          </select>
        </div>

        <div className="control-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={showNoteNames}
              onChange={(e) => setShowNoteNames(e.target.checked)}
            />
            Show Note Names
          </label>
        </div>
      </div>

      <div className="fretboard-info">
        <div className="scale-info">
          <h3>{rootNote} {selectedScale}</h3>
          <div className="legend">
            <span className="legend-item">
              <span className="legend-dot root"></span> Root Note
            </span>
            <span className="legend-item">
              <span className="legend-dot scale"></span> Scale Notes
            </span>
          </div>
        </div>
      </div>

      <div className="fretboard-wrapper">
        <div className="fretboard">
          {/* Fret markers at top */}
          <div className="fret-markers-top">
            <div className="string-label"></div>
            {[...Array(FRETS + 1)].map((_, fret) => (
              <div key={fret} className="fret-marker-top">
                {fret === 0 ? 'Open' : fret}
              </div>
            ))}
          </div>

          {/* Strings */}
          {[...TUNING].reverse().map((stringNote, stringIndex) => (
            <div key={stringIndex} className="string-row">
              <div className="string-label">{stringNote}</div>
              {[...Array(FRETS + 1)].map((_, fret) => {
                const note = getNoteAtFret(stringNote, fret);
                const inScale = isNoteInScale(note);
                const isRoot = isRootNote(note);

                return (
                  <div key={fret} className="fret">
                    <div className="string-line"></div>
                    {inScale && (
                      <div className={`note ${isRoot ? 'root' : 'scale'}`}>
                        {showNoteNames ? note : '•'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Fret position markers */}
          <div className="position-markers">
            {[3, 5, 7, 9, 12, 15].map(fret => (
              <div key={fret} className="position-marker" style={{left: `calc(${fret * (100 / FRETS)}% - 10px)`}}>
                {fret === 12 ? '••' : '•'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
