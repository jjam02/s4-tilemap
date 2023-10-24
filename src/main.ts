import "./style.css";

//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas"
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

//defining the textures to use
const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

let active = false;

//defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;

//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

//creating the tilemap nested array
let tilemap: number[][] = new Array(numTiles);

for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    row[j] = 0;
  }
  tilemap[i] = row;
}

//track the selected tiles
let currentTile = 0;

//draw the initial canvases
redrawTilemap();
drawSelectCanvas();

//Function that draws a texture to a specific canvas ctx
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  image: number,
  width: number,
  height: number,
  cellSize: number
) {
  let newImg = new Image();
  newImg.src = imageUrls[image];
  newImg.onload = () => {
    ctx.drawImage(newImg, row * cellSize, col * cellSize, width, height);
  };
  ctx.drawImage(newImg, row * cellSize, col * cellSize, width, height);
}

// ----- Interacting with the main tilemap -----

function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      drawTexture(
        i,
        j,
        gridCtx,
        tilemap[i][j],
        gridCanvas.width / numTiles,
        gridCanvas.height / numTiles,
        tileSize
      );
    }
  }
}

gridCanvas.addEventListener("mousedown", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);
  active = true;
  tilemap[coordX][coordY] = currentTile;
  drawTexture(
    coordX,
    coordY,
    gridCtx,
    currentTile,
    gridCanvas.width / numTiles,
    gridCanvas.height / numTiles,
    tileSize
  );
});
gridCanvas.addEventListener("mousemove", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  tilemap[coordX][coordY] = currentTile;
  if (active) {
    drawTexture(
      coordX,
      coordY,
      gridCtx,
      currentTile,
      gridCanvas.width / numTiles,
      gridCanvas.height / numTiles,
      tileSize
    );
  }
});
gridCanvas.addEventListener("mouseup", () => {
  active = false;
});

// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    drawTexture(0, i, selectCtx, i, selectCanvas.width, selectHeight, 64);
  }
}

selectCanvas.addEventListener("click", (e) => {
  const coordY = Math.trunc(e.offsetY / selectHeight);
  currentTile = coordY;
});
