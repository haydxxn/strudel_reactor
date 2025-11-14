import { useState, useEffect } from "react";
import * as d3 from "d3";

const Graph = () => {
  const [rngArray, setRngArray] = useState([]);
  const maxItems = 50;
  const maxValue = 8000; // cutoff frequency value

  function LogToNum(input) {
    if (!input) {
      return 0;
    }
    var stringArray = input.split(/(\s+)/);

    for (const item of stringArray) {
      if (item.startsWith("cutoff:")) {
        var val = item.substring(7);
        console.log("val", val);
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

      // Get the last maxItems and display them
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
    w = w - 40;
    let h = svg.node().getBoundingClientRect().height;
    h = h - 25;
    const barWidth = w / rngArray.length; // width of each bar

    let yScale = d3.scaleLinear().domain([0, maxValue]).range([h, 0]);

    // Create or select chart group
    let chartGroup = svg.select(".chart-group");
    if (chartGroup.empty()) {
      chartGroup = svg
        .append("g")
        .classed("chart-group", true)
        .attr("transform", `translate(30, 3)`);
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
          { offset: "0%", color: "#1DB954" },
          { offset: "50%", color: "#1ed760" },
          { offset: "100%", color: "#1aa34a" },
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

    path
      .datum(rngArray)
      .transition()
      .duration(50) // smoothtransition
      .attr("d", lineGenerator);

    // Update or create Y axis
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = chartGroup.select(".axis.y");
    if (yAxisGroup.empty()) {
      yAxisGroup = chartGroup.append("g").classed("axis y", true);
    }
    yAxisGroup.transition().duration(50).call(yAxis);
  }, [rngArray]);

  return (
    <div className="row m-2 mt-4">
      <svg
        width="100%"
        height="100%"
        className="border border-primary rounded p-2"
      ></svg>
    </div>
  );
};

export default Graph;
