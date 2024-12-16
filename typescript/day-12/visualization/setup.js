export const serializePlot = ({ x, y, plant }) => `${x}_${y}_${plant}`;

const toMatrix = (input) => input.split("\n").map((line, y) => line.split(""));

const toPlantMatrix = (matrix) =>
  matrix.map((row, y) => row.map((plant, x) => ({ x, y, plant })));

export const getPlots = (input) => toPlantMatrix(toMatrix(input));
