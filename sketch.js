
var lines = [];
var joinedText = [];
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÉÈÔ',.;:!? ";
counters = [alphabet.length];
var drawLetters = [alphabet.length];
var charSize;
var charColor = 0;
var posX = 20;
var posY = 50;
var drawLines = false;
var drawText = true;


function preload(){
  lines = loadStrings("emotion.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  joinedText = join(lines, " ");

   textFont("Courier");
  textSize(10);

  for (var i = 0; i < alphabet.length; i++) {
    drawLetters[i] = true;
  }

  countCharacters();
}

function draw() {
  background(0, 0);
  noStroke();
  smooth();
  // tint(255, 127);  // Display at half opacity

  posX = 30;
  posY = 200;
  var oldX = 0;
  var oldY = 0;

  // go through all characters in the text to draw them
  for (var i = 0; i < joinedText.length; i++) {
    // again, find the index of the current letter in the alphabet
    s = str(joinedText.charAt(i)).toUpperCase();
    uppercaseChar = s.charAt(0);
    var index = alphabet.indexOf(uppercaseChar);
    if (index < 0) continue;

    fill(255, 0, 0);
    textSize(15);

    var sortY = index*20+40;
    var m = map(mouseX, 50,width-50, 0,1);
    m = constrain(m, 0, 1);
    var interY = lerp(posY, sortY, m);

    if (drawLetters[index]) {
      if (drawLines) {
        if (oldX!=0 && oldY!=0) {
          stroke(0, 100);
          line(oldX,oldY, posX,interY);
        }
        oldX = posX;
        oldY = interY;
      }

      if (drawText) text(joinedText.charAt(i), posX, interY);
    }
    else {
      oldX = 0;
      oldY = 0;
    }

    posX += textWidth(joinedText.charAt(i));
    if (posX >= width-200 && uppercaseChar == ' ') {
      posY += 40;
      posX = 20;
    }
  }
}

function countCharacters(){
  for (var i = 0; i < joinedText.length; i++) {
    // get one char from the text, convert it to a string and turn it to uppercase
    s = str(joinedText.charAt(i)).toUpperCase();
    // convert it back to a char
    uppercaseChar = s.charAt(0);
    // get the position of this char inside the alphabet string
    var index = alphabet.indexOf(uppercaseChar);
    // increase the respective counter
    if (index >= 0) counters[index]++;
  }
}

// function keyPressed(){
//   if (keyCode == CONTROL) {
//     save("P_3_1_3_02.png");
//   }
// }
//
// function keyTyped(){
//   if (key == '1') drawLines = !drawLines;
//   if (key == '2') drawText = !drawText;
//   if (key == '3') {
//     drawText = true;
//     for (var i = 0; i < alphabet.length; i++) {
//       drawLetters[i] = true;
//     }
//   }
//   var s = str(key).toUpperCase();
//   var uppercaseKey = s.charAt(0);
//   var index = alphabet.indexOf(uppercaseKey);
//   if (index >= 0) {
//     drawLetters[index] = !drawLetters[index];
//   }
// }
