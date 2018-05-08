// Create our 'main' state that will contain the game
var mainState = {
	preload: function() {
		// This function will be executed at the beginning 
		// That's where we load the images and sounds
		//game.load.image('sky', 'assets/phoenix.png');
		game.load.image('pipe', 'assets/pipe.png');
		game.load.audio('jump', 'assets/jump.wav');
		game.load.spritesheet('phoenix', 'assets/animate-bird-slide-25.png', 350, 250, 8);
		
	},
	create: function () {
		
		this.phoenix = game.add.sprite(50, 50, 'phoenix');
		
		this.phoenix.animations.add('fly');
		
		this.phoenix.animations.play('fly',15, true);
		this.phoenix.scale.setTo(0.15, 0.15); // half size
		
		
		// This function is called after the preload function
		// Here we set up the game, display sprites, etc.
		// Change the background color of the game
		game.stage.backgroundColor = '#72c5cf';
		
		
		// Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Display the phoenix at the position x=100 and y=245
		//this.phoenix = game.add.sprite(100, 245, 'phoenix');
		
		// Move the anchor to the left and downward
		this.phoenix.anchor.setTo(-0.2, 0.5);
		
		// Add physics to the phoenix
		//Needed for: movements, gravity, collisions, etc.
		game.physics.arcade.enable(this.phoenix);
		
		// Add gravity to the phoenix to make it fall
		this.phoenix.body.gravity.y = 800;
		
		// Call the 'jump' function when the spacekey is hit
		var spaceKey = game.input.keyboard.addKey(
						Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump,this);
		game.input.onTap.add(this.jump,this);
		this.pipes = game.add.group(); 
		this.timer = game.time.events.loop(1500, this.addRowOffPipes, this);
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0",
		{font: "30px Ariel", fill: "ffffff" });
		this.jumpSound = game.add.audio('jump');
			
		
		
	},
	update: function() {	
		// This function is called 60 times per second 
		// It contains the game's logic
		
		// If the phoenix is out of the screen (too high or too low)
		// Call the "restartGame' function
		if (this.phoenix.y < 0 || this.phoenix.y > 490)
			this.restartGame();
		if (this.phoenix.angle < 20)
			this.phoenix.angle += 1;
		game.physics.arcade.overlap(this.phoenix, this.pipes, this.hitPipe, null, this);
	},
	// Make the phoenix jump
	jump: function() {
		// We dont want to make the phoenix jump when it's dead
		if (this.phoenix.alive == false)
			return;
		// Add a vertical velocity to the phoenix
		this.phoenix.body.velocity.y = -350;
		
		// Create an animation on the phoenix
		var animation = game.add.tween(this.phoenix);
		//game.add.tween(this.phoenix).to({angle: -20}, 100).start();
		
		// Change the angle of the phoenix to -20 degrees in 100 milliseconds
		animation.to({angle: -20}, 100);
		
		// And start the animation
		animation.start();
		this.jumpSound.play();
		
		
	}, 
	restartGame: function() {
		// Start the 'main' state, which restarts the game
		game.state.start('main');
	},	
	//Adding new function (addOnePipe)
	addOnePipe: function(x, y) { 
		
		// Create a pipe at the position x and y
		var pipe = game.add.sprite(x, y, 'pipe');
		
		//Add the pipe to our previously created group
		this.pipes.add(pipe);
		
		//Enable physics on the pipe
		game.physics.arcade.enable(pipe);
		
		// Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;
		
		// Automatically kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},
	// Adding row of pipes function
	addRowOffPipes: function(){
		//Randomly pick a number between 1 and 5
		//This will be the hole position
		var hole = Math.floor(Math.random() * 5) + 1;
		 
		// Add the 6 pipes
		// with one big hole at position 'hole' and 'hole' + 1
		for (var i = 0; i < 8; i++)
			if (i != hole && i != hole + 1)
				this.addOnePipe(400, i * 60 + 10);
				this.score += 1;
				this.labelScore.text = this.score;
	
	},
	
	hitPipe: function(){
		// If the phoenix has already hit pipes, do nothing
		// It means the phoenix is already falling off the screen
		if (this.phoenix.alive == false)
			return;
		
		// Set the alive property of the phoenix is a false
		this.phoenix.alive = false;
		
		// Prevent new pipes from appearing
		game.time.events.remove(this.timer);
		
		// Go throught all the pipes, and stop their movements
		this.pipes.forEach(function(p){
			p.body.velocity.x = 0;
		
		}, this);	
	},
	

};		

	
	
	// End of the string
	

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the mainState' and call it 'main'
game.state.add('main', mainState); 

// Restart the game
game.state.start('main');
