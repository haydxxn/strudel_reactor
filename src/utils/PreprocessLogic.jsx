const Preprocess = ({ inputText, volume, cpsMultiplier, instruments }) => {
  let outputText = inputText;

  // Set the cps value based on the selected cps (selection from DJButtons)
  if (cpsMultiplier) {
    outputText = outputText.replace(
      /setcps\(([^)]+)\)/g,
      (match, captureGroup) => `setcps((${captureGroup}) * ${cpsMultiplier})`
    );
  }

  // Add/remove "_" prefix to the instrument name
  instruments.forEach((instrument) => {
    if (instrument.isEnabled) {
      outputText = outputText.replaceAll(
        `_${instrument.name}:`,
        `${instrument.name}:`
      );
    } else {
      outputText = outputText.replaceAll(
        `${instrument.name}:`,
        `_${instrument.name}:`
      );
    }
  });

  const regex = /[a-zA-Z0-9_]+:\s*\n[\s\S]+?\r?\n(?=[a-zA-Z0-9_]*[:\/])/gm;
  let m;
  const matches = [];
  // const instrumentsArray = [];

  while ((m = regex.exec(outputText)) !== null) {
    // Avoiding infinite loop with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach((match, groupIndex) => {
      matches.push(match);
    });
  }

  const matchesVolume = matches.map((match) => {
    return match.replaceAll(
      /(?<!post)gain\(([\d.]+)\)/g,
      (match, captureGroup) => {
        return `gain(${captureGroup * volume})`;
      }
    );
  });

  const matchesFinal = matches.reduce(
    (text, original, i) => text.replaceAll(original, matchesVolume[i]),
    outputText
  );

  return { outputText: matchesFinal };
};

export default Preprocess;
