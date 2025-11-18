import { useState, useEffect } from "react";
import * as d3 from "d3";

const Graph = ({ onToggle }) => {
  const [rngArray, setRngArray] = useState([]);
  const maxItems = 50;
  const maxValue = 8000; // cutoff frequency value

  const handleToggle = (event) => {
    const isChecked = event.target.checked;
    onToggle(isChecked);
  };

  function LogToNum(input) {
    if (!input) {
      return 0;
    }
    var stringArray = input.split(/(\s+)/);

    for (const item of stringArray) {
      // Choose the cutoff frequency value from the log data to show in the graph
      if (item.startsWith("cutoff:")) {
        var val = item.substring(7);
        return Number(val);
      }
    }
    return 0;
  }

  useEffect(() => {
    const handleD3Data = (event) => {
      const logData = event.detail;

      if (!logData || logData.length === 0) return;

      const cutoffValues = logData.map((d) => LogToNum(d));

      // Get the last maxItems values and display them
      const newestValues = cutoffValues.slice(-maxItems);

      setRngArray(newestValues);
    };

    document.addEventListener("d3Data", handleD3Data);

    return () => {
      document.removeEventListener("d3Data", handleD3Data);
    };
  }, []);

  useEffect(() => {
    // If no data, skip rendering
    if (rngArray.length === 0) return;

    const svg = d3.select("svg");

    let w = svg.node().getBoundingClientRect().width;
    w = w - 60;
    let h = svg.node().getBoundingClientRect().height;
    h = h - 40;
    const barWidth = w / rngArray.length; // width of each bar

    let yScale = d3.scaleLinear().domain([0, maxValue]).range([h, 0]);

    // Create or select chart group
    let chartGroup = svg.select(".chart-group");
    if (chartGroup.empty()) {
      chartGroup = svg
        .append("g")
        .classed("chart-group", true)
        .attr("transform", `translate(45, 15)`);
    }

    if (svg.select("#line-gradient").empty()) {
      chartGroup
        .append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", yScale(0))
        .attr("x2", 0)
        .attr("y2", yScale(maxValue))
        .selectAll("stop")
        .data([
          { offset: "0%", color: "#6c5ce7" },
          { offset: "50%", color: "#1ed760" },
          { offset: "100%", color: "#fd79a8" },
        ])
        .enter()
        .append("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);
    }

    // Line generator
    const lineGenerator = d3
      .line()
      .x((d, i) => i * barWidth)
      .y((d) => h - yScale(d));

    // Update or create path
    let path = chartGroup.select(".line-path");
    if (path.empty()) {
      path = chartGroup
        .append("path")
        .classed("line-path", true)
        .attr("fill", "none")
        .attr("stroke", "url(#line-gradient)")
        .attr("stroke-width", 3);
    }

    path.datum(rngArray).transition().duration(50).attr("d", lineGenerator);

    // Update or create Y axis
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = chartGroup.select(".axis.y");
    if (yAxisGroup.empty()) {
      yAxisGroup = chartGroup.append("g").classed("axis y", true);
    }
    yAxisGroup.transition().duration(50).call(yAxis);
  }, [rngArray]);

  return (
    <>
      <div className="row m-2 mt-4">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="graphToggle"
            data-bs-toggle="collapse"
            data-bs-target="#graphCollapse"
            aria-expanded="false"
            aria-controls="graphCollapse"
            onChange={handleToggle}
          />
          <label className="form-check-label" htmlFor="graphToggle">
            Show Graph
          </label>
        </div>
      </div>
      <div className="collapse" id="graphCollapse">
        <div className="row m-2">
          <svg
            width="100%"
            height="100%"
            className="border border-primary rounded p-2"
          ></svg>
        </div>
      </div>
    </>
  );
};

export default Graph;
