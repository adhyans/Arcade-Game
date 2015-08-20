/* create the canvas element, grab the 2D context for that canvas
* set the canvas elements height/width and add it to the DOM.
*/
var doc = document,
	win = window,
	canvas = doc.createElement('canvas'),
	ctx = canvas.getContext('2d'),
	numLevel = 1,
	flag = 0,
	enemyRandomPosition = [70, 140, 225];

canvas.width = 505;
canvas.height = 606;
$(".canvas").append(canvas);
//doc.body.appendChild(canvas);

// Enemies our player must avoid
var Enemy = function(x, y) {
	this.sprite = 'images/enemy-bug.png';
	this.x = x;
	this.y = y;
	this.speed = this.getRandomSpeed(100, 300);
};

Enemy.prototype.getRandomSpeed = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	if (this.x > 505 ) {
		this.x = 0;
	} else {
		this.x = Math.floor(this.x + this.speed*dt);
	}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Player = function(x, y, image) {
	this.x = x;
	this.y = y;
	this.sprite = image;
};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(dt) {
	if (this.direction == 'left' && this.x > 0) {
		this.x -= dt*400;
	} else if (this.direction == 'right' && this.x < 404) {
		this.x += dt*400;
	} else if (this.direction == 'down' && this.y < 75*4) {
		this.y += dt*400;
	} else if (this.direction == 'up' && this.y > 0) {
		this.y -= dt*400;
	}
	this.collision();
	this.levelUp();
	this.direction = '';
}

Player.prototype.handleInput = function (key) {
	this.direction = key;
}

Player.prototype.collision = function() {
	var pX , pY, bX, bY;
	pX = player.x;
	pY = player.y; 
	for (var i = 0; i < allEnemies.length; i++) {
		bX = allEnemies[i].x;
		bY = allEnemies[i].y;
		if (pX < (bX + 101) && bX < (pX + 101) && pY < (bY + 70) && bY < (pY + 70)){
			player.x = 101*2;
			player.y = 75*4;
		}
	}
}

Player.prototype.levelUp = function() {
	if (player.y <= 0) {
		console.log("Level Completed");
		player.x = 101*2;
		player.y = 75*4;
		numLevel += 1;
		var enemy = new Enemy(0, enemyRandomPosition[Math.floor(Math.random()*3)]);
		allEnemies.push(enemy);
		$('.level').text(numLevel);
	}
}

//Initializing the player and enemy objects.

var enemy = new Enemy(0, enemyRandomPosition[Math.floor(Math.random()*3)]);
var player;
var allEnemies = [enemy];

//This listens for click on the player.

canvas.addEventListener('mousedown', function(e) {
	var x = e.x - canvas.offsetLeft;
	var y = e.y - canvas.offsetTop - 54;
	if (y > 83*5 && y <= 83*6) {
		if (x > 101 && x <= 202 ) {
			flag = 1;
			player = new Player(101*2, 75*4, 'images/char-boy.png');
		} else if(x > 202 && x <= 303)  {
			flag = 1;
			player = new Player(101*2, 75*4, 'images/char-cat-girl.png');			
		} else if(x > 303 && x <= 404)  {
			flag = 1;
			player = new Player(101*2, 75*4, 'images/char-horn-girl.png');			
		}
	}
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keydown', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	if (flag) {
		player.handleInput(allowedKeys[e.keyCode]);
	}
});

//To do the number of stars you get the number of fire you can make.
//Add a timer gor completion of level.
//Add a level indicator.
//Smooth scrolling of the player.
//Make the area large. More obstacles as the level goes up