
// Array containing both drawers
Drawer[] drawers;

// List containing all input sub-classes
// Used to call all the input related (mouse and keyboard) methods in the said sub-classes
static ArrayList<Input> inputToProcess = new ArrayList<Input>();

// Graphical User Interface class containing most the UI elements
// This is mostly a collection of UI elements used for code clarity
GUI gui;

// PGraphics used to create layers (one for the mechanism and one for the drawing)
// Drawing Layer
PGraphics drawing;
// Temporary layer used to draw images when the mechanism is hidden
PGraphics temporary;
// Mechanism Layer
PGraphics mechanism;

// Vect2 is a class for storing and manipulating vectors and positions in 2D
// Coordinates of the end point for both the lines coming from the mechanisms
// This is the '3rd point' of the triangle
Vect2 endPoint;

// 2D vector representing the line between the 2 anchor points
Vect2 base;
// Float values containing the lengths of both the 'drawing' lines
float leftLineLength, rightLineLength;

// Disclaimer: Two circles (each centered on an anchor point and with the appropriate line length as radius) were used to calculate the coordinates of the point where the 2 lines meet.
// The idea is that one of the two points where the circles meet is the one where the lines meet.
// This point is the highest one (lowest absolute y value)
// For more information on how this was done visit this website: http://mathworld.wolfram.com/Circle-CircleIntersection.html

// Considering the left anchor point as the coordinates (0, 0), and the line formed by both anchor points as the x-axis
// This variable represents the absolute coordinates of the X value of the line joining both meeting points of the circles (end point of the vector under this)
Vect2 circlesMeetingPointXDeltaCoords;
// This vector has for origin the left anchor point and for magnitude the distance between the left anchor point and the line joining both points where the circles meet
//It has the same angle as the base vector
Vect2 circlesMeetingPointXDeltaVector;
// This vector has for origin the end point of the vector above and for magnitude the distance between that point and the point where both lines meet
// It is rotated of 90 degrees counter-clockwise from the base vector
Vect2 circlesMeetingPointYDeltaVector;

// This is the magnitude of circlesMeetingPointXDeltaVector
float circlesMeetingPointXDelta;
// This is the magnitude of circlesMeetingPointYDeltaVector
float circlesMeetingPointYDelta;

void setup() {
  size(720, 680);
  smooth();

  //creating the layer for the drawing with the screen size
  drawing = createGraphics(width, height);
  temporary = createGraphics(width, height);
  temporary.imageMode(CENTER);
  //layer for mechanism with the screen size
  mechanism = createGraphics(width, height);

  // Initializing the array for both the drawers
  drawers = new Drawer[2];
  // Creating the first drawer directly into the array
  drawers[0] = new Drawer(width / 4, random(0.02, 0.08), 1);
  // Creating the second drawer directly into the array
  drawers[1] = new Drawer(width * 3 / 4, random(0.02, 0.08), 1);

  // Initialize this variable
  endPoint = new Vect2();

  // Initialize the GUI object
  gui = new GUI();
}

