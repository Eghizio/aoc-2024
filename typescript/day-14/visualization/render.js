import { h, render } from "https://esm.sh/preact";
import { useState, useEffect } from "https://esm.sh/preact/hooks";
import htm from "https://esm.sh/htm";
import { input } from "./input.js";
import { toRobots, getDimensions, simulateRobots } from "./setup.js";

// Initialize htm with Preact
const html = htm.bind(h);

const hasRobot = (robots, x, y) =>
  robots.some(({ x: rx, y: ry }) => rx === x && ry === y);

const Grid = ({ width, height, robots }) => {
  return html`
    <div class="grid">
      ${Array.from(
        { length: height },
        (_, y) =>
          html`<div class="row">
            ${Array.from(
              { length: width },
              (_, x) =>
                html`<div
                  class="cell ${hasRobot(robots, x, y) ? "robot" : ""}"
                />`
            )}
          </div>`
      )}
    </div>
  `;
};

const MAX_ITERATIONS = 7_672;
let iteration = 0;

const App = ({ width, height, robots }) => {
  const [robotsIteration, setRobotsIteration] = useState(robots);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobotsIteration((robots) =>
        simulateRobots(robots, [width, height], 1)
      );

      if (++iteration === MAX_ITERATIONS) clearInterval(interval);
      console.log(iteration);
    }, 0);

    return () => clearInterval(interval);
  }, []);

  return html`<main class="center">
    <h1>Robots iteration: ${iteration}</h1>
    <${Grid} width="${width}" height="${height}" robots="${robotsIteration}" />
  </main>`;
};

const robots = toRobots(input);
const [width, height] = getDimensions(robots);

render(
  html`<${App} width="${width}" height="${height}" robots="${robots}" />`,
  document.body
);
