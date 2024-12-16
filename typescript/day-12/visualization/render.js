import { input, testInput, testInput2, testInput3 } from "./input.js";
import { getPlots, serializePlot } from "./setup.js";

const getColor = (plant) => {
  const hue = (plant.charCodeAt(0) - 65) * 14;
  return `hsl(${hue}, 50%, 50%)`;
};

const createCell = ({ x, y, plant }) => {
  const serialized = serializePlot({ x, y, plant });

  const plot = document.createElement("div");
  plot.id = serialized;

  // debug xy
  // plot.textContent = plant;
  plot.textContent = `${x}:${y} (${plant})`;

  plot.classList.add("cell", "center", plant);

  plot.style.backgroundColor = getColor(plant);

  return plot;
};

const createRow = (divs) => {
  const row = document.createElement("div");
  row.classList.add("row");
  row.append(...divs);
  return row;
};

const createPlot = (input) => {
  const plots = getPlots(input);
  const divRows = plots.map((row) => row.map(createCell));
  const rows = divRows.map(createRow);

  const plot = document.createElement("article");
  plot.classList.add("plot");
  plot.append(...rows);
  return plot;
};

const renderInput = (input) => {
  const plot = createPlot(input);
  document.querySelector("#plots").replaceChildren(plot);
};

const createMenu = (inputs) => {
  const buttons = inputs.map((input) => {
    const size = input.split("\n").length;
    const btn = document.createElement("button");
    btn.textContent = `${size}x${size}`;
    btn.classList.add("btn");

    btn.addEventListener("click", () => {
      [...document.querySelectorAll(".btn.active")].forEach((btn) =>
        btn.classList.remove("active")
      );

      btn.classList.add("active");

      renderInput(input);
    });

    return btn;
  });

  const contrastToggle = document.createElement("input");
  contrastToggle.type = "checkbox";

  contrastToggle.addEventListener("change", (event) => {
    const checked = event.currentTarget.checked;
    const action = checked ? "add" : "remove";

    document.querySelector("#plots").classList[action]("contrast");
  });

  const contrastLabel = document.createElement("label");
  contrastLabel.classList.add("contrast-flip");

  const text = document.createElement("span");
  text.textContent = "Contrast";

  contrastLabel.append(contrastToggle, text);

  const nav = document.createElement("nav");
  nav.classList.add("nav");
  nav.append(...buttons, contrastLabel);

  document.body.prepend(nav);
};

const inputs = [input, testInput, testInput2, testInput3].toSorted((a, b) => {
  const x = a.split("\n").length;
  const y = b.split("\n").length;
  return x - y;
});

createMenu(inputs);

document.querySelector("button.btn").click();

const unhighlightAll = () => {
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.classList.remove("highlighted"));
};

const highlightAll = (letter) => {
  document
    .querySelectorAll(`.cell.${letter}`)
    .forEach((cell) => cell.classList.add("highlighted"));
};

document.querySelector("#plots").addEventListener("mouseover", (event) => {
  if (!event.target.classList.contains("cell")) return;

  const letter = event.target.classList.value.split(" ").pop();

  unhighlightAll();
  highlightAll(letter);
});

document.querySelector("#plots").addEventListener("mouseout", (event) => {
  if (!event.target.classList.contains("cell")) return;

  unhighlightAll();
});