void update() {
  // Update the GUI object and all its components
  gui.update();

  // Give these variable the good and updated values, taking these values from the 2 drawing machines
  leftLineLength = drawers[0].lineLength;
  rightLineLength = drawers[1].lineLength;

  // Update both drawers before proceeding with calculations
  for (Drawer d : drawers) d.update(gui.buttons.get("pause").clicked || gui.buttons.get("help").clicked);

  // Update the value of the vector representing the line between both anchor points
  base = new Vect2(drawers[1].anchorX - drawers[0].anchorX, drawers[1].anchorY - drawers[0].anchorY);

  // x (refers to the website, http://mathworld.wolfram.com/Circle-CircleIntersection.html)
  circlesMeetingPointXDelta = (sq(base.magnitude()) - sq(rightLineLength) + sq(leftLineLength)) / (2 * base.magnitude());
  // a (refers to the website)
  circlesMeetingPointYDelta = sqrt((rightLineLength - base.magnitude() - leftLineLength) * (leftLineLength - rightLineLength - base.magnitude()) * (rightLineLength + leftLineLength - base.magnitude()) * (base.magnitude() + rightLineLength + leftLineLength)) / base.magnitude();

  // x vector
  circlesMeetingPointXDeltaVector = base.clone();
  // x length
  circlesMeetingPointXDeltaVector.setMagnitude(circlesMeetingPointXDelta);

  // point on base line 
  circlesMeetingPointXDeltaCoords = new Vect2(drawers[0].anchorX + circlesMeetingPointXDeltaVector.x, drawers[0].anchorY + circlesMeetingPointXDeltaVector.y);

  circlesMeetingPointYDeltaVector = circlesMeetingPointXDeltaVector.clone();
  circlesMeetingPointYDeltaVector.rotateLeft();
  // 'a' length / 2
  circlesMeetingPointYDeltaVector.setMagnitude(circlesMeetingPointYDelta / 2);

  // Coordinates of the point where the lines will finally meet
  endPoint.set(circlesMeetingPointXDeltaCoords.x + circlesMeetingPointYDeltaVector.x, circlesMeetingPointXDeltaCoords.y + circlesMeetingPointYDeltaVector.y);

  // Set the end point of both lines (one for each drawer) to the calculated point
  for (Drawer d : drawers) {
    d.lineX = endPoint.x;
    d.lineY = endPoint.y;
  }
}

void draw() {
  // Call the update method which will calculate the end points for the lines as well as update the drawers and the GUI
  update();

  // Start drawing ('open') the first layer containing the mechanisms
  mechanism.beginDraw();
  // Set the background to black in order to 'refresh' the screen
  mechanism.background(0);

  // If the mechanism should be hidden, simply stop drawing it here
  if (gui.buttons.get("hideUI").clicked) mechanism.endDraw();
  // Else, draw the whole mechanism
  else {
    // Call the draw function in both drawers
    for (Drawer d : drawers) {
      d.draw(mechanism);
    }

    //Draw the GUI
    gui.draw(mechanism);

    // Stop drawing ('close') the first layer containing the mechanisms
    mechanism.endDraw();
  }

  // Start drawing ('open') the second layer containing only the drawing
  // Note that the background is not set to black because the drawing has to stay visible and not disappear every update
  drawing.beginDraw();
  // Set the stroke to white
  drawing.stroke(255);
  // Draw a point at the coordinates where both lines meet
  // This is what creates the actual drawing
  drawing.point(endPoint.x, endPoint.y);

  // Stop drawing ('close') the second layer containing only the drawing
  drawing.endDraw();

  // Start drawing ('open') the temporary layer
  temporary.beginDraw();
  // Clear the layer so it doesn't hide the mechanism which is under it
  temporary.clear();

  // For every button present on the screen it will draw the according image on the temporary layer only if the mouse is currently on the said button
  // This feature is used to draw the buttons when the mouse is over them when the mechanism is hidden
  for (Button button : gui.buttons.values()) {
    if (button.pointIsOver(mouseX, mouseY)) temporary.image(button.clicked ? button.overClickedImg : button.overImg, button.x, button.y);
  }

  // Stop drawing ('close') the temporary layer
  temporary.endDraw();

  // image() draws an image on the screen at specified coordinates
  // The image being drawn here is the mechanism layer which contains both mechanisms
  image(mechanism, 0, 0);
  // This draws the temporary layer over the mechanism but underneath the drawing
  image(temporary, 0, 0);
  // As for the lines above, this draws the second layer containing the drawing
  // It draws the layer above the mechanism
  image(drawing, 0, 0);
}

// Check for keyboard input
void keyPressed() {
  // Increase the rotation speed of the selected drawers when pressing the Up-Arrow
  if (keyCode == UP) {
    for (Drawer drawer : drawers) drawer.speed += 0.01;
  }
  // Decrease the rotation speed of the selected drawers when pressing the Down-Arrow
  else if (keyCode == DOWN) {
    for (Drawer drawer : drawers) drawer.speed -= 0.01;
  }
  // Decrease the translation speed of the selected drawers when pressing the Left-Arrow
  else if (keyCode == LEFT) {
    for (Drawer drawer : drawers) drawer.horizontalSpeed -= 0.1;
  }
  // Increase the translation speed of the selected drawers when pressing the Right-Arrow
  else if (keyCode == RIGHT) {
    for (Drawer drawer : drawers) drawer.horizontalSpeed += 0.1;
  }
}

