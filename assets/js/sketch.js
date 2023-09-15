var pool;
var target;
var maxCount = 400;
var resetP;
var infoP;
var resetCount = 0;
var currentCount = 0;
var runSimulation = false;
var target;

let canDraw = false;
let clickCount = 0;
let drawingShape;

let squares = [];
let currentSquare;
let circles = [];
let currentCircle;




function setup() {
    let canvas = createCanvas(1200, 600);
    canvas.parent('sketchContainer');

    var squareBtn = select('#squareBtn');
    squareBtn.mousePressed(squarePressed);

    var circleBtn = select('#circleBtn');
    circleBtn.mousePressed(circlePressed);

    var startBtn = select('#startBtn')
    startBtn.mousePressed(startPressed);

    target = createVector(width/2, 50);

    pool = new Pool(20, maxCount, target);
    pool.populate();

    resetP = document.createElement("p");
    infoP = document.createElement("p");
    var divR = document.getElementById("reset");
    var divI = document.getElementById("info-message");
    divR.append(resetP);
    divI.append(infoP);
    infoP.textContent = "Select a shape on the left to start drawing. When you are done drawing select the start button";

}


function draw() {
    background(50);

    if (currentSquare) {
        let width = mouseX - currentSquare.x;
        let height = mouseY - currentSquare.y;
        fill(20);
        noStroke();
        rect(currentSquare.x, currentSquare.y, width, height);
    }

    if (currentCircle) {
        let diameter = dist(currentCircle.x, currentCircle.y, mouseX, mouseY) * 2;
        fill(20);
        noStroke();
        circle(currentCircle.x, currentCircle.y, diameter);
    }


    for (let square of squares) {
        fill(0);
        noStroke();
        rect(square.x, square.y, square.w, square.h);
    }

    for (let c of circles) {
        fill(0);
        noStroke();
        circle(c.x, c.y, c.d);
    }

    if(runSimulation){
        pool.run(currentCount);
        currentCount++;
    }

    if (currentCount == maxCount) {
        resetCount++;
        currentCount = 0;
        resetP.textContent = "Resets: " + resetCount;
        pool.evaluate();
        pool.selection();
    }
    
    fill(0, 200, 0);
    ellipse(target.x, target.y, 16, 16);
}

function squarePressed() {
    drawingShape = "s"
    infoP.textContent = "Draw a square by clicking on the canvas";
    canDraw = true;
}

function circlePressed() {
    drawingShape = "c"
    infoP.textContent = "Draw a circle by clicking on the canvas";
    canDraw = true;

}

function mousePressed() {

    if (canDraw) {
        if (insideCanvas(mouseX, mouseY)) {
            if (drawingShape === 's') {
                if (clickCount === 0) {
                    currentSquare = { x: mouseX, y: mouseY, w: 0, h: 0 };
                    clickCount++;
                }
                else {
                    currentSquare.w = mouseX - currentSquare.x;
                    currentSquare.h = mouseY - currentSquare.y;

                    squares.push(currentSquare);

                    clickCount = 0;
                    canDraw = false;
                    currentSquare = null;
                    infoP.textContent = "Select a shape on the left to start drawing. When you are done drawing select the start button";
                    //Add current Square to squares and reset
                }
            }

            if (drawingShape === 'c') {
                if (clickCount === 0) {
                    currentCircle = { x: mouseX, y: mouseY, d: 0 };
                    clickCount++;
                }
                else {
                    currentCircle.d = dist(currentCircle.x, currentCircle.y, mouseX, mouseY) * 2;

                    circles.push(currentCircle);
                    console.log(circles);

                    clickCount = 0;
                    canDraw = false;
                    currentCircle = null;
                    infoP.textContent = "Select a shape on the left to start drawing. When you are done drawing select the start button";
                }
            }


        }
    }

}

function insideCanvas(x, y) {
    if (x > 0 && x < width && y > 0 && y < height) {
        return true
    }
    return false;
}


function startPressed(){
    runSimulation = true;
    infoP.textContent = "Sit back and watch the rockets learn";
    console.log(squares, circles);
}



