/// FOR PATH FINDING
var cnv;
var montrealMap;
var nodes = new Map();
var counter = 0;
var firstCreated = false;
var secondCreated = false;
var alreadyInNodes = false;
var alreadyInNodes2 = false;

var minX;
var maxX;
var minY;
var maxY;
var centerX;
var centerY;
var TILE_SIZE = 256;
var zoomLevel = 14;
var zoom;
var zoom1;
var previousZoom = 14;
var slider;
var sliderValue = 0;
var levelRand = 1;

var once = true;
var twice = false;
var newKeyA = false;
var newKeyB = false;
var keyA;
var keyB;
var keyAGraphic;
var keyBGraphic;
var pg;

//var for path storing
var pathAB = [];
var pathABshort = [];
// variable for storing distance
var recordDistance;
//variable for size of nodes map
var nodeLength;
//variable for best record
var bestRecord;
//variable for storing possibilities in order
var pathOrder = [];
//variable for keeping length of pathAB in memory
var pathLength;
//variable for randomPaths
var pathRan = [];
//variable for total number of possible paths
var totalPath;
//variable for counting paths
var countPath = 0;
//array for storing all the nodes possible from A to B
var possNodes = [];
var compute = false;
var visitedNodes = [];


/// FOR RESEARCH
var input, button, greeting;
var input2, button2;
var sel, sel2;
var buttonAlt;
var randText;
var montrealMap;
var xA = 0;
var yA = 0;
var xB = 0;
var yB = 0;
var minX, minY, maxX, maxY;

var locationA, locationB;
var infoA = [];
var infoB = [];

function preload() {
  // Get the most recent earthquake in the database
  //var url = "lignes_mtl_nord.geojson";
  var url = "lignes_mtl_nord_mtl_st_michel_5_pluspetit.geojson"

  montrealMap = loadJSON(url);
}