void mousePressed() {
  // Call the mousePressed method in all the input sub-classes
  for (Input input : inputToProcess) input.mousePressed();
}
void mouseReleased() {
  // Call the mouseReleased method in all the input sub-classes
  for (Input input : inputToProcess) input.mouseReleased();
}
void mouseDragged() {
  // Call the mouseDragged method in all the input sub-classes
  for (Input input : inputToProcess) input.mouseDragged();
}
void mouseClicked() {
  // Call the mouseClicked method in all the input sub-classes
  for (Input input : inputToProcess) input.mouseClicked();
}

]// This class creates virtual bounds that can be used to check whether a given point is inside these bounds
// This class includes both the bounds and the methods used to check if a point is inside the bounds
class Bounds {

  // Array of vectors representing all the corners (coordinates of the corners) of this Bounds object
  Vect2[] vertices;

  // Constructor
  // Takes only 1 parameter, which is an array of vectors representing the corners (coordinates)
  Bounds(Vect2[] vertices) {
    this.vertices = vertices;
  }

  // This method is used to set the corners of this Bounds object to a new array of vectors
  // Can be used to update bounds if the object they cover is moving or changing shape
  void setVertices(Vect2[] vertices) {
    this.vertices = vertices;
  }

  // Method used to calculate whether a point (coordinates) is inside the bounds
  // Note that this method is still being tested and doesn't work for all shapes
  // Returns false if inside the bounds and true if outside the bounds
  // Parameters: coords represents the coordinates of the point that is tested for being in or out of bounds
  boolean isOutOfBounds(Vect2 coords) {
    // This vector is used to store the value of the left most and highest (<x, <y) point of the bounds
    Vect2 lowestPoint = new Vect2(vertices[0].x, vertices[0].y);
    // This vector is used to store the value of the right most and lowest (>x, >y) point of the bounds
    Vect2 highestPoint = new Vect2(vertices[0].x, vertices[0].y);

    // For loop going through all the points in the bounds vertices (corners)
    // Stores the values of the lowest point and highest point in the 2 variable created above
    for (Vect2 vertex : vertices) {
      if (vertex.x < lowestPoint.x) lowestPoint.set(vertex.x, lowestPoint.y);
      else if (vertex.x > highestPoint.x) highestPoint.set(vertex.x, highestPoint.y);

      if (vertex.y < lowestPoint.y) lowestPoint.set(lowestPoint.x, vertex.y);
      else if (vertex.y > highestPoint.y) highestPoint.set(highestPoint.x, vertex.y);
    }

    // Checks whether the given point is in or out of bounds and returns true or false accordingly
    // This simply checks whether the given point's x and y values are higher than the lowest point and still lower than the highest point
    if (coords.x < lowestPoint.x || coords.y < lowestPoint.y || coords.x > highestPoint.x || coords.y > highestPoint.y) return true;
    else return false;
  }
  
  // Utility method that calls the other method with the same name
  // Takes two float parameters instead of a single vector
  // Creates the necessary vector for the other method and calls it with the said vector
  boolean isOutOfBounds(float x, float y) {
    return isOutOfBounds(new Vect2(x, y));
  }
}

// Class used to  create buttons from images
class Button extends Input {
  
  // Images used for this button
    // img : normal image
    // clickedImg : normal image when the button has been clicked
    // overImg : image when the mouse is hovering over the button
    // overClickedImage : image when the mouse is hovering over the button that has been clicked
    // inverted : inverted image used to put on a white background
  PImage img, clickedImg, overImg, overClickedImg, inverted;
  
  // Button's center postion
  float x, y;
  
  // True when the button has been clicked
    // Switches everytime the button is clicked
  boolean clicked;
  
  // True when the mouse is hovering over the button
  boolean mouseEntered;
  
