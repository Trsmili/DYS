let cam;

let stripeWidth = 40;
let stereoOffset = 20;

let mode = "vertical"; 
// vertical | horizontal | half

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  cam = createCapture({
    video: { facingMode: "user" }
  });

  cam.size(width, height);
  cam.hide();
}

function draw() {
  background(0);

  cam.loadPixels();
  loadPixels();

  if (mode === "vertical") {
    drawVerticalStereo(0, width);
  }

  if (mode === "horizontal") {
    drawHorizontalStereo();
  }

  if (mode === "half") {
    // IZQUIERDA: estereoscopía
    drawVerticalStereo(0, width / 2);

    // DERECHA: cámara normal (pixel a pixel)
    drawNormalCamera(width / 2, width);
  }

  updatePixels();
}

/* =========================
   FRANJAS VERTICALES
   ========================= */
function drawVerticalStereo(xStart, xEnd) {
  for (let x = xStart; x < xEnd; x++) {

    let stripeIndex = floor(x / stripeWidth);
    let redDominant = stripeIndex % 2 === 0;

    for (let y = 0; y < height; y++) {

      let leftX  = constrain(x - stereoOffset, 0, width - 1);
      let rightX = constrain(x + stereoOffset, 0, width - 1);

      let leftIndex  = (leftX + y * width) * 4;
      let rightIndex = (rightX + y * width) * 4;
      let dstIndex   = (x + y * width) * 4;

      pixels[dstIndex]     = redDominant ? cam.pixels[leftIndex]     : cam.pixels[rightIndex];
      pixels[dstIndex + 1] = redDominant ? cam.pixels[rightIndex+1]  : cam.pixels[leftIndex+1];
      pixels[dstIndex + 2] = redDominant ? cam.pixels[rightIndex+2]  : cam.pixels[leftIndex+2];
      pixels[dstIndex + 3] = 255;
    }
  }
}

/* =========================
   FRANJAS HORIZONTALES
   ========================= */
function drawHorizontalStereo() {
  for (let y = 0; y < height; y++) {

    let stripeIndex = floor(y / stripeWidth);
    let redDominant = stripeIndex % 2 === 0;

    for (let x = 0; x < width; x++) {

      let upY   = constrain(y - stereoOffset, 0, height - 1);
      let downY = constrain(y + stereoOffset, 0, height - 1);

      let upIndex   = (x + upY * width) * 4;
      let downIndex = (x + downY * width) * 4;
      let dstIndex  = (x + y * width) * 4;

      pixels[dstIndex]     = redDominant ? cam.pixels[upIndex]     : cam.pixels[downIndex];
      pixels[dstIndex + 1] = redDominant ? cam.pixels[downIndex+1] : cam.pixels[upIndex+1];
      pixels[dstIndex + 2] = redDominant ? cam.pixels[downIndex+2] : cam.pixels[upIndex+2];
      pixels[dstIndex + 3] = 255;
    }
  }
}

/* =========================
   CÁMARA NORMAL (SIN FILTRO)
   ========================= */
function drawNormalCamera(xStart, xEnd) {
  for (let x = xStart; x < xEnd; x++) {
    for (let y = 0; y < height; y++) {

      let srcIndex = (x + y * width) * 4;
      let dstIndex = srcIndex;

      pixels[dstIndex]     = cam.pixels[srcIndex];
      pixels[dstIndex + 1] = cam.pixels[srcIndex + 1];
      pixels[dstIndex + 2] = cam.pixels[srcIndex + 2];
      pixels[dstIndex + 3] = 255;
    }
  }
}

/* =========================
   INTERACCIÓN
   ========================= */
function mousePressed() {
  if (mouseY < height / 2) {
    mode = "horizontal";
  } else {
    mode = "half";
  }
}

function mouseReleased() {
  mode = "vertical";
}

function touchStarted() {
  if (mouseY < height / 2) {
    mode = "horizontal";
  } else {
    mode = "half";
  }
  return false;
}

function touchEnded() {
  mode = "vertical";
  return false;
}

