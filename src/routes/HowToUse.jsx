import { Link } from "react-router-dom";

const HowToUse = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="text-center mb-4">Documentation</h1>

          <div className="card bg-dark text-white mb-4">
            <div className="card-body">
              <h3 className="card-title">Write Your Pattern</h3>
              <p className="card-text">
                Enter your Strudel code in the{" "}
                <strong>Text to preprocess</strong> textarea on the left. To
                parse the pattern (toggle on/off), must use the{" "}
                <code>{`{pattern_name: code}`}</code> syntax.
              </p>

              <h3 className="card-title">Preprocess Your Code</h3>
              <p className="card-text">
                Click the <strong>Preprocess</strong> button to extract patterns
                and prepare your code. The processed code will appear in the{" "}
                <strong>Strudel Code</strong> editor on the right.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link
              to="/"
              className="btn btn-lg"
              style={{
                backgroundColor: "#1DB954",
                color: "white",
                borderRadius: "500px",
                padding: "12px 48px",
                fontWeight: "600",
              }}
            >
              Back to Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