  // Constructor
    // Requires a position and a file name for the image used
    // fileName : file name for the image without .png
  Button(float x, float y, String fileName) {
    // Calls the super-class constructor
    super();
    
    // Sets the position
    this.x = x;
    this.y = y;
    
    // Loads the image using the file name
    img = loadImage("resources/" + fileName + ".png");
    // Creates the overImg using a copy of the normal image and blurring it
    overImg = img.copy();
    overImg.filter(BLUR);
    
    // Load the inverted image
    inverted = loadImage("resources/" + fileName + "Inverted.png");
    
    // Initialize the clicked image
    clickedImg = img;
    // Create the over clicked image using a copy of the clicked image and blurring it
    overClickedImg = clickedImg.copy();
    overClickedImg.filter(BLUR);
  }
  
  // Alternate constructor that specifies the clicked image file name
  Button(float x, float y, String fileName, String clickedFileName) {
    this(x, y, fileName);
    setClickedImage(clickedFileName);
  }
  
  // Sets the clicked image using a file name
  void setClickedImage(String fileName) {
    // Load the clicked image
    clickedImg = loadImage("resources/" + fileName + ".png");
    // Create the over clicked image using a copy of the clicked image and blurring it
    overClickedImg = clickedImg.copy();
    overClickedImg.filter(BLUR);
  }
  
  // Called every update (60 times per second)
  void update() {
    // Checks if the mouse is over the button
      // If true, it sets mouseEntered to true
    if (pointIsOver(mouseX, mouseY) && !mouseEntered) mouseEntered = true;
    // Checks if the mouse has left the button
      // If true, it sets mouseEntered to false
    else if (!pointIsOver(mouseX, mouseY) && mouseEntered) mouseEntered = false;
  }
  
  // Draw method (60 times per second)
  void draw(PGraphics pg) {
    // Calls the update method
    update();
    
    // Checks if the button is clicked or not and draws the appropriate image on the PGraphics layer
      // This also checks if the mouse is hovering the button so that it draws the appropriate image
    if (clicked) {
      if (mouseEntered) pg.image(overClickedImg, x - overClickedImg.width / 2, y - overClickedImg.height / 2);
      else pg.image(clickedImg, x - clickedImg.width / 2, y - clickedImg.height / 2);
    } else {
      if (mouseEntered) pg.image(overImg, x - overImg.width / 2, y - overImg.height / 2);
      else pg.image(img, x - img.width / 2, y - img.height / 2);
    }
  }
  
  // Utility method that returns true if the given point is over the button
  boolean pointIsOver(float x, float y) {
    if (sqrt(sq(this.x - x) + sq(this.y - y)) < img.width / 2) return true;
    else return false;
  }
  
  // Unused
  void mousePressed() {
  }
  
  // Unused
  void mouseReleased() {
  }
  
  // Unused
  void mouseDragged() {
  }
  
  // Returns true if the mouse is over the button
    // switches the clicked variable
  boolean click() {
    if (pointIsOver(mouseX, mouseY)) {
      clicked = !clicked;
      return true;
    } else return false;
  }
}

// Class containing all the GUI (Graphical User Interface) elements
// Used to keep the code clean and easy to read
class GUI {
  
  // Hashmap of buttons used to store and keep track of all the buttons used in this GUI
  HashMap<String, Button> buttons;
  
  // Sliders that change the line lengths of both mechanisms
  Slider left_lineLengthSlider, right_lineLengthSlider;

