const DJButtons = ({ patterns, onTogglePattern }) => {
  return (
    <>
      <div className="row">
        <div className="col-sm-4">
          <label htmlFor="setCPM" className="form-label">
            Set Cycles Speed
          </label>
          <div className="input-group mb-3">
            <span className="input-group-text" id="setCPM">
              setCPM
            </span>
            <input type="text" className="form-control" placeholder="140" />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="setCPS">
              setCPS
            </span>
            <input type="text" className="form-control" placeholder="4" />
          </div>
        </div>
        <div className="col-sm-8">
          <label htmlFor="togglePattern" className="form-label">
            Toggle Pattern
          </label>
          <div className="row px-3">
            {patterns.length === 0 ? (
              <div className="col-sm-3 form-check form-switch">
                <p>No patterns found</p>
              </div>
            ) : (
              patterns.map((pattern) => (
                <div
                  className="col-sm-3 form-check form-switch"
                  key={pattern.name}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={pattern.name}
                    onChange={(event) =>
                      onTogglePattern(pattern.name, event.target.checked)
                    }
                    checked={pattern.isEnabled}
                  />
                  <label className="form-check-label" htmlFor={pattern.name}>
                    {pattern.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DJButtons;
