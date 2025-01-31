// ---- Code by Josue Chavez ---- //
// -- Credit to Craig Reynolds -- //
// ---- for the algorithm :) ---- //

var boidsCanvas = document.getElementById("boids")
var b = boidsCanvas.getContext("2d");

//environmental values
const leftMargin = 50;
const rightMargin = boidsCanvas.width - leftMargin;
const topMargin = 50;
const bottomMargin = boidsCanvas.height - topMargin;

const count = 100;
const boidColor = "#FFFFFF";


//boid values... eventually have them tunable!
var health = 100;
const boidProtectedRange = 20; // the range where the boid moves AWAY from other boids
const boidRange = 75; // the range where the boid moves TOWARDS the center of mass of other boids
const maxspeed = 6;
const minspeed = 3;
const avoidFactor = 0.4;
const matchingFactor = 0.05;
const centeringFactor = 0.0005;
const turnFactor = 0.4;

//boid array
const boidArr = [];

//random number between two values helper function
function getRandInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class boid {

    constructor(x, y, dx, dy, protRange, range){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.protRange = protRange;
        this.range = range;
    }

    drawBoid(b){
        b.beginPath();
        b.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        b.fillStyle = boidColor;
        b.fill();    
    }
}

function distance(boid, otherBoid){
    return (Math.sqrt(((boid.x - otherBoid.x) * (boid.x - otherBoid.x)) 
    + ((boid.y - otherBoid.y) * (boid.y - otherBoid.y))));
}
function setEdgeReaction(boid){
    if (boid.y < topMargin){
        boid.dy += turnFactor;
    }
    if (boid.x > rightMargin){
        boid.dx -= turnFactor;
    }
    if (boid.x < leftMargin){
        boid.dx += turnFactor;
    }
    if (boid.y > bottomMargin){
        boid.dy -= turnFactor;
    }
    
}
//seperation, alignment, and cohesion algorithms
function setSeperation(boid) {
    var closeDX = 0;
    var closeDY = 0;
    for (var otherBoid in boidArr){
        if (boid != boidArr[otherBoid]){
            if (distance(boid, boidArr[otherBoid] < boid.protRange)){
                closeDX += boid.x - boidArr[otherBoid].x;
                closeDY += boid.y - boidArr[otherBoid].y;
            }
        }
    }
    boid.dx += closeDX * avoidFactor;
    boid.dy += closeDY * avoidFactor;
        
}

function setAlignemnt(boid) {
    var xVelAvg = 0;
    var yVelAvg = 0;
    var neighbors = 0;
    for (var otherBoid in boidArr){
        if (boid != boidArr[otherBoid]){
            if (distance(boid, boidArr[otherBoid]) < boid.range){
                xVelAvg += boidArr[otherBoid].dx;
                yVelAvg += boidArr[otherBoid].dy;
                neighbors++;
            }
        }
    }
    
    if (neighbors > 0){
        xVelAvg = xVelAvg / neighbors;
        yVelAvg = yVelAvg / neighbors;
        boid.dx += (xVelAvg - boid.dx) * matchingFactor;
        boid.dy += (xVelAvg - boid.dy) * matchingFactor;
    }
    
}

function setCohesion(boid) {
    var xPosAvg = 0;
    var yPosAvg = 0;
    var neighbors = 0;
    for (var otherBoid in boidArr){
        if (boid != boidArr[otherBoid]){
            if (distance(boid, boidArr[otherBoid]) < boid.range) {
                xPosAvg += boidArr[otherBoid].x;
                yPosAvg += boidArr[otherBoid].y;
                neighbors++;
            }
        }
    }
    
    if (neighbors > 0){
        xPosAvg = xPosAvg / neighbors;
        yPosAvg = yPosAvg / neighbors;
        boid.dx += (xPosAvg - boid.x) * centeringFactor;
        boid.dy += (xPosAvg - boid.y) * centeringFactor;
    }
    

}
function setSpeedLimit(boid){
    var speed = Math.sqrt(boid.dx*boid.dx + boid.dy*boid.dy);
    if (speed > maxspeed){
        boid.dx = (boid.dx / speed) * maxspeed;
        boid.dy = (boid.dy / speed) * minspeed;
    }
    if (speed < minspeed){
        boid.dx = (boid.dx / speed) * minspeed;
        boid.dy = (boid.dy / speed) * minspeed;
    }
}

function drawBoidStats(health){
    b.font = "20px Courier New";
    b.fillText("Health: " + health, 10, 30)
    b.fillText("Happiness: " + health, 200, 30);
}

//in the initialize function:
// 1. populate the canvas with random boids
// 2. call the draw function
function initialize(){
    boidArr.length = 0;

    b.clearRect(0,0, boidsCanvas.width, boidsCanvas.height);
    for(let i = 0; i < count; i++){

        const temp = new boid(getRandInt(leftMargin, rightMargin), getRandInt(topMargin, bottomMargin), 0, 0, boidProtectedRange, boidRange);
        boidArr.push(temp);
        boidArr[i].drawBoid(b);
    }

    drawBoidStats(health);
    // do not request an animation frame here!
    // when you reset the simulation the HTML treats it as a reload of the pages contents
    // this calls back the onload function!
}

//in the draw function
// 1. loop through each boid and set their individual alignment, seperation, and cohesion
// 2. update the boids position
// 3. request an animation frame and start again!
function draw(){
    for (var boid in boidArr){
        setAlignemnt(boidArr[boid]);
        setSeperation(boidArr[boid]);
        setCohesion(boidArr[boid]);
        setSpeedLimit(boidArr[boid]);
        setEdgeReaction(boidArr[boid]);
    
        boidArr[boid].y += boidArr[boid].dy;
        boidArr[boid].x += boidArr[boid].dx;
    }

    b.clearRect(0,0, boidsCanvas.width, boidsCanvas.height);
    for (var boid in boidArr){
        boidArr[boid].drawBoid(b);
    }
    drawBoidStats(health);
    requestAnimationFrame(draw);
}




// when everything loads, call to init and request animation
window.onload = () => {
    initialize();
    requestAnimationFrame(draw);
}

// initializatoin for reset button
document.getElementById("reset").onclick = initialize;

//  parameter tuning should go here
//  parameters we be able to tune are: avoidFactor, matchFactor, and centeringFactor
//  useful as dev tools