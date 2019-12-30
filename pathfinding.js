function Astar(start, goal, map){
    // consists of a 2d array of Cells
    // Cell defined in maze.js
    this.map = map;
    this.goal = goal;
    // The set of nodes already evaluated.
    this.closed = [];
    // The set of currently discovered nodes that are not evaluated yet.
    // Initially, only the start node is known.
    this.open = [new Node(start,null,goal)];
    this.goalReached = false;
    this.mapDrawn = false;
}

// Fully generate the path
Astar.prototype.generate = function(){
    while(this.goalReached === false){
        this.step();
    }
}

// Step through the path generation
Astar.prototype.step = function(){
    // "IF" is to prevent calling this function from erasing
    // this.current after goal is reached
    if(!this.goalReached){
        this.current = this._getNextNode();
        if(this.current.grid.equals(this.goal)){
            this.goalReached = true;
        } else{
            this.removeFromArray(this.current, this.open);
            this.closed.push(this.current);

            // Get an array of valid neighbours to this node
            var neighbours = this._getNeighbours(this.current);
            for(var i=0; i<neighbours.length; i++){
                // Ignore the neighbor which is already evaluated.
                if(!this.nodeInArray(neighbours[i], this.closed)){
                    if(this.nodeInArray(neighbours[i], this.open)){
                        var comp = this.getNodeInArray(neighbours[i], this.open);
                        // If node at same position exists in this.open
                        // but has a larger f()
                        // remove and replace with this one
                        if(comp.g > neighbours[i].g){
                            this.removeFromArray(comp, this.open);
                        }
                    }
                    // Discover a new node
                    this.open.push(neighbours[i]);
                }
            }
        }
    }
}

// Draws everything including everthing in this.closed and this.open
Astar.prototype.drawAll = function(w,h){
    this.drawMap();
    fill(150);
    stroke(150);
    for(var i=0; i<this.closed.length; i++){
        this._drawNode(this.closed[i],w,h);
        this._drawLineToParent(this.closed[i],w,h);
    }
    fill("purple");
    stroke("purple");
    for(var i=0; i<this.open.length; i++){
        this._drawNode(this.open[i],w,h);
        this._drawLineToParent(this.open[i],w,h);
    }
    this.draw(w,h,false);
}

Astar.prototype.drawAllEfficient = function(w, h){
    if(!this.mapDrawn){
        this.drawMap();
        fill("red");
        stroke("red");
    }

    this._drawNode(this.current,w,h);
    this._drawLineToParent(this.current,w,h);
}

// Draws the path only
Astar.prototype.draw = function(w,h,map=true){
    if(map===true){
        this.drawMap();
    }

    var currentNode = this.current;

    fill("red");
    stroke("red");
    this._drawNode(currentNode,w,h,3);
    // Backtrack through nodes following the parent link
    while(currentNode.parent!==null){
        this._drawNode(currentNode,w,h);
        this._drawLineToParent(currentNode,w,h);
        if(currentNode.parent===null){
            break;
        } else{
            currentNode = currentNode.parent;
        }
    }
}

// Draws this.current only in the map
Astar.prototype.drawCurrent = function(w, h){
    this.drawMap();
    fill("red");
    this._drawNode(this.current,w,h);
    this._drawLineToParent(this.current,w,h);
}

Astar.prototype.removeFromArray = function(element, arr){
    arr.splice(arr.indexOf(element),1);
}

Astar.prototype.nodeInArray = function(node, arr){
    for(var i=0; i<arr.length; i++){
        if(arr[i].grid.equals(node.grid)){
            return true;
        }
    }
    return false;
}

Astar.prototype.getNodeInArray = function(node, arr){
    for(var i=0; i<arr.length; i++){
        if(arr[i].grid.equals(node.grid)){
            return arr[i];
        }
    }
}

// Get the Node in this.open with the smallest f() value
Astar.prototype._getNextNode = function(){
    var result;
    for(var i=0; i<this.open.length; i++){
        if(i==0 || this.open[i].f() < result.f()){
            result = this.open[i];
        }
    }
    return result;
}

// Based on the walls of the node's counterpart cell in this.map,
// add to result if wall is not present
Astar.prototype._getNeighbours = function(node){
    var target = this.map[node.grid.y][node.grid.x];
    var result = [];

    if(!target.walls['top'] && node.grid.y-1>=0){
        result.push(this.map[node.grid.y-1][node.grid.x]);
    }
    if(!target.walls['bottom'] && node.grid.y+1<this.map.length){
        result.push(this.map[node.grid.y+1][node.grid.x]);
    }
    if(!target.walls['left'] && node.grid.x-1>=0){
        result.push(this.map[node.grid.y][node.grid.x-1]);
    }
    if(!target.walls['right'] && node.grid.x+1<this.map[0].length){
        result.push(this.map[node.grid.y][node.grid.x+1]);
    }

    for(var i=0; i<result.length; i++){
        result[i] = new Node(result[i].grid, node, this.goal);
    }

    return result;
}

Astar.prototype.drawMap = function(){
    for(var i=0; i<this.map.length; i++){
        for(var j=0; j<this.map[i].length; j++){
            this.map[i][j].draw();
        }
    }
    this.mapDrawn = true;
}

Astar.prototype._drawNode = function(node,w,h,scale=1){
    ellipse(node.grid.x*w+w/2,node.grid.y*h+h/2,w*scale/4);
}

Astar.prototype._drawLineToParent = function(node,w,h){
    if(node.parent !== null){
        line(node.grid.x*w+w/2,node.grid.y*h+h/2,node.parent.grid.x*w+w/2,node.parent.grid.y*h+h/2);
    }
}

function Node(gridpos,parent=null,goal){
    // total number of cells between this node and the goal
    this._calcH = function(goal){
        var result = p5.Vector.sub(this.grid, goal);
        return abs(result.x)+abs(result.y);
    }

    // Which node it can most efficiently be reached from.
    // If a node can be reached from many nodes, parent will eventually contain the
    // most efficient previous step.
    this.parent = parent;
    // Position in grid
    this.grid = gridpos;

    // the cost of getting from the start node to that node.
    if(this.parent===null){
        this.g = 0
    } else {
        // Because I'm using a grid, difference from parent is always +1
        this.g = this.parent.g+1;
    }

    // heuristic cost, in this case, distance to goal
    // For the first node, that value is completely heuristic.
    this.h = this._calcH(goal);

    // The total cost of getting from the start node to the goal
    // by passing by that node. That value is partly known, partly heuristic.
    this.f = function(){
        return this.g + this.h;
    }


}
