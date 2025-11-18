import { Link } from "react-router-dom";

const HowToUse = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="text-center mb-4">Documentation</h1>

          <div className="card bg-dark text-white mb-4">
            <div className="card-body">
              <h4 className="card-title">Write Your Pattern</h4>
              <p className="card-text">
                Enter your Strudel code in the{" "}
                <strong>Text to preprocess</strong> textarea on the left.
              </p>

              <h4 className="card-title">Preprocess Your Code</h4>
              <p className="card-text">
                Click the <strong>Process & Play</strong> button to extract
                patterns and prepare your code. The processed code will appear
                in the <strong>Strudel Code</strong> editor on the right.
              </p>

              <h4 className="card-title">Change the Volume</h4>
              <p className="card-text">
                Adjust the <strong>Volume</strong> slider to change the volume
                of the audio.
              </p>

              <h4 className="card-title">Change the CPS</h4>
              <p className="card-text">
                Adjust the <strong>CPS</strong> selection to change the speed of
                the audio.
              </p>

              <h4 className="card-title">Toggle the Instruments</h4>
              <p className="card-text">
                Mute/Unmute the instruments by clicking the switches.
              </p>

              <h4 className="card-title">Show the Graph</h4>
              <p className="card-text">
                Click the <strong>Show Graph</strong> button to show the graph
                of the cutoff frequency of the audio.
              </p>

              <h4 className="card-title">Save and Load the Configuration</h4>
              <p className="card-text">
                Click the <strong>Save</strong> button to save the current
                configuration. Click the <strong>Load</strong> button to load
                the saved configuration.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/" className="btn btn-lg btn-outline-light">
              Back to Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
