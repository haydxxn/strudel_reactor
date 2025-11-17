const ProcButtons = ({ onProcessAndPlay }) => {
  return (
    <>
      <div className="btn-group mt-2" role="group" aria-label="Proc Buttons">
        <button
          id="process"
          className="btn btn-dark"
          onClick={onProcessAndPlay}
        >
          <i className="bi bi-gear-fill me-2"></i>
          Proc & Play
        </button>
      </div>
    </>
  );
};

export default ProcButtons;
