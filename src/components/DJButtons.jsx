const DJButtons = () => {
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
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck1"
              />
              <label className="form-check-label" htmlFor="switchCheck1">
                P1
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
            <div className="col-sm-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheck2"
              />
              <label className="form-check-label" htmlFor="switchCheck2">
                P2
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DJButtons;
