// Reference from https://www.geeksforgeeks.org/html/html-a-download-attribute/
// and https://developer.mozilla.org/en-US/docs/Web/API/Blob#creating_a_blob
export const saveConfig = (config) => {
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "config.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const loadConfig = async (file) => {
  const text = await file.text();
  const config = JSON.parse(text);
  return config;
};
