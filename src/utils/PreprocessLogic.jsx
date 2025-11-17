const Preprocess = ({
  inputText,
  volume,
  cpsMultiplier,
  instruments,
  showGraph,
}) => {
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

  // Add logging code for graph
  let finalOutput = matchesFinal;
  const logPattern = /^(\s*)(\/\/\s*)?all\(x => x\.log\(\)\)/gm;

  if (showGraph) {
    // Uncomment if there is "// all(x => x.log())", otherwise add "all(x => x.log())" new line
    if (logPattern.test(finalOutput)) {
      finalOutput = finalOutput.replace(logPattern, "all(x => x.log())");
    } else {
      finalOutput = finalOutput + "\nall(x => x.log())";
    }
  } else {
    finalOutput = finalOutput.replace(logPattern, "// all(x => x.log())");
  }

  return { outputText: finalOutput };
};

export default Preprocess;
