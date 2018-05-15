//DRAWING SQUARE
/**var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
for (var i = 0; i < 8; i++) {
	ctx.fillRect(i * 10, i * 10, 10, 10);
}**/
/**CHANGING THE DRAWING COLOR
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "Red";
ctx.fillRect(0, 0, 100, 100);
**/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
for (var i = 0; i < 8; i++) {
	ctx.fillRect(i * 40, i * 40, 40, 40);
	ctx.fillStyle = "red";
	ctx.rect(20, 20, 150,100);
}