function setup() {

  /******** CREATE THE ARRAY OF NODES ********/

  //centerX = -73.60673887760862; //minX + (maxX - minX) / 2;
  //centerY = 45.58713107040157; //minY + (maxY - minY) / 2;
  //centerX = (-73.65756501638587 + -73.56005762368885)/2;
  //centerY = (45.586744466452835 + 45.54020210061575)/2;
  //centerX = minX + (maxX - minX) / 2;
  //centerY = minY + (maxY - minY) / 2;

  //centerY = 45.56347328353429;
  //centerX = -73.60881132003736;

  centerY = 45.5582770273539;
  centerX = -73.60383435668615;

  var siny = Math.sin(centerY * Math.PI / 180);
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  worldCenterX = TILE_SIZE * (0.5 + centerX / 360);
  worldCenterY = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
  pixCenterX = worldCenterX * Math.pow(2, zoomLevel);
  pixCenterY = worldCenterY * Math.pow(2, zoomLevel);



  for (var i = 0; i < montrealMap.features.length; i++) {
    if (nodes.size == 0) {
      var end1 = montrealMap.features[i].geometry.coordinates.length - 1;
      nodes.set(2 * i, new Node(montrealMap.features[i].geometry.coordinates[0][0], montrealMap.features[i].geometry.coordinates[0][1]));
      nodes.set(2 * i + 1, new Node(montrealMap.features[i].geometry.coordinates[end1][0], montrealMap.features[i].geometry.coordinates[end1][1]));

    } else {

      for (var [key, value] of nodes) {

        alreadyInNodes = (nodes.get(key).x == montrealMap.features[i].geometry.coordinates[0][0] && nodes.get(key).y == montrealMap.features[i].geometry.coordinates[0][1]);

        var end1 = montrealMap.features[i].geometry.coordinates.length - 1;
        if (alreadyInNodes2 == false) {
          alreadyInNodes2 = (nodes.get(key).x == montrealMap.features[i].geometry.coordinates[end1][0] && nodes.get(key).y == montrealMap.features[i].geometry.coordinates[end1][1]);
        }
      }

      if (alreadyInNodes) {} else {
        nodes.set(2 * i, new Node(montrealMap.features[i].geometry.coordinates[0][0], montrealMap.features[i].geometry.coordinates[0][1]));
      }
      if (alreadyInNodes2) {} else {
        nodes.set(2 * i + 1, new Node(montrealMap.features[i].geometry.coordinates[end1][0], montrealMap.features[i].geometry.coordinates[end1][1]));
      }
    }
    alreadyInNodes = false;
    alreadyInNodes2 = false;
  }



      // minX = nodes.get(0).x;
      // maxX = nodes.get(0).x;
      //
      // minY = nodes.get(0).y;
      // maxY = nodes.get(0).y;

  for (var [key, value] of nodes) {


      // if (nodes.get(key).x < minX) {
      //   minX = nodes.get(key).x;
      // }
      // if (nodes.get(key).x > maxX) {
      //   maxX = nodes.get(key).x;
      // }
      // if (nodes.get(key).y < minY) {
      //   minY = nodes.get(key).y;
      // }
      // if (nodes.get(key).y > maxY) {
      //   maxY = nodes.get(key).y;
      // }

    // create connnections
    for (var i = 0; i < montrealMap.features.length; i++) {

      var end1 = montrealMap.features[i].geometry.coordinates.length - 1;

      if (nodes.get(key).x == montrealMap.features[i].geometry.coordinates[0][0] && nodes.get(key).y == montrealMap.features[i].geometry.coordinates[0][1]) {
        var linkKey;

        for (var [key2, value2] of nodes) {
          if (nodes.get(key2).x == montrealMap.features[i].geometry.coordinates[end1][0] && nodes.get(key2).y == montrealMap.features[i].geometry.coordinates[end1][1]) {
            linkKey = key2;
            break;
          }
        }

        nodes.get(key).arrayNodes[nodes.get(key).arrayNodes.length] = linkKey;
        var nextElement = nodes.get(key).mapPath.length;
        nodes.get(key).mapPath[nextElement] = [];

        for (var j = 0; j < end1 + 1; j++) {

          nodes.get(key).mapPath[nextElement][2 * j] = montrealMap.features[i].geometry.coordinates[j][0];
          nodes.get(key).mapPath[nextElement][2 * j + 1] = montrealMap.features[i].geometry.coordinates[j][1];

        }
      } else if (nodes.get(key).x == montrealMap.features[i].geometry.coordinates[end1][0] && nodes.get(key).y == montrealMap.features[i].geometry.coordinates[end1][1]) {

        var linkKey;

        for (var [key2, value2] of nodes) {
          if (nodes.get(key2).x == montrealMap.features[i].geometry.coordinates[0][0] && nodes.get(key2).y == montrealMap.features[i].geometry.coordinates[0][1]) {
            linkKey = key2;
            break;
          }
        }

        nodes.get(key).arrayNodes[nodes.get(key).arrayNodes.length] = linkKey;
        var nextElement = nodes.get(key).mapPath.length;
        nodes.get(key).mapPath[nextElement] = [];
        for (var j = 0; j < end1 + 1; j++) {

          nodes.get(key).mapPath[nextElement][2 * j] = montrealMap.features[i].geometry.coordinates[j][0];
          nodes.get(key).mapPath[nextElement][2 * j + 1] = montrealMap.features[i].geometry.coordinates[j][1];

        }
      }
    }
  }

  /******** SETTING UP THE CANVAS ********/

  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();

  //pg = createGraphic(windowWidth, windowHeight);

  background(50, 0);
  noFill();
  stroke(255,0,0);
  strokeWeight(3);
  //rect(0+3, 0+3, width-6, height-6);
  // load location logo
  keyAGraphic =  createImg('./media/loc.png');
  keyAGraphic.size(50, 50);
  keyAGraphic.hide();
  keyBGraphic =  createImg('./media/loc.png');
  keyBGraphic.hide();
  keyBGraphic.size(50, 50);

  // display the nodes
  for (var [key, value] of nodes) {
    nodes.get(key).display();
  }

  greeting = createElement('h2', 'hey, enter your location and destination');
  greeting.style("color", "#ffffff");
  greeting.position(10, -15);
  fill(0);

  // create the buttons to input the locations
//  input = createInput();
//  input.position(20, greeting.y + greeting.height + 30);

  sel = createSelect();
  sel.position(20, greeting.y + greeting.height + 40);
  sel.option('enter location');
  sel.option('7361 Saint-Michel');
  sel.option('8000 Saint-Michel');
  sel.option('3150 Saint-Zotique');
  sel.option('7301 6e');
  sel.changed(greet);

//  button = createButton('enter');
  //button.position(input.x + input.width, greeting.y + greeting.height + 33);
  //button.mousePressed(greet);

  //input2 = createInput();
  //input2.position(20, input.y + input.height + 10);


   sel2 = createSelect();
   sel2.position(20, sel.y + sel.height + 15);
   sel2.option('enter destination');
   sel2.option('2550 Jean-Talon');
   sel2.option('3396 Beaubien');
   sel2.option('6951 20e');
   sel2.option('6713 Ecores');
   sel2.changed(greet2);

//  button2 = createButton('enter');
//  button2.position(input2.x + input2.width, input.y + input.height + 13);
//  button2.mousePressed(greet2);

  randomText = createElement('h4', 'randomness');
  randomText.style("color", "#ffffff");
  //randomText.position(20, input2.y + input2.height - 10);
  randomText.position(20, sel2.y + sel2.height - 10);

  slider = createSlider(0, 3, 0, 1);
  slider.position(10, randomText.y + randomText.height + 30);

  buttonAlt = createButton('ALT.PATH');
  buttonAlt.position(20,  slider.y +  slider.height + 20);
  buttonAlt.mousePressed(newCalculation);

  textAlign(CENTER);
  textSize(50);

  zoom = selectAll('.zoom');
  // check for the zoomlevel of the Google map
  for (var i = 0; i < zoom.length; i++) {
    zoom1 = zoom[i].html();
  }

  zoomLevel = parseInt(zoom1);
  previousZoom = zoomLevel;

fill(255, 0, 0);
  //ellipse(width/2, height/2, 10, 10);
}

/****** activated when window is resized *******/
/*function windowResized() {
  centerCanvas();
}*/

/****** CENTER CANVAS ********/
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  //x = windowWidth
  //x = 200;
  //y = 200;
  //x -= 8;
  cnv.position(x, y);
}

/******* DRAW FUNCTION *******/

