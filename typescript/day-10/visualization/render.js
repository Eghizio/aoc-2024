import { input, testInput } from "./input.js";
import { getSpots, serializeSpot } from "./setup.js";

const getColor = (height) => {
  const sat = ((height + 1) / 10) * 100;
  console.log(sat);
  return `hsl(0, ${sat}%, 50%)`;

  //   if (height === 0) return `rgb(255, 0, 0)`;
  //   if (height === 9) return `rgb(0, 255, 0)`;

  //   const saturation = 255 * ((height + 1) / 10);
  //   return `rgb(${saturation}, 0, ${saturation})`;
};

const createSpot = ({ x, y, height }) => {
  const serialized = serializeSpot({ x, y, height });
  const spot = document.createElement("div");
  spot.id = serialized;
  spot.textContent = serialized;
  spot.classList.add("spot", "center");

  if (height === 0) spot.classList.add("tailhead");
  if (height === 9) spot.classList.add("peak");

  // spot.style.backgroundColor = getColor(height);

  spot.style.backgroundColor = "red";
  spot.style.filter = `saturate(${((height + 1) / 10) * 100}%)`;

  return spot;
};

const createRow = (divs) => {
  const row = document.createElement("div");
  row.classList.add("row");
  row.append(...divs);
  return row;
};

(() => {
  const spots = getSpots(input);
  const divRows = spots.map((row) => row.map(createSpot));
  const rows = divRows.map(createRow);

  document.querySelector("main").append(...rows);
})();
