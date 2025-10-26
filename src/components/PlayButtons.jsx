const PlayButtons = ({ onPlay, onStop, isPlaying }) => {
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
                  style={{ fontSize: "2rem", color: "black" }}
                ></i>
              </>
            ) : (
              <>
                <i
                  className="bi bi-play-circle"
                  style={{ fontSize: "2rem", color: "black" }}
                ></i>
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
              max="100"
              defaultValue="50"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayButtons;