function draw() {

  if (newKeyA || newKeyB || sliderValue != slider.value()){
    console.log("i just cleared evt");
    //pg.noFill();
    clear();
    //newKeyA = true;
    //newKeyB = true;
  }
  // check if a new locations (A or B) as been entered
  newLocation();



  // check for the zoomlevel of the Google map
  zoom = selectAll('.zoom');
  for (var i = 0; i < zoom.length; i++) {
    zoom1 = zoom[i].html();
  }

  zoomLevel = parseInt(zoom1);
  pixCenterX = worldCenterX * Math.pow(2, zoomLevel);
  pixCenterY = worldCenterY * Math.pow(2, zoomLevel);

  // if the zoomlevel changes, resize the map and redraw the input
  /*if (zoomLevel != previousZoom) {
    // delete the canvas
    noCanvas();
    // create a new canvas
    createCanvas(600, 600);
    // redraw the map
    background(50, 0);
    for (var [key, value] of nodes) {
      nodes.get(key).display();
    }

    input = createInput();
    input.position(20, 70);

    button = createButton('enter');
    button.position(input.x + input.width, 74);
    button.mousePressed(greet);

    input2 = createInput();
    input2.position(20, 95);

    button2 = createButton('enter');
    button2.position(input2.x + input2.width, 93);
    button2.mousePressed(greet2);

    greeting = createElement('h2', 'hey, enter your locations');
    greeting.style("color", "#ff0000");
    greeting.position(20, 20);

    slider = createSlider(0, 4, 0, 1);
    slider.position(10, 115);

    randomText = createElement('h4', 'randomness');
    randomText.style("color", "#ff0000");
    randomText.position(slider.x + slider.width, 115);

    textAlign(CENTER);
    textSize(50);

    // update the zoomlevel
    previousZoom = zoomLevel;
  }*/

  if (compute) {
    pathLength = possNodes.length;

    for (var i = 0; i < pathLength; i++) {
      pathOrder[i] = i;
    }

    //variable to be assigned to recordDistance
    var pathD = pathDistance(possNodes, pathOrder);
    recordDistance = pathD;
    //bestRecord is a copy of the record of the best distance between nodes
    //might be better to use mapPath
    bestRecord = pathOrder.slice();
    totalPath = factorial(pathLength);
    console.log("PL" + pathLength);
    console.log("PO" + pathOrder.length);
    console.log("TP" + totalPath);
    console.log("BR" + bestRecord);

    //drawing order of path
    noFill();
    beginShape();
    for (var i = 0; i < pathOrder.length; i++) {
      var n = bestRecord[i];
      stroke(255, 0, 255, 155);
      strokeWeight(5);
      nX = map(nodes.get(possNodes[n]).x, minX, maxX, 0, width);
      nY = map(nodes.get(possNodes[n]).y, minY, maxY, height, 0);
      vertex(nX, nY);
    }
    endShape();
    beginShape();
    for (var i = 0; i < pathOrder.length; i++) {
      var n = pathOrder[i];
      writtenPath += n;
      console.log('inside2');
      writtenPath += '-->';
      stroke(255, 255, 255, 255);
      strokeWeight(2);
      nX = map(nodes.get(possNodes[n]).x, minX, maxX, 0, width);
      nY = map(nodes.get(possNodes[n]).y, minY, maxY, height, 0);
      vertex(nX, nY);
    }
    endShape();


    //if smaller distance is found, assign that distance to recordDistance
    var newD = pathDistance(possNodes, pathOrder);
    if (newD < recordDistance) {
      recordDistance = newD;
      bestRecord = pathOrder.slice();
      console.log(recordDistance);
    }

    textSize(32);
    fill(0);
    var percent = 100 * (countPath / totalPath);
    console.log("countPath" + countPath);
    text(nf(percent, 0, 2) + "% completed", 20, height / 1.3);
    nextOrderP(pathOrder);
  }
}


/******** NODE CLASS *********/

