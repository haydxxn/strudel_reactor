import { loadConfig } from "../utils/jsonConfig";

const SaveButton = ({ onSave, onLoad }) => {
  const handleLoad = () => {
    const fileInput = document.getElementById("jsonFileInput");
    fileInput.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const config = await loadConfig(file);
        onLoad(config);
      } catch (error) {
        console.error("Error loading file: " + error.message);
      }
    }
    event.target.value = "";
  };

  return (
    <div className="col-sm-3">
      <div className="mb-2">Save & Load</div>
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-light" onClick={onSave}>
          Save current config
        </button>
        <button type="button" className="btn btn-light" onClick={handleLoad}>
          Load Config
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
