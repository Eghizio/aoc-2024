const toInt = (x) => parseInt(x, 10);

const sanitize = (num) => (isNaN(num) ? -1 : num);

const toMatrix = (input) =>
  input.split("\n").map((line) => line.split("").map(toInt).map(sanitize));

const toSpotMatrix = (matrix) =>
  matrix.map((row, y) => row.map((height, x) => ({ x, y, height })));

export const serializeSpot = ({ x, y, height }) => `${x}_${y}_${height}`;

export const getSpots = (input) => toSpotMatrix(toMatrix(input));
