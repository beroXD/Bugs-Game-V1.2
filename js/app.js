/* This is a frogger clone game,
 * This file contains all functions and classes
 * Abeer AlAbdulaali
 * 12.09.2017
 * version 1.2
 */

// TODO: the user cant close the modal
// by clicking outside the box or use esc key
$('#myModal').modal({
	backdrop: 'static',
	keyboard: false
});

// Load instructions modal on start
$(window).on('load', function () {
	$('#myModal').modal('show');
});

// Hides playes till the user clicks on play
$(document).ready(function () {
	player.hide();
	document.getElementById('play').onclick = function () {
		player.reset();
	};
});

// Background Music
var audio = new Audio('music/game.wav');
audio.volume = 0.1;
audio.loop = true;
audio.play();

// Points gained sound
var point = new Audio('music/points.mp3');
point.volume = 0.5;

// Collision with the enemy sound
var slime = new Audio('music/Slime.wav');
slime.volume = 0.5;

// Hearts gained sound
var hearts = new Audio('music/heart.mp3');
hearts.volume = 0.5;

// Winning sound
var win = new Audio('music/win.mp3');
win.volume = 0.5;

// Game over sound
var lose = new Audio('music/lose.mp3');
lose.volume = 0.5;

// TODO: play and pause the background music
document.getElementById('on').onclick = function () {
	audio.play();
};
document.getElementById('off').onclick = function () {
	audio.pause();
};

//inital player life and score
var score = 0;
var lives = 3;

// Array of enemies
var enemyList = [
  'images/enemy-bug2.png',
		'images/enemy-bug3.png',
		'images/enemy-bug4.png',
		'images/enemy-bug5.png',
		'images/enemy-bug6.png',
		'images/enemy-bug7.png'
];

//***********ENEMY CLASS*****************
// using pesudoclasses
// Enemies our player must avoid
var Enemy = function (x, y, speed) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug5.png';

	//x and y initial enemy position
	this.x = x;
	this.y = y;

	//speed of enemy
	this.speed = speed;

	// Did not work properly
	//using Math.random function to generate a random number
	//the speed of the enemy will change
	//Math.floor(Math.random() * 210 + 150);
};

// Update the enemy position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.x = this.x + this.speed * dt;
	this.offScreenX = 505;
	this.startingX = -100;
	if (this.x >= this.offScreenX) {
		this.x = this.startingX;
		this.randomSpeed();
	}
	// This is not working properly
	// tried diffrent method from https://github.com/lacyjpr/arcade/blob/master/js/app.js
	//	if (this.x < 502) {
	//		this.x += this.speed * dt;
	//	} else {
	//		this.x = -70;
	//	}
};

// Random speed generator
Enemy.prototype.randomSpeed = function () {
	// Speed is a random number from 1-10 times 40
	this.speed = 40 * Math.floor(Math.random() * 10 + 1);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//***********PLAYER CLASS*****************
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/char-princess-girl.png';

	//x and y initial player position
	this.x = 305;
	this.y = 484;
};

// When players reache the water score will be incremented,
// and when the players score 100 they win
Player.prototype.update = function () {
	if (this.y < 10) {
		point.play(); // Play point sound
		score++; // Increment the score by 1
		document.getElementById('score').innerHTML = score; // Change score on screen
		this.reset(); // Reset playes location
	}
	if (score >= 100) {
		this.win(); // Play win sound

		// Before using modals
		//alert("YOU WIN!!!");
		//location.reload();
	}
	if (lives === 0) {
		this.lose(); // Play lose sound

		// Before using modals
		//alert("GAME OVER :(");
		//location.reload();
	}
};

// After wining the win modal will be displayed
Player.prototype.win = function () {
	// Clear all objects
	allEnemies = [];
	player.hide();
	heart.hide();
	star.hide();

	// Make the win modal show
	$('#win').modal('show');
	audio.pause(); // Pause background music
	win.play(); // Play win sound
	win.loop = false; // This does not work, the sound keeps looping
};

