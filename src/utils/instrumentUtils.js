// This function will extract the instruments (drums, bassline, etc.) from the input text
// And return an array of objects with the instrument name and whether it is enabled or not.
// isEnabled is true if the instrument is not prefixed with "_", and this isEnabled value will be used to set the selected state of switches input in DJButtons
export const extractInstruments = (inputText) => {
  if (!inputText) {
    return [];
  }

  const instrumentRegex = /^_?([a-zA-Z0-9_]+):/gm;
  const instruments = [];
  const matches = inputText.match(instrumentRegex);

  if (!matches) {
    return [];
  }

  matches.forEach((match) => {
    const instrumentName = match.split(":")[0];
    const isEnabled = !instrumentName.startsWith("_");

    const instrument = {
      name: !isEnabled ? instrumentName.replace("_", "") : instrumentName,
      isEnabled,
    };
    instruments.push(instrument);
  });
  return instruments;
};
