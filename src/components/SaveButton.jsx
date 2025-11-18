import { loadConfig } from "../utils/jsonConfig";

const SaveButton = ({ onSave, onLoad, onAlert }) => {
  const handleLoad = () => {
    const fileInput = document.getElementById("jsonFileInput");
    // Because using the custom button to open the file input, we need to open file input by using the click event
    fileInput.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const config = await loadConfig(file);
        onLoad(config);
        onAlert({
          isShown: true,
          type: "success",
          message: "File loaded successfully",
          icon: "check-circle",
        });
      } catch (error) {
        onAlert({
          isShown: true,
          type: "danger",
          message: "Error loading file: " + error.message,
          icon: "exclamation-circle",
        });
      }
    }
    // Reset the file input value
    event.target.value = "";
  };

  return (
    <div className="col-sm-3">
      <div className="mb-2">Save & Load</div>
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-dark" onClick={onSave}>
          <i className="bi bi-download me-2"></i>
          Save current config
        </button>
        <button type="button" className="btn btn-light" onClick={handleLoad}>
          <i className="bi bi-upload me-2"></i>
          Load config
        </button>
      </div>
      <input
        type="file"
        id="jsonFileInput"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default SaveButton;
