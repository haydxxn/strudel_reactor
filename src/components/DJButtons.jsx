const DJButtons = ({
  instruments,
  onToggleInstrument,
  cpsMultiplier,
  onCPSChange,
}) => {
  return (
    <>
      <div className="row">
        <div className="col-sm-4">
          <label htmlFor="setCPM" className="form-label">
            Set Cycles Speed
          </label>
          <div className="input-group mb-3">
            <select
              className="form-select bg-dark text-white border border-dark-subtle"
              aria-label="Set Cycles Speed"
              onChange={(event) => onCPSChange(event.target.value)}
              value={cpsMultiplier}
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1">1 (Default)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>
        <div className="col-sm-8">
          <label htmlFor="toggleInstrument" className="form-label">
            Toggle Instrument
          </label>
          <div className="row mt-2 px-3">
            {instruments.length === 0 ? (
              <div className="col">
                <p>No instruments found</p>
              </div>
            ) : (
              instruments.map((instrument) => (
                <div
                  className="col-sm-3 form-check form-switch"
                  key={instrument.name}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={instrument.name}
                    onChange={(event) =>
                      onToggleInstrument(instrument.name, event.target.checked)
                    }
                    checked={instrument.isEnabled}
                  />
                  <label className="form-check-label" htmlFor={instrument.name}>
                    {instrument.name}
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
