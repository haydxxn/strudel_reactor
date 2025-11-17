const PlayButtons = ({ onPlay, onStop, isPlaying, onVolumeChange, volume }) => {
  const handleClick = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay();
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-3">
          <label htmlFor="play" className="form-label">
            Play/Stop
          </label>
          <button className="btn btn-outline pt-0" onClick={handleClick}>
            {isPlaying ? (
              <>
                <i
                  className="bi bi-stop-circle"
                  style={{ fontSize: "2rem", color: "#1EBA54" }}
                />
              </>
            ) : (
              <>
                <i
                  className="bi bi-play-circle"
                  style={{ fontSize: "2rem", color: "#1EBA54" }}
                />
              </>
            )}
          </button>
        </div>
        <div className="col">
          <div>
            <label htmlFor="volume" className="form-label mb-3">
              Volume
            </label>
            <input
              type="range"
              className="form-range"
              id="volume"
              min="0"
              max="1"
              step="0.01"
              defaultValue={volume}
              onMouseUp={(event) => onVolumeChange(event.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayButtons;