// After losing the lose modal will be displayed
Player.prototype.lose = function () {
	// Clear all objects
	allEnemies = [];
	player.hide();
	heart.hide();
	star.hide();

	// Make the lose modal show
	$('#lose').modal('show');
	audio.pause(); // Pause background music
	lose.play(); // Play lose sound
};

Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player moves according to key presses
Player.prototype.handleInput = function (arrow) {
	switch (arrow) {
		case 'left':
			if (this.x >= 101) {
				this.x -= 101;
			}
			break;
		case 'right':
			if (this.x <= 501) {
				this.x += 101;
			}
			break;
		case 'up': //if player reaches the water then call update function
			if (this.y < 0) {
				this.update();
			} else {
				this.y -= 90;
			}
			break;
		case 'down':
			if (this.y < 460) {
				this.y += 90;
			}
			break;
	}
};

// Reset player to initial x and y position
Player.prototype.reset = function () {
	this.x = 305;
	this.y = 484;
};

// Hide player off canvas
Player.prototype.hide = function () {
	this.x = -905;
};

//***********HEART CLASS*****************
var Heart = function (x, y) {
	this.sprite = 'images/Heart.png';
	this.x = x;
	this.y = y;
};

// Check if player picked up heart or not
Heart.prototype.update = function () {
	if (this.x < player.x + 50 && this.x + 50 > player.x && this.y < player.y + 50 && this.y + 50 > player.y) {
		this.picked();
	}
};

// Picking up hearts will add extra lives to the player life
Heart.prototype.picked = function () {
	hearts.play(); // Play heart sound
	lives++; // Add life to player
	document.getElementById('life').innerHTML = lives; // Show on screen
	this.reset(); // Reset heart location
};

// Resetting the heart in a different place on the canvas randomly
Heart.prototype.reset = function () {
	this.x = (102 * Math.floor(Math.random() * 4) + 0);
	this.y = (50 + (85 * Math.floor(Math.random() * 3)));
};

Heart.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Hide heart off canvas
Heart.prototype.hide = function () {
	this.x = -1000;
};

//***********STAR CLASS*****************
var Star = function (x, y) {
	this.sprite = 'images/Star.png';
	this.x = x;
	this.y = y;
};

// Check if player picked up star
Star.prototype.update = function () {
	if (this.x < player.x + 50 && this.x + 50 > player.x && this.y < player.y + 50 && this.y + 50 > player.y) {
		this.picked();
	}
};

// Adding 5 points to score
Star.prototype.picked = function () {
	point.play(); // Play poins sound
	score += 5; // Add 5 points to score
	document.getElementById('score').innerHTML = score; // Show on screen
	this.reset(); // Reset star location
};

Star.prototype.reset = function () {
	this.x = (102 * Math.floor(Math.random() * 4) + 0);
	this.y = (50 + (85 * Math.floor(Math.random() * 3)));
};

Star.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Hide star off canvas 
Star.prototype.hide = function () {
	this.x = -1000;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//new enemie and push it to the array 
var allEnemies = [];

for (var i = 0; i < 5; i++) {
	//startSpeed is a random number from 1-10 times 60
	var startSpeed = 60 * Math.floor(Math.random() * 10 + 1);
	//enemys start off canvas (x = -100) at the following Y positions: 60, 145, 230
	allEnemies.push(new Enemy(-100, 60 + (85 * i), startSpeed));
}

// Diffrent method
//pushing enemy into the array (start position, position, speed)
//allEnemies.push(new Enemy(0, 390));
//allEnemies.push(new Enemy(0, 310));
//allEnemies.push(new Enemy(0, 220));
//allEnemies.push(new Enemy(0, 220));
//allEnemies.push(new Enemy(0, 140));
//allEnemies.push(new Enemy(0, 60));
//allEnemies.push(new Enemy(0, 60));

var player = new Player();
var heart = new Heart(200, 160);
var star = new Star(403, 155);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

// Reload the game after winning or losing
// when player clicks button
document.getElementById('playag').onclick = function () {
	location.reload();
};
document.getElementById('loseplay').onclick = function () {
	location.reload();
};
