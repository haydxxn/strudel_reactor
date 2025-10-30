import "./App.css";
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import { initAudioOnFirstClick } from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";
import {
  getAudioContext,
  webaudioOutput,
  registerSynthSounds,
} from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import { stranger_tune } from "./tunes";
import console_monkey_patch, { getD3Data } from "./console-monkey-patch";
import DJButtons from "./components/DJButtons";
import PlayButtons from "./components/PlayButtons";
import ProcButtons from "./components/ProcButtons";
import PreprocessTextarea from "./components/PreprocessTextarea";

let globalEditor = null;

const handleD3Data = (event) => {
  console.log(event.detail);
};

// export function SetupButtons() {
//   document
//     .getElementById("play")
//     .addEventListener("click", () => globalEditor.evaluate());
//   document
//     .getElementById("stop")
//     .addEventListener("click", () => globalEditor.stop());
//   document.getElementById("process").addEventListener("click", () => {
//     Proc();
//   });
//   document.getElementById("process_play").addEventListener("click", () => {
//     if (globalEditor != null) {
//       Proc();
//       globalEditor.evaluate();
//     }
//   });
// }

// export function ProcAndPlay() {
//   if (globalEditor != null && globalEditor.repl.state.started == true) {
//     console.log(globalEditor);
//     Proc();
//     globalEditor.evaluate();
//   }
// }

// export function Proc() {
//   let proc_text = document.getElementById("proc").value;
//   let proc_text_replaced = proc_text.replaceAll("<p1_Radio>", ProcessText);
//   ProcessText(proc_text);
//   globalEditor.setCode(proc_text_replaced);
// }

// export function ProcessText(match, ...args) {
//   let replace = "";
//   if (document.getElementById("flexRadioDefault2").checked) {
//     replace = "_";
//   }

//   return replace;
// }

export default function StrudelDemo() {
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
    const patterns = songText
      .split("\n")
      .filter((line) => line.includes("{pattern_"));
    const parsedPatterns = patterns.map((pattern) => {
      const patternName = pattern.split("{pattern_")[1].split("}")[0]; // Get the pattern between {pattern_ and }
      return patternName;
    });
    setPatterns(parsedPatterns);
  };

  const handleProcess = () => {
    handlePatternChange();
  };

  const handleProcessAndPlay = () => {
    handleProcess();
    globalEditor.evaluate();
    setIsPlaying(true);
  };

  useEffect(() => {
    console.log(volume);
    const volumeSyntax = `all(x => x.gain(${volume}))`;

    const lines = songText.split("\n");
    let found = false;

    const newLines = lines.map((line) => {
      if (line.includes("all(x => x.gain(")) {
        // Check if the line is commented (starts with // after trimming whitespace)
        // Don't need to replace the gain syntax if it's commented
        const trimmedLine = line.trim();
        const isCommented = trimmedLine.startsWith("//");

        // Only replace if the line is NOT commented
        if (!isCommented) {
          found = true;
          // Replace all(x => x.gain(...)) with the new volume syntax
          const updatedLine = line.replace(
            /all\(x\s*=>\s*x\.gain\([^)]*(?:\([^)]*\))*[^)]*\)\)/g,
            volumeSyntax
          );
          return updatedLine;
        }
      }
      return line;
    });

    if (found) {
      setSongText(newLines.join("\n"));
    } else {
      // Append new gain syntax at the end
      setSongText(songText + "\n" + volumeSyntax);
    }

    if (isPlaying) {
      globalEditor.evaluate();
    }
  }, [volume]);

  useEffect(() => {
    if (!hasRun.current) {
      document.addEventListener("d3Data", handleD3Data);
      console_monkey_patch();
      hasRun.current = true;
      //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
      //init canvas
      const canvas = document.getElementById("roll");
      canvas.width = canvas.width * 2;
      canvas.height = canvas.height * 2;
      const drawContext = canvas.getContext("2d");
      const drawTime = [-2, 2]; // time window of drawn haps
      globalEditor = new StrudelMirror({
        defaultOutput: webaudioOutput,
        getTime: () => getAudioContext().currentTime,
        transpiler,
        root: document.getElementById("editor"),
        drawTime,
        onDraw: (haps, time) =>
          drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
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
    <div>
      <h2 className="text-center my-4">Strudel Demo</h2>
      <main>
        <div className="container-fluid">
          <div className="row gap-4" style={{ margin: "5px" }}>
            <div className="col-lg preprocess-section">
              <PreprocessTextarea
                songText={songText}
                onChange={handleSongTextChange}
              />
              <ProcButtons
                onProcess={handleProcess}
                onProcessAndPlay={handleProcessAndPlay}
              />
            </div>
            <div className="col-lg editor-section">
              <label htmlFor="editor" className="form-label">
                Strudel Code
              </label>
              <div id="editor" />
              <div id="output" />
            </div>
          </div>
        </div>
        <canvas id="roll"></canvas>
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
              <DJButtons patterns={patterns} />
            </div>
            <div className="col-sm-3">Save & Load</div>
          </div>
        </div>
      </div>
    </div>
  );
}