function Node(newX, newY) {
  this.x = newX;
  this.y = newY;
  this.long = newX;
  this.lat = newY;

  // compute the WORLD coordinates that match the Google map
  var siny = Math.sin(this.lat * Math.PI / 180);
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  this.worldX = TILE_SIZE * (0.5 + this.long / 360);
  this.worldY = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));

  this.pixX = this.worldX * Math.pow(2, zoomLevel);
  this.pixY = this.worldY * Math.pow(2, zoomLevel);

  this.r = 2;
  this.arrayNodes = [];
  this.mapPath = [];
  //boolean variable for if node visited
  this.passed = false;
  //boolean variable for if node visited
  this.passed2 = false;
  //variable for previous node before active once
  this.previous = [];
  this.previous2 = null;
  this.next = [];

  this.display = function() {
    var siny = Math.sin(this.lat * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    this.worldX = TILE_SIZE * (0.5 + this.long / 360);
    this.worldY = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));

    this.pixX = this.worldX * Math.pow(2, zoomLevel);
    this.pixY = this.worldY * Math.pow(2, zoomLevel);

    var TILE_SIZE = 256;
    var graphX = width / 2 + (this.pixX - pixCenterX);
    var graphY = height / 2 + (this.pixY - pixCenterY);

    // draw the lines in between the nodes
    for (var i = 0; i < this.mapPath.length; i++) {
      for (var j = 0; j < this.mapPath[i].length / 2; j++) {

        //apply the mercator projection on every coordinates
        // first extremity
        var graphX2Temp = TILE_SIZE * (0.5 + this.mapPath[i][2 * j] / 360);
        var graphX2Temp1 = graphX2Temp * Math.pow(2, zoomLevel);
        var graphX2 = width / 2 + (graphX2Temp1 - pixCenterX);

        var siny = Math.sin(this.mapPath[i][2 * j + 1] * Math.PI / 180);
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);
        var graphY2Temp = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
        var graphY2Temp1 = graphY2Temp * Math.pow(2, zoomLevel);
        var graphY2 = height / 2 + (graphY2Temp1 - pixCenterY);

        //last extremity
        var graphX3Temp = TILE_SIZE * (0.5 + this.mapPath[i][2 * j + 2] / 360);
        var graphX3Temp1 = graphX3Temp * Math.pow(2, zoomLevel);
        var graphX3 = width / 2 + (graphX3Temp1 - pixCenterX);

        var siny2 = Math.sin(this.mapPath[i][2 * j + 3] * Math.PI / 180);
        siny2 = Math.min(Math.max(siny2, -0.9999), 0.9999);
        var graphY3Temp = TILE_SIZE * (0.5 - Math.log((1 + siny2) / (1 - siny2)) / (4 * Math.PI));
        var graphY3Temp1 = graphY3Temp * Math.pow(2, zoomLevel);
        var graphY3 = height / 2 + (graphY3Temp1 - pixCenterY);

        //var graphY3 = map(graphY3Temp, minY, maxY, 0, height);

        //console.log(dist(graphX2, graphY2, graphX3, graphY3));
        // draw a line between the coordinates
       //  stroke(0, 255, 0, 255);
       // strokeWeight(1);
       //  line(graphX2, graphY2, graphX3, graphY3);
      }
    }
  }

  /*this.project() = function() {
    var siny = Math.sin(this.lat * Math.PI / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);


      worldX = TILE_SIZE * (0.5 + this.long / 360);
      worldY = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
  }*/
}

//



