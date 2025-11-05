const ProcButtons = ({ onProcess, onProcessAndPlay }) => {
  return (
    <>
      <div className="btn-group mt-2" role="group" aria-label="Proc Buttons">
        <button id="process" className="btn btn-dark" onClick={onProcess}>
          <i className="bi bi-gear-fill me-2"></i>
          Preprocess
        </button>
        <button
          id="process_play"
          className="btn text-white border border-subtle"
          onClick={onProcessAndPlay}
        >
          <i className="bi bi-play-fill me-2"></i>
          Proc & Play
        </button>
      </div>
    </>
  );
};

export default ProcButtons;
