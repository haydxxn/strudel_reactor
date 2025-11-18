// Reference from https://www.geeksforgeeks.org/html/html-a-download-attribute/
// and https://developer.mozilla.org/en-US/docs/Web/API/Blob#creating_a_blob
// https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
export const saveConfig = (config) => {
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "config.json";
  a.click();
};

export const loadConfig = async (file) => {
  const text = await file.text();
  const config = JSON.parse(text);
  if (!config) {
    throw new Error("Invalid JSON file");
  }
  if (
    !config.songText &&
    !config.volume &&
    !config.cpsMultiplier &&
    !config.instruments
  ) {
    throw new Error(
      "Invalid JSON file. Please ensure the JSON file is valid and contains the songText, volume, cpsMultiplier, and instruments properties."
    );
  }

  return config;
};