function newLocation() {
  if (newKeyA) {
    newKeyA = false;

    // check the closest distance to a node from address A
    var x = xA;
    var y = yA;
    var distance = 500;

    for (var [key, value] of nodes) {
      var nodeX = nodes.get(key).x;
      var nodeY = nodes.get(key).y;

      if (dist(x, y, nodeX, nodeY) < distance) {
        distance = dist(x, y, nodeX, nodeY);
        keyA = key;
      }
    }
    console.log("keyA: " + keyA);

    fill(255, 0, 0, 255);
    // trace in world coordinates
    //apply the mercator projection on every coordinates
    var graphAX1 = TILE_SIZE * (0.5 + nodes.get(keyA).x / 360);
    var graphAX2 = graphAX1 * Math.pow(2, zoomLevel);
    var graphAX = width / 2 + (graphAX2 - pixCenterX);


    var siny = Math.sin(nodes.get(keyA).y * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    var graphAY1 = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
    var graphAY2 = graphAY1 * Math.pow(2, zoomLevel);
    var graphAY = height / 2 + (graphAY2 - pixCenterY);

    //imageMode(CENTER);
    keyAGraphic.position(graphAX + cnv.x - keyAGraphic.width/2, graphAY + cnv.y - keyAGraphic.height);
    //console.log("key a graph x: " + keyAGraphic.x);
    //console.log("key A x: " + graphAX);
    keyAGraphic.show();
    //ellipse(graphAX, graphAY, 10, 10);
    once = false;
    twice = true;

  } else if (newKeyB) {
    newKeyB = false;
    // check the closest distance to a node from address B
    var x = xB;
    var y = yB;
    var distance = 500;

    for (var [key, value] of nodes) {
      var nodeX = nodes.get(key).x;
      var nodeY = nodes.get(key).y;
      if (dist(x, y, nodeX, nodeY) < distance) {
        distance = dist(x, y, nodeX, nodeY);
        keyB = key;
      }
    }

    console.log("keyB: " + keyB);

    fill(255, 0, 0, 255);
    var graphBX1 = TILE_SIZE * (0.5 + nodes.get(keyB).x / 360);
    var graphBX2 = graphBX1 * Math.pow(2, zoomLevel);
    var graphBX = width / 2 + (graphBX2 - pixCenterX);

    var siny = Math.sin(nodes.get(keyB).y * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    var graphBY1 = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
    var graphBY2 = graphBY1 * Math.pow(2, zoomLevel);
    var graphBY = height / 2 + (graphBY2 - pixCenterY);

    //ellipse(graphBX, graphBY, 10, 10);

    keyBGraphic.position(graphBX + cnv.x - keyBGraphic.width/2, graphBY + cnv.y - keyBGraphic.height);
    keyBGraphic.show();

    once = false;
    twice = false;
  }
}

function newCalculation() {
  var counter = 0;
  var prevPrevKey = -1;
  var prevKey = keyA;
  var finalKey = keyB;
  var currentKey;
  var index;
  var prevX, prevY;
  var prevX2, prevY2;
  var currentX, currentY;
  var currentX2, currentY2;
  //replaces Grid 2D array in the pathfinding example, represents all elements of our map
  var nodesMap = [prevKey];
  //queue array where we push locations
  var nodesQueue = [];
  //new location pushed in nodesQueue array
  var currentLocation;

  //queue array where we push locations
  var nodesStack = [];
  //new location pushed in nodesStack array
  var currentLocation;
  //counterBs
  var counterB = 0;
  sliderValue = slider.value();
  console.log("slider blup: " + slider.value());// map(slider.value(), 0, 255, 1, 5);
  var counterFirstB = 0;
  var counterOtherB = 0;
  var counterBinQueue = 0;
  // var possCounter = 0;
  //variable for mapping the nodes in order array
  var nX, nY;

  //if (newKeyA && newKeyB) {
    //if (keyCode === 32) {

      // breath for seach algo - find the shortest path (use a queue)
      nodesQueue.push(keyA);

      while (nodesQueue.length > 0) {
        //take out first element of queue out of array
        var previousCounterB;
        currentLocation = nodesQueue.shift();
        //if we arrived to goal, break loop
        if (counterBinQueue == 1) {
          counterBinQueue = 0;
        //if (currentLocation == keyB){
          // count occurrences of keyB
          counterB++;
          // reset counterOtherB if a keyB is found in the queue
          counterOtherB = 0;
          console.log('counter: ' + counterB);
          //console.log("length " + nodesQueue.length)
          //88888888
          console.log("slider: " + sliderValue);
          //(sliderValue + 1) * 5
          if (counterB == (sliderValue + 1)) {
            console.log("counterB == sliderValue + 1");
            break;
          }
        }

        if (counterOtherB > counterFirstB * 2) {
          console.log("break because queue is too long.");
          break;
        }

        var connected = nodes.get(currentLocation).arrayNodes;
        var prevArray = nodes.get(currentLocation).previous;

        for (var i = 0; i < connected.length; i++) {
          //variable for chosen node in arrayNodes
          var near = connected[i];
          //if node in arrayNodes not visited, mark as visited and set its previous to currentLocation
          //push chosen node from arrayNodes in the queue

          // if near is a previous location of the current locaton removed it from the possibilities
          var alreadyPrev = false;

          for (var j = 0; j < prevArray.length; j++) {
            // verify if near is part of the previous location of the current location
            alreadyPrev = (prevArray[j] == near);
            if (alreadyPrev) {
              break;
            }
          }

          if (!alreadyPrev) {
            // if the near is not a previous location of the current, check if the currentlocation was already a previous location of near
            var alreadyInPrev = false;
            for (var k = 0; k < nodes.get(near).previous.length; k++) {
              // check if current loc is already in the previous array of near
              if (nodes.get(near).previous[k] == currentLocation) {
                alreadyInPrev = true;
                break;
              }
            }
            // if the near is not a previous location of the current, check if near was already a next location of currentLocation
            var alreadyInNext = false;
            for (var k = 0; k < nodes.get(currentLocation).next.length; k++) {
              // check if current loc is already in the previous array of near
              if (nodes.get(near).previous[k] == currentLocation) {
                alreadyInNext = true;
                break;
              }
            }

            //if it isnt a previous location, add it to the previous array of near.
            if (!alreadyInPrev) {
              nodes.get(near).previous[nodes.get(near).previous.length] = currentLocation;
            }
            // if it isnt a next location, add it to the next location of current location;
            if (!alreadyInNext && currentLocation != keyB) {
              nodes.get(currentLocation).next[nodes.get(currentLocation).next.length] = near;
            }
            // add it to the queue anyway
            //  if (near != keyB){
            nodesQueue.push(near);
            if (near == keyB){
              counterBinQueue++;
              console.log("first counter B:" +counterFirstB);
            }
            //}
            // record the amount of segments needed for the shortest path
            if (counterB == 0) {
              counterFirstB++;
            }
            // number of pushed near since last found B
            counterOtherB++;
          }
        }
      }

      console.log("it broke and now it traces");
      // draw the visited node during breadth-first search algo!
      drawTheNext(keyA);

      // CREATE ALT PATH (use a stack)
      nodesStack.push(keyA);
      //marks start location as visited
      nodes.get(keyA).passed2 = true;

      //while the queue is not empty
      while (nodesStack.length > 0) {
        //take out first element of queue out of array
        currentLocation = nodesStack.pop();

        if (currentLocation == keyB) {
          break;
        }

        var connected2 = nodes.get(currentLocation).arrayNodes;
        // var prevArray = nodes.get(currentLocation).previous;
        for (var i = 0; i < connected2.length; i++) {
          //variable for chosen node in arrayNodes
          var near2 = connected2[i];
          var inThere = false;
          for (var j = 0; j < visitedNodes.length; j++) {
            if (near2 == visitedNodes[j]) {
              inThere = true;
              break;
            }
          }
          if (!nodes.get(near2).passed2 && inThere) {
            nodes.get(near2).passed2 = true;
            nodes.get(near2).previous2 = currentLocation;
            nodesStack.push(near2);
            //console.log("nodesQ"+nodesQueue);

          }
        }
      }
      pathABshort.push(keyB);
      //get chosen node connected to goal
      var next1 = nodes.get(keyB).previous[0];
      //console.log("next" + next);
      //while node has previous node
      while (next1 != null) {
        //push chosen node in array
        pathABshort.push(next1);
        //assign next to be its previous node
        next1 = nodes.get(next1).previous[0];
        //console.log("next " + next);
      }
      // DRAW the Shortest PAth
      for (var i = pathABshort.length - 1; i >= 0; i--) {
        var n = pathABshort[i];
        if (i != 0) {

          var whereInMapPath;
          for (var k = 0; k < nodes.get(n).arrayNodes.length; k++){
            if (nodes.get(n).arrayNodes[k] == pathABshort[i - 1]){
              whereInMapPath = k;
              //console.log("position in arrayNodes" + k);
              break;
            }
          }

          for (var j = 0; j < nodes.get(n).mapPath[whereInMapPath].length / 2; j++) {
            //console.log("im hereerer!");
            //apply the mercator projection on every coordinates
            // first extremity
            //console.log("long: " + nodes.get(n).mapPath[whereInMapPath][2 * j]);
            var graphX2Temp = TILE_SIZE * (0.5 + nodes.get(n).mapPath[whereInMapPath][2 * j] / 360);
            var graphX2Temp1 = graphX2Temp * Math.pow(2, zoomLevel);
            var graphX2 = width / 2 + (graphX2Temp1 - pixCenterX);
          //  console.log(graphX2);

            var siny = Math.sin(nodes.get(n).mapPath[whereInMapPath][2 * j + 1] * Math.PI / 180);
            siny = Math.min(Math.max(siny, -0.9999), 0.9999);
            var graphY2Temp = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
            var graphY2Temp1 = graphY2Temp * Math.pow(2, zoomLevel);
            var graphY2 = height / 2 + (graphY2Temp1 - pixCenterY);

            //last extremity
            var graphX3Temp = TILE_SIZE * (0.5 + nodes.get(n).mapPath[whereInMapPath][2 * j + 2] / 360);
            var graphX3Temp1 = graphX3Temp * Math.pow(2, zoomLevel);
            var graphX3 = width / 2 + (graphX3Temp1 - pixCenterX);

            var siny2 = Math.sin(nodes.get(n).mapPath[whereInMapPath][2 * j + 3] * Math.PI / 180);
            siny2 = Math.min(Math.max(siny2, -0.9999), 0.9999);
            var graphY3Temp = TILE_SIZE * (0.5 - Math.log((1 + siny2) / (1 - siny2)) / (4 * Math.PI));
            var graphY3Temp1 = graphY3Temp * Math.pow(2, zoomLevel);
            var graphY3 = height / 2 + (graphY3Temp1 - pixCenterY);

            //var graphY3 = map(graphY3Temp, minY, maxY, 0, height);

            //console.log(dist(graphX2, graphY2, graphX3, graphY3));
            // draw a line between the coordinates
            stroke(1, 69, 88, 255);
            strokeWeight(5);
            line(graphX2, graphY2, graphX3, graphY3);
          }
        }
      }

      //put goal in array
      pathAB.push(keyB);
      //get chosen node connected to goal
      var next2 = nodes.get(keyB).previous2;
      //while node has previous node
      while (next2 != null) {
        //push chosen node in array
        pathAB.push(next2);
        //assign next to be its previous node
        next2 = nodes.get(next2).previous2;
      }

      //var writtenPath = "";
      for (var i = pathAB.length - 1; i >= 0; i--) {
        var n = pathAB[i];
        //console.log(n);
      //  writtenPath += n;
        if (i != 0) {

        var whereInMapPath;
        for (var k = 0; k < nodes.get(n).arrayNodes.length; k++){
          if (nodes.get(n).arrayNodes[k] == pathAB[i - 1]){
            whereInMapPath = k;
            //console.log("position in arrayNodes" + k);
            break;
          }
        }

        for (var j = 0; j < nodes.get(n).mapPath[whereInMapPath].length / 2; j++) {
          //console.log("im hereerer!");
          //apply the mercator projection on every coordinates
          // first extremity
          //console.log("long: " + nodes.get(n).mapPath[whereInMapPath][2 * j]);
          var graphX2Temp = TILE_SIZE * (0.5 + nodes.get(n).mapPath[whereInMapPath][2 * j] / 360);
          var graphX2Temp1 = graphX2Temp * Math.pow(2, zoomLevel);
          var graphX2 = width / 2 + (graphX2Temp1 - pixCenterX);
          //console.log(graphX2);

          var siny = Math.sin(nodes.get(n).mapPath[whereInMapPath][2 * j + 1] * Math.PI / 180);
          siny = Math.min(Math.max(siny, -0.9999), 0.9999);
          var graphY2Temp = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
          var graphY2Temp1 = graphY2Temp * Math.pow(2, zoomLevel);
          var graphY2 = height / 2 + (graphY2Temp1 - pixCenterY);

          //last extremity
          var graphX3Temp = TILE_SIZE * (0.5 + nodes.get(n).mapPath[whereInMapPath][2 * j + 2] / 360);
          var graphX3Temp1 = graphX3Temp * Math.pow(2, zoomLevel);
          var graphX3 = width / 2 + (graphX3Temp1 - pixCenterX);

          var siny2 = Math.sin(nodes.get(n).mapPath[whereInMapPath][2 * j + 3] * Math.PI / 180);
          siny2 = Math.min(Math.max(siny2, -0.9999), 0.9999);
          var graphY3Temp = TILE_SIZE * (0.5 - Math.log((1 + siny2) / (1 - siny2)) / (4 * Math.PI));
          var graphY3Temp1 = graphY3Temp * Math.pow(2, zoomLevel);
          var graphY3 = height / 2 + (graphY3Temp1 - pixCenterY);

          //var graphY3 = map(graphY3Temp, minY, maxY, 0, height);

          //console.log(dist(graphX2, graphY2, graphX3, graphY3));
          // draw a line between the coordinates
          stroke(230, 75, 60, 255);
          strokeWeight(3);
          line(graphX2, graphY2, graphX3, graphY3);
          //image(pg, 0, 0);
        }

          /*stroke(255, 0, 0, 255);
          strokeWeight(2);
          line(prevX5, prevY5, currentX5, currentY5);*/
        }
      }

      for (var i = 0; i < visitedNodes.length; i++){
        nodes.get(visitedNodes[i]).passed = false;
        nodes.get(visitedNodes[i]).passed2 = false;
        nodes.get(visitedNodes[i]).previous = [];
        nodes.get(visitedNodes[i]).previous2 = null;
        nodes.get(visitedNodes[i]).next = [];
        //visitedNodes.pop();
      }
      visitedNodes = [];
      pathAB = [];
      pathABshort = [];
      //nodesQueue = [];
      //nodesStack = [];
      //nodesQ = [];
    //}
  //}
}

function greet() {
  console.log("neeeeew iinnpuuuuuut");
  if (sel.value() != 'enter location'){
  locationA = sel.value();
  //locationA = input.value();
  newKeyA = true;
  infoA = locationA.split(" ");
  // [0] numero civique
  // [1] rue
  // [2] direction (est, ouest, nord, sud)
  //console.log(infoA);

  for (var i = 0; i < montrealMap.features.length; i++) {
    if (montrealMap.features[i].properties.NOM_VOIE.toLowerCase() == infoA[1].toLowerCase()) {
      //console.log("debut: " + montrealMap.features[i].properties.DEB_DRT);
      //console.log("fin: " + montrealMap.features[i].properties.FIN_DRT);

      if (parseInt(montrealMap.features[i].properties.DEB_DRT) <= infoA[0] && montrealMap.features[i].properties.FIN_DRT >= infoA[0]) {
        //console.log("it is greater than " + infoA[0]);
        var startNum = parseInt(montrealMap.features[i].properties.DEB_DRT);
        var endNum = parseInt(montrealMap.features[i].properties.FIN_DRT);
        var ratio = (infoA[0] - startNum) / (endNum - startNum);

        var end = montrealMap.features[i].geometry.coordinates.length
        var startX = montrealMap.features[i].geometry.coordinates[0][0];
        var startY = montrealMap.features[i].geometry.coordinates[0][1];
        var endX = montrealMap.features[i].geometry.coordinates[end - 1][0];
        var endY = montrealMap.features[i].geometry.coordinates[end - 1][1];
        xA = startX + ratio * (endX - startX);
        yA = startY + ratio * (endY - startY);
        fill(255, 0, 0);
        //ellipse(map(xA, minX, maxX, 0, width), map(yA, minY, maxY, height, 0), 10, 10);
        break;
      }

    }

  }
}
}

function greet2() {
  if (sel2.value() != 'enter destination'){
  locationB = sel2.value();
  //locationB = input2.value();
  newKeyB = true;
  infoB = locationB.split(" ");
  // [0] numero civique
  // [1] rue
  // [2] direction (est, ouest, nord, sud)
  //console.log(infoB);

  for (var i = 0; i < montrealMap.features.length; i++) {
    if (montrealMap.features[i].properties.NOM_VOIE.toLowerCase() == infoB[1].toLowerCase()) {
      //console.log("debut: " + montrealMap.features[i].properties.DEB_DRT);
      //console.log("fin: " + montrealMap.features[i].properties.FIN_DRT);

      if (parseInt(montrealMap.features[i].properties.DEB_DRT) <= infoB[0] && montrealMap.features[i].properties.FIN_DRT >= infoB[0]) {
        //console.log("it is greater than " + infoB[0]);
        var startNum = parseInt(montrealMap.features[i].properties.DEB_DRT);
        var endNum = parseInt(montrealMap.features[i].properties.FIN_DRT);
        var ratio = (infoB[0] - startNum) / (endNum - startNum);

        var end = montrealMap.features[i].geometry.coordinates.length
        var startX = montrealMap.features[i].geometry.coordinates[0][0];
        var startY = montrealMap.features[i].geometry.coordinates[0][1];
        var endX = montrealMap.features[i].geometry.coordinates[end - 1][0];
        var endY = montrealMap.features[i].geometry.coordinates[end - 1][1];
        xB = startX + ratio * (endX - startX);
        yB = startY + ratio * (endY - startY);
        fill(255, 0, 0);
        //ellipse(map(xB, minX, maxX, 0, width), map(yB, minY, maxY, height, 0), 10, 10);
        break;
      }
    }
  }
}
}

//function to swap the position of two nodes in path array
function pathSwap(a, i, j){
  var temp = a[i];

  a[i] = a[j];

  a[j] = temp;
}

//function to calculate the distance of possible paths from A to B
function pathDistance(points, order){
  var sum;
  for(var i = 0; i < order.length - 1; i++){
    //variable for order of nodes in path
    var pathNIndex = order[i];

    //variable for node in particular, following order
    var pathN = points[pathNIndex];

    //variable for order of nodes in path
    var pathN2Index = order[i+1];

    //variable for node in particular, following order
    var pathN2 = points[pathN2Index];

    pathNX = map(nodes.get(pathN).x, minX, maxX, 0, width);
    pathNY = map(nodes.get(pathN).y, minY, maxY, height, 0);
    pathN2X = map(nodes.get(pathN2).x, minX, maxX, 0, width);
    pathN2Y = map(nodes.get(pathN2).y, minY, maxY, height, 0);
    var d = dist(pathNX, pathNY, pathN2X, pathN2Y);
    //var d = dist(nodes.get(pathN).x, nodes.get(pathN).y, nodes.get(pathN2).x, nodes.get(pathN2).y);
    sum += d;
    console.log(sum + "sum");
  }
  return sum;

}

//function to get order of possibilities for path
function nextOrderP(order){
  //find largest element that has an element in front of it
  var largestI = -1;
  for (var i = 0; i < order.length -1; i++){
    order[0] = keyA;
    order[order.length - 1] = keyB;
    if(order[i] < order[i+1]){
      largestI = i;
    }
  }

  if(largestI == -1){
    console.log('finished');
    noLoop();
  }
  console.log('largestI', largestI);
  //find largest element bigger than first found element
  var largestJ = -1;
  for (var j = 0; j < order.length; j++){
    order[0] = keyA;
    order[order.length - 1] = keyB;
    if (order[largestI] < order[j]){
      largestJ = j;
    }
  }
//  console.log('largestJ', largestJ);

  //swap the two found elements
  pathSwap(order, largestI, largestJ);
  // swap(nodes, largestI, largestJ);

  //reverse from largestI + 1 to the end
  var endArray = order.splice(largestI+1);
//  console.log(endArray + "endArray");
  // var endArray = nodes.splice(largestI+1);
  endArray.reverse();
  //add endArray to original array
  order = order.concat(endArray);
  // nodes = nodes.concat(endArray);
  countPath++;
}

// factorial function
function factorial(n){
  if (n == 1){
    return 1;
  } else {
  return n * factorial(n-1);
  }
}

// recursive function to draw all the next nodes of a node
function drawTheNext(keyNode) {
  var nextArray = nodes.get(keyNode).next;
  var inVisitedNodes = false;
  for (var i = 0; i < visitedNodes.length; i++) {
    if (visitedNodes[i] == keyNode) {
      inVisitedNodes = true;
      break;
    }
  }
  if (!inVisitedNodes) {
    visitedNodes[visitedNodes.length] = keyNode;
  }

  // trace all the nodes in between
  for (var i = 0; i < nextArray.length; i++) {

    // in green
  /*  console.log("one iteration");
    stroke(0, 255, 0, 255);
    strokeWeight(2);
    line(keyNodeX, keyNodeY, nextX, nextY);*/
//console.log("next: " + nextArray[i]);
   var whereInMapPath;
   //console.log("mapPath: " + nodes.get(keyNode).mapPath.length);
    for (var k = 0; k < nodes.get(keyNode).arrayNodes.length; k++){
      if (nextArray[i] == nodes.get(keyNode).arrayNodes[k]){
        //console.log("position in the mapPath: " + k);
        whereInMapPath = k;
        break;
      }
    }

    for (var j = 0; j < nodes.get(keyNode).mapPath[whereInMapPath].length / 2; j++) {

      // first extremity
      var graphX2Temp = TILE_SIZE * (0.5 + nodes.get(keyNode).mapPath[whereInMapPath][2 * j] / 360);
      var graphX2Temp1 = graphX2Temp * Math.pow(2, zoomLevel);
      var graphX2 = width / 2 + (graphX2Temp1 - pixCenterX);

      var siny = Math.sin(nodes.get(keyNode).mapPath[whereInMapPath][2 * j + 1] * Math.PI / 180);
      siny = Math.min(Math.max(siny, -0.9999), 0.9999);
      var graphY2Temp = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
      var graphY2Temp1 = graphY2Temp * Math.pow(2, zoomLevel);
      var graphY2 = height / 2 + (graphY2Temp1 - pixCenterY);

      // last extremity
      var graphX3Temp = TILE_SIZE * (0.5 + nodes.get(keyNode).mapPath[whereInMapPath][2 * j + 2] / 360);
      var graphX3Temp1 = graphX3Temp * Math.pow(2, zoomLevel);
      var graphX3 = width / 2 + (graphX3Temp1 - pixCenterX);

      var siny2 = Math.sin(nodes.get(keyNode).mapPath[whereInMapPath][2 * j + 3] * Math.PI / 180);
      siny2 = Math.min(Math.max(siny2, -0.9999), 0.9999);
      var graphY3Temp = TILE_SIZE * (0.5 - Math.log((1 + siny2) / (1 - siny2)) / (4 * Math.PI));
      var graphY3Temp1 = graphY3Temp * Math.pow(2, zoomLevel);
      var graphY3 = height / 2 + (graphY3Temp1 - pixCenterY);

      // draw a line between the coordinates
      //stroke(255, 255, 0, 150);
      //line(graphX2, graphY2, graphX3, graphY3);
      //fill(255, 0, 0);
      //ellipse(graphX2, graphY2, 10, 10);
    }

    drawTheNext(nextArray[i]);
  }
}
