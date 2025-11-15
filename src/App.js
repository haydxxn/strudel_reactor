import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { initAudioOnFirstClick } from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";
import {
  getAudioContext,
  webaudioOutput,
  registerSynthSounds,
} from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import { stranger_tune } from "./tunes";
import console_monkey_patch from "./console-monkey-patch";
import DJButtons from "./components/DJButtons";
import PlayButtons from "./components/PlayButtons";
import ProcButtons from "./components/ProcButtons";
import PreprocessTextarea from "./components/PreprocessTextarea";
import Graph from "./components/Graph";
import Navbar from "./components/Navbar";
import HowToUse from "./routes/HowToUse";
import SaveButton from "./components/SaveButton";
import Preprocess from "./utils/PreprocessLogic";

let globalEditor = null;

function StrudelDemo() {
  const [songText, setSongText] = useState(stranger_tune);
  const [volume, setVolume] = useState(1);
  const [patterns, setPatterns] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasRun = useRef(false);

  const handlePlay = () => {
    globalEditor.evaluate();
    setIsPlaying(true);
  };

  const handleStop = () => {
    globalEditor.stop();
    setIsPlaying(false);
  };

  const handleSongTextChange = (event) => {
    setSongText(event.target.value);
  };

  const handlePatternChange = (event) => {
    const patternArray = [...patterns];
    const newSongText = songText.split("\n").map((line) => {
      if (line.includes("{pattern_")) {
        const patternName = line.replace("{pattern_", "").replace("}", "");
        if (
          !patternArray.some(
            (pattern) => pattern.name === patternName.split(":")[0]
          )
        ) {
          const newPattern = {
            name: patternName.split(":")[0], // Get the pattern name without the colon
            isEnabled: true,
          };
          patternArray.push(newPattern);
          return patternName;
        }
      }
      return line;
    });

    setSongText(newSongText.join("\n"));
    setPatterns(patternArray);
  };

  const handleTogglePattern = (patternName, value) => {
    const patternArray = [...patterns];
    const newPattern = patternArray.find((p) => p.name === patternName);
    newPattern.isEnabled = value;
    setPatterns(patternArray);

    let newSongText;
    if (value) {
      newSongText = songText.replaceAll(`_${patternName}:`, `${patternName}:`);
    } else {
      newSongText = songText.replaceAll(`${patternName}:`, `_${patternName}:`);
    }

    setSongText(newSongText);
    globalEditor.setCode(newSongText);

    if (isPlaying) {
      globalEditor.evaluate();
    }
  };

  // const handleProcess = () => {
  //   handlePatternChange();
  // };

  const handleProcessAndPlay = () => {
    const outputText = Preprocess({ inputText: songText, volume });
    console.log(outputText);
    // handlePatternChange();
    globalEditor.setCode(outputText);
    globalEditor.evaluate();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      handleProcessAndPlay();
    }
  }, [volume]);

  useEffect(() => {
    if (!hasRun.current) {
      console_monkey_patch();
      hasRun.current = true;
      //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
      //init canvas
      const drawTime = [-2, 2]; // time window of drawn haps
      globalEditor = new StrudelMirror({
        defaultOutput: webaudioOutput,
        getTime: () => getAudioContext().currentTime,
        transpiler,
        root: document.getElementById("editor"),
        drawTime,
        prebake: async () => {
          initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
          const loadModules = evalScope(
            import("@strudel/core"),
            import("@strudel/draw"),
            import("@strudel/mini"),
            import("@strudel/tonal"),
            import("@strudel/webaudio")
          );
          await Promise.all([
            loadModules,
            registerSynthSounds(),
            registerSoundfonts(),
          ]);
        },
      });
    }

    globalEditor.setCode(songText);
  }, [songText]);

  return (
    <>
      <h2 className="text-center my-4">Strudel Demo</h2>
      <main>
        <div className="container-fluid">
          <div className="row gap-4" style={{ margin: "5px" }}>
            <div className="col-lg preprocess-section">
              <PreprocessTextarea
                songText={songText}
                onChange={handleSongTextChange}
              />
              <ProcButtons onProcessAndPlay={handleProcessAndPlay} />
            </div>
            <div className="col-lg editor-section">
              <label htmlFor="editor" className="form-label">
                Strudel Code
              </label>
              <div id="editor" />
              <div id="output" />
            </div>
          </div>
          <div className="row m-2 mt-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheckDefault"
              />
              <label className="form-check-label" htmlFor="switchCheckDefault">
                Show Graph
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col-lg">
              <Graph />
            </div>
          </div>
        </div>
      </main>
      <div className="bottom-bar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3">
              <PlayButtons
                onPlay={handlePlay}
                onStop={handleStop}
                isPlaying={isPlaying}
                volume={volume}
                onVolumeChange={setVolume}
              />
            </div>
            <div className="col-sm-6">
              <DJButtons
                patterns={patterns}
                onTogglePattern={handleTogglePattern}
              />
            </div>
            <SaveButton />
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StrudelDemo />} />
        <Route path="/how-to-use" element={<HowToUse />} />
      </Routes>
    </>
  );
}
