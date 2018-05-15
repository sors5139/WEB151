// Create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// Our Game's Configuration
let config = {
	type: Phaser.AUTO, //Phaser will decide how to render our game (WebGL or Canvas)
	width: 640, // game width
	height: 360, // game height
	scene: gameScene, // Our newly creates scene
	
};
// Create the game, and pass it the configuration
let game = new Phaser.Game(config);

// Load asset files for our game
gameScene.preload = function() {
	
	// Load images
	this.load.image('background', ' assets/background.png');
	//this.load.image('player', 'assets/player.png');
	this.load.spritesheet('player','assets/cat.png', 
	{ frameWidth: 400, frameHeight: 450 }
	);
	this.load.image('dragon', 'assets/dragon.png');
	this.load.image('treasure', 'assets/treasure.png');
};
// executed once, after assets were loaded
gameScene.create = function() {
	//background
	let bg = this.add.sprite(0,0, 'background');
	
	// change origin to the top-left of the sprite
	bg.setOrigin(0,0,);
	
	//player
this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
this.enemy = this.add.sprite(60, this.sys.game.config.height/ 5, 'dragon');

	// scale down
this.player.setScale(0.2);
	//Animation
	this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1
});
this.anims.create({
    key: 'stand',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
});
	// goal
this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
this.treasure.setScale(0.6);

	// Group(children) of element
	this.enemies = this.add.group({
		key: 'dragon',
		repeat: 1,
		SetXY: {
			x: 150,
			y: 100,
		stepX: 80,
		stepY: 20,
	}
});

// scale enemies
	Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

//Set speeds
Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
	enemy.speed= Math.random() * 2 + 1;
}, this);

// reset camera effects
	this.cameras.main.resetFX();
		
};
	//end the game
gameScene.gameOver = function(){
	
	//flag to set player is dead
	this.isPlayerAlive = false;
	
	//Shake the Camera
	this.cameras.main.shake(500);
	
	//fade cameras
	this.time.delayedCall(250, function() {
		this.cameras.main.fade(250);
	}, [], this);	
		
	//Restart game
	this.time.delayedCall(500, function() {
		this.scene.restart();
	}, [],this);		
};	 
	
// executed on every frame (60 times per second)
gameScene.update = function() {
	//check for active input
	if (this.input.activePointer.isDown) {
		// Player walks
		this.player.x += this.playerSpeed; 
		this.player.anims.play('walk', true);
	}
	else {
		this.player.anims.play('stand', true);
	}

	// treasure collision
	if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())){
		this.gameOver();
	}
	// enemy movement
	
let enemy = this.enemies.getChildren();
let numEnemies = this.enemies.length;
for (let i = 0; i < numEnemies; i++) {

	// move enemies
	enemies[i].y += enemies[i].speed;

	// reverse movement if reached the edges
	if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0){
		enemies[i].speed *= -1;
	} else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
		enemies[i].speed *= -1;
	}
	// enemy collision
	if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
		this.gameOver();
		break;
	}
}	// Player is alive
	
	this.isPlayerAlife = true;
	
	// only if the player is alive
	if (!this.isPlayerAlive) {
		return;
	}
};

//Some parameters for our scene(our own customer variables - these are not part of the phaser API)
gameScene.init = function() {
	this.playerSpeed = 1.5;
	this.enemySpeed = 2;
	this.enemyMaxY = 280;
	this.enemyMinY = 80;
};