  // Constructor
  GUI() {
    // Initialize the buttons Hashmap
    buttons = new HashMap<String, Button>();
    
    // Add the help button in the hashmap
    buttons.put("help", new Button(width - 56, 56, "help", "closeHelp"));
    
    // Add the pause button in the hashmap
    buttons.put("pause", new Button(width / 7, height - 56, "pause", "play"));
    
    // Add the clear button in the hashmap
    buttons.put("clear", new Button(width * 2 / 7, height - 56, "reset"));
    // Add an onClick Runnable to the clear button
    buttons.get("clear").addOnClickRunnable(new Runnable() {
      public void run() {
        // This simply clears the drawing
        drawing.clear();
      }
    }
    );
    
    // Add the hideUI button to the hashmap
    buttons.put("hideUI", new Button(width * 3 / 7, height - 56, "hideUI"));
    
    // Add the saveFrame button to the hashmap
    buttons.put("saveFrame", new Button(width  * 4/ 7, height - 56, "saveFrame"));
    // Add an onClick Runnable to the saveFrame button 
    buttons.get("saveFrame").addOnClickRunnable(new Runnable() {
      public void run() {
        // This saves the current frame of the drawing PGraphics layer to the sketch folder
        drawing.save("screenPrint.jpg");
      }
    }
    );

    // Add the rotationSpeed button to the hashmap
      // This button isn't used as an actual button but more as an indicator for the user
    buttons.put("rotationSpeed", new Button(width * 5 / 7, height - 56, "rotation"));
    // Add the translationSpeed button to the hashmap
      // This button isn't used as an actual button but more as an indicator for the user
    buttons.put("translationSpeed", new Button(width * 6 / 7, height - 56, "translation"));

    // Left line length slider
    left_lineLengthSlider = new Slider(50, 200, 100, false, (drawers[0].lineLength - 250) / 100);

    // Right line length slider
    right_lineLengthSlider = new Slider(width - 50, 200, 100, false, (drawers[1].lineLength - 250) / 100);
    right_lineLengthSlider.flip();
  }

  // Called everytime the draw method is ran
  void update() {
    // Updates both the drawers line lengths
    drawers[0].lineLength = 250 + 100 * (1 - left_lineLengthSlider.value);
    drawers[1].lineLength = 250 + 100 * (1 - right_lineLengthSlider.value);
  }
  
  // Called 60 times per seconds
  void draw(PGraphics pg) {
    // Draws all the buttons on the given PGraphics layer
    for (Button button : buttons.values()) button.draw(pg);
    
    // Draw both the line length sliders
    left_lineLengthSlider.draw(pg);
    right_lineLengthSlider.draw(pg);
    
    // Check if the help button is in clicked 'state'
      // If true, draw the help 'page' on the PGraphics layer
    if (buttons.get("help").clicked) {
      // Set fill color to white
      pg.fill(255);
      // Draw a rectangle that acts as a 'page' background
      pg.rect(30, 30, width - 60, height - 60);

      // Draw the help button's clicked image which acts as a close button for the help 'page'
      pg.image(buttons.get("help").clickedImg, buttons.get("help").x - buttons.get("help").clickedImg.width / 2, buttons.get("help").y - buttons.get("help").clickedImg.height / 2);
      
      // Set fill color to black
      pg.fill(0);
      // Set text size to 24
      pg.textSize(24);
      // Set the text alignment to be centered vertically and horizontally
      pg.textAlign(CENTER, CENTER);
      
      // Draw a title for this 'page'
      pg.text("GUI guide", width / 2, 50);
      // Set the text size to 14
      pg.textSize(14);
      // Draw a subtitle for this 'page'
      pg.text("The machine automatically draws patterns with or without the user's help.", width / 2, 85);
      pg.text("The user can interact with the machine through specific commands.", width / 2, 100);
      
      // Change text size
      pg.textSize(18);
      // Change text alignment
      pg.textAlign(LEFT, CENTER);
      
      // The following lines all do the same but for different buttons
      // Draws the specified button's image
      pg.image(buttons.get("pause").inverted, 60, (height - 60) * 2 / 8);
      // Draws a descriptive text of the specified button on the right side of the button's image
      pg.text("Stop/Start the mechanism", 60 + buttons.get("pause").inverted.width + 10, (height - 60) * 2 / 8 + buttons.get("pause").inverted.height / 2);

      pg.image(buttons.get("clear").inverted, 60, (height - 60) * 3 / 8);
      pg.text("Clear the drawing", 60 + buttons.get("clear").inverted.width + 10, (height - 60) * 3 / 8 + buttons.get("clear").inverted.height / 2);
      
      pg.image(buttons.get("hideUI").inverted, 60, (height - 60) * 4 / 8);
      pg.text("Hide the mechanism", 60 + buttons.get("hideUI").inverted.width + 10, (height - 60) * 4 / 8 + buttons.get("hideUI").inverted.height / 2);
      
      pg.image(buttons.get("saveFrame").inverted, 60, (height - 60) * 5 / 8);
      pg.text("Save drawing to the sketch folder", 60 + buttons.get("saveFrame").inverted.width + 10, (height - 60) * 5 / 8 + buttons.get("saveFrame").inverted.height / 2);
      
      pg.image(buttons.get("rotationSpeed").inverted, 60, (height - 60) * 6 / 8);
      pg.text("Up and Down arrow keys: Rotation speed", 60 + buttons.get("rotationSpeed").inverted.width + 10, (height - 60) * 6 / 8 + buttons.get("rotationSpeed").inverted.height / 2);
      
      pg.image(buttons.get("translationSpeed").inverted, 60, (height - 60) * 7 / 8);
      pg.text("Left and Right arrow keys: Translation speed", 60 + buttons.get("translationSpeed").inverted.width + 10, (height - 60) * 7 / 8 + buttons.get("translationSpeed").inverted.height / 2);
    }
  }
}

