const Preprocess = ({ inputText, volume, cpsMultiplier }) => {
  let outputText = inputText;

  if (cpsMultiplier) {
    outputText = outputText.replace(
      /setcps\(([^)]+)\)/g,
      (match, captureGroup) => {
        console.log("captureGroup", captureGroup);
        return `setcps((${captureGroup}) * ${cpsMultiplier})`;
      }
    );
  }

  const regex = /[a-zA-Z0-9_]+:\s*\n[\s\S]+?\r?\n(?=[a-zA-Z0-9_]*[:\/])/gm;
  let m;
  const matches = [];
  const instrumentNames = [];

  while ((m = regex.exec(outputText)) !== null) {
    // Avoiding infinite loop with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach((match, groupIndex) => {
      matches.push(match);

      // Get the instrument name from the match (words before the colon)
      const instrumentName = match.split(":")[0];
      if (!instrumentNames.includes(instrumentName)) {
        instrumentNames.push(instrumentName);
      }
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

  return { outputText: matchesFinal, instrumentNames };
};

export default Preprocess;
