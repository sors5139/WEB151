//SET UP CANVAS
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// GET THE WIDTH AND HEIGHT FROM CANVAS ELEMENT
var width = canvas.width;
var height = canvas.height;

//WORK OUT THE WIDTH AND HEIGHT IN BLOCKS
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

//SET SCORE TO 0
var score = 0;

//DRAW THE BORDER
var drawBorder = function() {
	ctx.fillStyle = "Gray";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};
//DRAW THE SCORE IN THE TOP LEFT CORNER
var drawScore = function () {
	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "left";
	ctx.Baseline = "top";
	ctx.fillText("Score: " + score, blockSize, blockSize);
};
//CLEAR THE INTERVAL AND DISPLAY GAME OVER TEXT
var gameOver = function () {
	clearInterval(intervalId);
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over", width / 2, height / 2);
};
//DRAW A CIRCLE (USING THE FUNCTION FROM CHAPTER 14)
var circle = function (x, y, radius, fillCircle){
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
};
//THE BLOCK CONSTRUCTOR
var Block = function (col, row) {
	console.log("new block at " + col + "," + row);
	this.col = col;
	this.row = row;
};
// DRAW A SQUARE AT THE BLOCK LOCATION
Block.prototype.drawSquare = function (color) {
	var x = this.col * blockSize;
	var y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};
//DRAW A CIRCLE AT THE BLOCK'S LOCATION
Block.prototype.drawCircle = function (color) {
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};
//CHECK IF THIS BLOCK IS IN THE SAME LOCATION AS ANOTHER BLOCK
Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};
//THE SNAKE CONSTRUCTOR
var Snake = function() {
	this.segments = [
	  new Block(7, 5),
	  new Block(6, 5),
	  new Block(5, 5)
	];
	this.direction = "right";
	this.nextDirection = "right";
};
//DRAW A SQUARE FOR EACH SEGMENTS FOR THE SNAKE'S BODY
Snake.prototype.draw = function () {
	for (var i = 0; i < this.segments.length; i++) {
		this.segments[i].drawSquare("Blue");
	}
};
//CREATE A NEW HEAD AND ADD IT TO THE BEGINNING OF 
//THE SNAKE TO MOVE THE SNAKE IN ITS CURRENT DIRECTION
Snake.prototype.move = function () {
	var head = this.segments[0];
	//console.log("old head is " + head.col + "," + head.row);
	var newHead;
	
	this.direction = this.nextDirection;
	console.log(this.direction);
	if (this.direction ==="right") {
		newHead = new Block(head.col + 1, head.row);
	} else if (this.direction === "down") {
		newHead = new Block(head.col, head.row + 1);
	}else if (this.direction === "left") {
		newHead = new Block(head.col -1, head.row);
	}else if (this.direction ==="up") {
		newHead = new Block(head.col, head.row - 1);
	}
	//console.log("new head is " + newHead.col + "," + newHead.row);
	if (this.checkCollision(newHead)) {
		//console.log("crash");
		gameOver();
		return;
	}
	this.segments.unshift(newHead);
	
	if (newHead.equal(apple.position)) {
		score++;
		apple.move();
	} else{
		this.segments.pop();
	}
};
// CHECK IF THE SNAKE'S NEW HEAD HAS COLLLIDED WITH THE WALL OR ITSELF
Snake.prototype.checkCollision = function(head) {
	var leftCollision = (head.col === 0);
	var topCollision = (head.row ===0);
	var rightCollision = (head.col === widthInBlocks - 1);
	var bottomCollision = (head.row === heightInBlocks - 1);
	
	var wallCollision = leftCollision || topCollision ||
	  rightCollision || bottomCollision;
	 console.log("Crash into wall =" + wallCollision); 
	var selfCollision = false;
	
	console.log("Body is " + this.segments.length + " long ");
	for (var i = 0; i < this.segments.length; i++) {
	  if (head.equal(this.segments[i])) {
		  console.log("crash into myself at segment" + i);
		  selfCollision = true;
	  }
	}
	return wallCollision || selfCollision;
};
//SET THE SNAKE'S NEXT DIRECTION BASED ON THE KEYBOARD
Snake.prototype.setDirection = function (newDirection){
	if (this.direction === "up" && newDirection === "down") {
		return;
	} else if (this.direction === "right" && newDirection === "left") {
		return;
	} else if ( this.direction === "down" && newDirection === "up"){
		return;
	} else if ( this.direction === "left" && newDirection === "right"){
		return;
	}
	this.nextDirection = newDirection;
};
//THE APPLE CONSTRUCTOR
var Apple = function(){
  this.position = new Block(10, 10);
};
// DRAW A CIRCLE AT THE APPLE'S LOCATION
Apple.prototype.draw = function() {
  this.position.drawCircle("LimeGreen");
};
// MOVE THE APPLE TO A NEW RANDOM LOCATION 
Apple.prototype.move = function () {
	var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
	var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
	this.position = new Block(randomCol, randomRow);
};
// CREATE THE SNAKE AND APPLE OBJECTS
var snake = new Snake();
var apple = new Apple();

//PASS AN ANIMATION FUNCTION TO SETINTERVAL
var intervalId = setInterval(function () {
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();
}, 100);
// CONVERT KEYCODES TO DIRECTIONS
var directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};
// The keydown handler for handling direction key processes
$("body").keydown(function(event){
	var newDirection = directions[event.keyCode];
	if (newDirection !==undefined){
	 snake.setDirection(newDirection);
	}
});