// Abstract class used as a canvas for any other class that will require mouse input
abstract class Input {
  
  // Array of Runnable objects used to run actions everytime this input object is clicked
  ArrayList<Runnable> onClick;
  
  // Contructor
  Input() {
    // Instantiate this array
    onClick = new ArrayList<Runnable>();
    
    // Pushes itself in the inputToProcess ArrayList in the DrawingMachine class
    // This list is used to call every input related method of every instance of the Input class
        // when the built-in classes of the same names are being called in the main Class of the project
    DrawingMachine.inputToProcess.add(this);
  }
  
  // Adds a Runnable object to the onClick Array
  void addOnClickRunnable(Runnable run) {
    onClick.add(run);
  }
  
  // Called everytime the mouse is clicked
  void mouseClicked() {
    // This checks if the click method returns true (meaning the click happened in the bounds of this input object)
      // If it returns true it then proceeds to run every Runnable object in the onClick Array
    if (click()) for (Runnable run : onClick) run.run();
  }
  
  
  // This is the same as the draw method but takes a PGraphics parameter
    // This PGraphics object is what makes it possible to draw on different layers
  abstract void draw(PGraphics pg);

  // Called when the mouse is pressed
  abstract void mousePressed();
  // Called when the mouse is released (after mousePressed and mouseDragged)
  abstract void mouseReleased();
  // Called when the mouse is dragged (after mousePressed but before mouseReleased)
  abstract void mouseDragged();
  // Called by the mouseClicked method everytime the mouse is clicked anywhere on the screen
    // This should return true only if the mouse click happened inside the bounds of this input object
  abstract boolean click();
}

// Class that creates a slider (used in the GUI)
class Slider extends Input {
  
  // Slider's position
  float x, y;
  // Slider triangle's corners positions
  Vect2 t1, t2, t3;
  // Length of the slider
  float sliderLength;
  // True if the slider is horizontal
    // False if vertical
  boolean isHorizontal;
  // 0 to 1 range representing the current value of the slider
  float value;
  
  // Clickable bounds of the slider's triangle
  Bounds clickableBounds;
  // Bounds of the slider once it was clicked on
    // Column if horizontal and line if vertical
  Bounds sliderBounds;
  
  // True if the user is pressing the mouse button and is currently on the slider's triangle
  boolean clicking;
  // Used to flip the slider (-1 would be the flipped value)
  int flipped = 1;
  
