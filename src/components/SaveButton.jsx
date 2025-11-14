const SaveButton = () => {
  return (
    <div className="col-sm-3">
      <div className="mb-2">Save & Load</div>
      <div className="row gap-2">
        <button type="button" className="btn btn-light col">
          Load JSON
        </button>
        <button type="button" className="btn btn-light col">
          Save current config
        </button>
      </div>
    </div>
  );
};

export default SaveButton;
