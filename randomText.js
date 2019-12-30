var sourceText = "Life is short and art long";
var curIndex = 0;
function setup() {
  createCanvas(400, 400);
  frameRate(10);
}
function draw() {
  background(50);
  fill(255);
  textSize(144);
  textAlign(CENTER, CENTER);
  text(
    sourceText.substring(curIndex, curIndex+1),
    width/2, height/2);
  curIndex++;
  if (curIndex > sourceText.length) {
    curIndex = 0;
  }
}