  // Constructor
  Slider(float x, float y, float sliderLength, boolean isHorizontal, float value) {
    // Call the super constructor
    super();
    
    // Set the starting values
    this.x = x;
    this.y = y;
    this.sliderLength = sliderLength;
    this.isHorizontal = isHorizontal;
    this.value = value;
    
    // Calculate the slider's triangle corners
    if (isHorizontal) {
      t1 = new Vect2(x - sliderLength / 2 + (sliderLength - 10) * value, y);
      t2 = new Vect2(x - sliderLength / 2 + 5 + (sliderLength - 10) * value, y - 7);
      t3 = new Vect2(x - sliderLength / 2 + 10 + (sliderLength - 10) * value, y);
    } else {
      t1 = new Vect2(x, y - sliderLength / 2 + (sliderLength - 10) * value);
      t2 = new Vect2(x + 7, y - sliderLength / 2 + 5 + (sliderLength - 10) * value);
      t3 = new Vect2(x, y - sliderLength / 2 + 10 + (sliderLength - 10) * value);
    }
  
    // Set the clickable bounds
    clickableBounds = new Bounds(new Vect2[]{t1, t2, t3});
    
    // Set the slider bounds
    if (isHorizontal) sliderBounds = new Bounds(new Vect2[]{new Vect2(x - sliderLength / 2, 0), new Vect2(x + sliderLength / 2, 0), new Vect2(x + sliderLength / 2, height), new Vect2(x - sliderLength / 2, height)});
    else sliderBounds = new Bounds(new Vect2[]{new Vect2(0, y - sliderLength / 2), new Vect2(0, y + sliderLength / 2), new Vect2(width, y + sliderLength / 2), new Vect2(width, y - sliderLength / 2)});
  }
  
  // Same as update
  // Updates the clickable bounds and the slider's triangle
  void tick() {
    if (isHorizontal) {
      t1.set(x - sliderLength / 2 + (sliderLength - 10) * value, y);
      t2.set(x - sliderLength / 2 + 5 + (sliderLength - 10) * value, y - flipped * 7);
      t3.set(x - sliderLength / 2 + 10 + (sliderLength - 10) * value, y);
    } else {
      t1.set(x, y - sliderLength / 2 + (sliderLength - 10) * value);
      t2.set(x + flipped * 7, y - sliderLength / 2 + 5 + (sliderLength - 10) * value);
      t3.set(x, y - sliderLength / 2 + 10 + (sliderLength - 10) * value);
    }

    clickableBounds.setVertices(new Vect2[]{t1, t2, t3});
  }
  
  // Draws the slider and calls the ticks method
  void draw(PGraphics pg) {
    tick();

    if (isHorizontal) {
      pg.line(x - sliderLength / 2, y, x + sliderLength / 2, y);
      pg.line(x - sliderLength / 2, y, x - sliderLength / 2 + 5, y - flipped * 7);
      pg.line(x + sliderLength / 2, y, x + sliderLength / 2 - 5, y - flipped * 7);
    } else {
      pg.line(x, y - sliderLength / 2, x, y + sliderLength / 2);
      pg.line(x, y - sliderLength / 2, x + flipped * 5, y - sliderLength / 2 + 7);
      pg.line(x, y + sliderLength / 2, x + flipped * 5, y + sliderLength / 2 - 7);
    }

    pg.triangle(t1.x, t1.y, t2.x, t2.y, t3.x, t3.y);
  }
  
  // Flips the slider 180 degrees
  void flip() { 
    flipped *= -1;
  }
  
  // Sets clicking to true
  void mousePressed() {
    if (!clickableBounds.isOutOfBounds(mouseX, mouseY)) clicking = true;
  }
  
  // Sets clicking to false
  void mouseReleased() {
    clicking = false;
  }
  
  // Changes the triangle's position and updates the value accordingly
  void mouseDragged() {
    if (clicking && !sliderBounds.isOutOfBounds(mouseX, mouseY)) {
      if (isHorizontal) {
        value = (mouseX - (x - sliderLength / 2)) / sliderLength;
      } else {
        value = (mouseY - (y - sliderLength / 2)) / sliderLength;
      }
    }
  }
  
  // Unused
  boolean click() {
    return false;
  }
}

// Drawer class containing all the code to create both drawing mechanisms
class Drawer {

  // Coordinates of the mechanism
  float x, y;
  // Coordinates of the anchor point that 'attaches' the line to the mechanism
  float anchorX, anchorY;
  // Size of the big circle of the mechanism
  float size;
  // Both speeds for the rotation and translation of the big circle
  float speed, horizontalSpeed, horizontalDelta = 1;

