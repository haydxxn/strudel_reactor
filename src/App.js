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
import { saveConfig } from "./utils/jsonConfig";

let globalEditor = null;

function StrudelDemo() {
  const [songText, setSongText] = useState(stranger_tune);
  const [volume, setVolume] = useState(1);
  const [instruments, setInstruments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cpsMultiplier, setCPSMultiplier] = useState(1);
  const hasRun = useRef(false);

  const handlePlay = () => {
    handleProcessAndPlay();
  };

  const handleStop = () => {
    globalEditor.stop();
    setIsPlaying(false);
  };

  const handleSongTextChange = (event) => {
    const newSongText = event.target.value;
    setSongText(newSongText);
    extractInstruments(newSongText);
  };

  const extractInstruments = (inputText) => {
    if (!inputText) {
      setInstruments([]);
      return;
    }

    const instrumentRegex = /^_?([a-zA-Z0-9_]+):/gm;
    const instruments = [];
    const matches = inputText.match(instrumentRegex);

    matches.forEach((match) => {
      const instrumentName = match.split(":")[0];
      const isEnabled = !instrumentName.startsWith("_");

      const instrument = {
        name: !isEnabled ? instrumentName.replace("_", "") : instrumentName,
        isEnabled,
      };
      instruments.push(instrument);
    });
    setInstruments(instruments);
  };

  const handleToggleInstrument = (instrument, isEnabled) => {
    const newInstruments = instruments.map((i) =>
      i.name === instrument ? { ...i, isEnabled } : i
    );

    setInstruments(newInstruments);
  };

  const handleProcessAndPlay = () => {
    if (songText) {
      const { outputText } = Preprocess({
        inputText: songText,
        volume,
        cpsMultiplier,
        instruments,
      });

      globalEditor.setCode(outputText);
      globalEditor.evaluate();
      setIsPlaying(true);
    } else {
      console.error("No song text to process");
    }
  };

  const handleSaveConfig = () => {
    saveConfig({
      songText,
      volume,
      cpsMultiplier,
      instruments,
    });
  };

  const handleLoadConfig = (config) => {
    setSongText(config.songText);
    setVolume(config.volume);
    setCPSMultiplier(config.cpsMultiplier);
    setInstruments(config.instruments);
  };

  useEffect(() => {
    if (isPlaying) {
      handleProcessAndPlay();
    }
  }, [volume, cpsMultiplier, instruments]);

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

      // Extract instruments from initial songText
      extractInstruments(songText);
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
                instruments={instruments}
                onToggleInstrument={handleToggleInstrument}
                cpsMultiplier={cpsMultiplier}
                onCPSChange={setCPSMultiplier}
              />
            </div>
            <SaveButton onSave={handleSaveConfig} onLoad={handleLoadConfig} />
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
