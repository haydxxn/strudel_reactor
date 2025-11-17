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
import Alert from "./components/Alert";
import { extractInstruments } from "./utils/instrumentUtils";

let globalEditor = null;

function StrudelDemo() {
  const [songText, setSongText] = useState(stranger_tune);
  const [volume, setVolume] = useState(1);
  const [instruments, setInstruments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cpsMultiplier, setCPSMultiplier] = useState(1);
  const [showGraph, setShowGraph] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isShown: false,
    type: "",
    message: "",
    icon: "",
  });
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

    // For everytime the song text changes, extract the instruments (if any) to show in DJButtons
    const extractedInstruments = extractInstruments(newSongText);
    setInstruments(extractedInstruments);
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
        showGraph,
      });

      globalEditor.setCode(outputText);
      globalEditor.evaluate();
      setIsPlaying(true);
    } else {
      setAlertConfig({
        isShown: true,
        type: "danger",
        message: "Please enter a song text to process",
        icon: "exclamation-circle",
      });
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
  }, [volume, cpsMultiplier, instruments, showGraph]);

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

      // Extract instruments to show in DJButtons from initial songText
      const extractedInstruments = extractInstruments(songText);
      setInstruments(extractedInstruments);
    }

    globalEditor.setCode(songText);
  }, [songText]);

  return (
    <>
      <main>
        <div className="container-fluid">
          <h2 className="text-center my-4">Strudel Demo</h2>
          {alertConfig.isShown && (
            <Alert
              type={alertConfig.type}
              message={alertConfig.message}
              icon={alertConfig.icon}
              onClose={() =>
                setAlertConfig((prev) => ({ ...prev, isShown: false }))
              }
            />
          )}
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
          <Graph onToggle={(isShown) => setShowGraph(isShown)} />
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
            <SaveButton
              onSave={handleSaveConfig}
              onLoad={handleLoadConfig}
              onAlert={setAlertConfig}
            />
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