  // length of the line that will actually draw
  float lineLength;

  // Coordinates of the end point of the line
  float lineX = width / 2, lineY = height / 2;

  // Angle at which the rotation of the circle actually is
  // This is used to calculate the position of the anchor point
  float angle;
  // Coordinates of both end points of the line under the big circle 
  // (used as a 'boundary' for the translation movement of said big circle)
  float lx1, lx2;
  int outOfBoundsCounter;
  
  // Slider used for changing the size of the circle
  Slider sizeSlider;

  // Constructor for this class
  Drawer(float x, float speed, float horizontalSpeed) {
    super();
    // X coordinate
    this.x = x;
    // Y coordinate (always starts at the bottom so no need for an argument to be passed through the constructor)
    y = height * 3.2 / 5;
    // Size
    size = random(50, 120);
    // Rotation Speed
    this.speed = speed;
    // Translation Speed
    this.horizontalSpeed = horizontalSpeed;

    // Random angle from 175 to 360 degrees (starting angle for the anchor point)
    angle = random(TWO_PI);
    // Random length for the drawing line
    lineLength = random(250, 350);

    // Coordinates of the boundary line under the big circle
    lx1 = x - size;
    lx2 = x + size;

    // Calculate the X coordinate of the anchor point by using the angle
    anchorX = x + cos(angle) * size / 2;
    // Calculate the Y coordinate of the anchor point by using the angle
    anchorY = y + sin(angle) * size / 2;
    
    // Initialize the slider for their circle size
    sizeSlider = new Slider(x, height - 150, 150, true, (size - 50) / 70);
  }

  // Update method
  void update(boolean paused) {
    // Modifying the rotation angle by the speed
    if (!paused) {
      angle += speed;
      
      // This checks if the circle has been out of bounds for more than 1 sec
        // If true, it places the circle at the center of the line and resets the outOfBounds counter
      if (outOfBoundsCounter == 60) {
        x = lx1 + (lx2 - lx1) / 2;
        outOfBoundsCounter = 0;
      }

      // Check if the big circle is out of bounds, if yes change its translation direction
      if (x + size / 2 == lx2 || x - size / 2 == lx1) {
        horizontalDelta *= -1;
        outOfBoundsCounter = 0;
      } else if (x + size / 2 > lx2 || x - size / 2 < lx1) {
        horizontalDelta *= -1;
        outOfBoundsCounter++;
      }
      // Modify the X coordinate by the translation speed
      x += horizontalSpeed * horizontalDelta;
    }

    // Calculate the X coordinate of the anchor point by using the angle
    anchorX = x + cos(angle) * size / 2;
    // Calculate the Y coordinate of the anchor point by using the angle
    anchorY = y + sin(angle) * size / 2;
    
    // This is used to calculate the difference between the size at the last update and the size now
    float ssize = size;
    size = 70 * sizeSlider.value + 50;
    
    // Update the coordinates of the translation line so that it isn't too big or too small for the big circle
    lx1 -= (size - ssize) / 2;
    lx2 += (size - ssize) / 2;
  }

  // Draw method
  // PGraphics containing the drawing layer
  void draw(PGraphics pg) {
    pg.strokeWeight(0.4);
    // Set the fill color to black
    pg.fill(0);
    // Set the stroke color to white
    pg.stroke(255);

    // Draw the boundary line
    pg.line(lx1, y, lx2, y);
    // Draw the left side circle at the end of the boundary line
    pg.ellipse(lx1 - 5, y, 10, 10);
    // Draw the right side circle at the end of the boundary line
    pg.ellipse(lx2 + 5, y, 10, 10);

    // Draw the big circle of the mechanism
    pg.ellipse(x, y, size, size);

    pg.stroke(255);

    //Set the fill color to white
    pg.fill(255);
    // Draw the anchor point
    pg.ellipse(anchorX, anchorY, 7, 7);

    // Draw the drawing line using the anchor coordinates and the line end point coordinates
    pg.line(anchorX, anchorY, lineX, lineY);
    
    // Draw the slider on the given PGraphics
    sizeSlider.draw(pg);
  }
}