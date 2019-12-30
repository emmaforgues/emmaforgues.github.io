var maze, margin, astar;

function setup() {
    frameRate(60);
    margin = 10;
    maze = new RecursiveBackTracker(0,0,20,20,16,16);
    maze.generate();
    createCanvas(maze.size.x+margin*2, maze.size.y+margin*2);
    translate(margin, margin);

    astar = new Astar(maze.entry, maze.exit, maze.cells);
    //astar.generate();
}

function draw() {
    translate(margin, margin);
    if(!astar.goalReached){
        astar.step();

        //astar.drawCurrent(maze.cellSize.x,maze.cellSize.y);
        //astar.draw(maze.cellSize.x,maze.cellSize.y);
        astar.drawAll(maze.cellSize.x,maze.cellSize.y);
        //astar.drawAllEfficient(maze.cellSize.x,maze.cellSize.y);
    } else {
        //astar.draw(maze.cellSize.x,maze.cellSize.y);
    }
}
