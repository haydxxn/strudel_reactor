const Preprocess = ({ inputText, volume }) => {
  let outputText = inputText;

  let regex = /[a-zA-Z0-9_]+:\s*\n[\s\S]+?\r?\n(?=[a-zA-Z0-9_]*[:\/])/gm;
  let m;
  let matches = [];

  while ((m = regex.exec(outputText)) !== null) {
    // Avoiding infinite loop with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach((match, groupIndex) => {
      console.log(`Match ${groupIndex}: ${match}`);
      matches.push(match);
    });
  }

  const matchesVolume = matches.map((match) => {
    return match.replaceAll(
      /(?<!post)gain\(([\d.]+)\)/g,
      (match, captureGroup) => {
        console.log("captureGroup", captureGroup);
        return `gain(${captureGroup * volume})`;
      }
    );
  });

  console.log("matchesVolume", matchesVolume);

  let matches3 = matches.reduce(
    (text, original, i) => text.replaceAll(original, matchesVolume[i]),
    outputText
  );

  return matches3;
};

export default Preprocess;
