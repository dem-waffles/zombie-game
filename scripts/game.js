'use strict';

var Player = function (x, y, world) {
	var _x = x;
	var _y = y;
	var _size = 5;
	var _speed = 10;
	// make player tired
	var _acceleration = -.25;

	var draw = function () {
		world.context.beginPath();
		world.context.fillStyle = '#000000';
		world.context.arc(_x, _y, _size, 0, 2 * Math.PI);
		world.context.fill();
		world.context.closePath();
	};

	var erase = function () {
		world.context.beginPath();
		world.context.fillStyle = '#FFFFFF';
		world.context.arc(_x, _y, _size + 1, 0, 2 * Math.PI);
		world.context.fill();
		world.context.closePath();
	}

	var setupEvents = function () {
		document.onkeydown = function (e) {
			e = e || window.event;
			if ([37, 38, 39, 40].indexOf(parseInt(e.keyCode)) !== -1) {
				e.preventDefault();
				if (_speed > 0) {
					_speed += _acceleration;
				}
				erase();
			}
			if (parseInt(e.keyCode) === 37 && _x-_speed >= 0) {
				_x -= _speed;
			} else if (parseInt(e.keyCode) === 39 && _x+_speed <= world.canvas.width) {	
				_x += _speed;
			} else if (parseInt(e.keyCode) === 38 && _y-_speed >= 0) {
				_y -= _speed;
			} else if (parseInt(e.keyCode) === 40 && _y+_speed <= world.canvas.height) {
				_y += _speed;
			}
			draw();
		};
		document.onkeyup = function (e) {
			_speed = 10;
		};
	};
	
	draw();
	setupEvents();

	return {
		getX: function () {
			return _x;
		},
		getY: function () {
			return _y;
		},
		getSize: function () {
			return _size;
		}
	};
};

var Zombie = function (x, y, world) {
	var _x = x;
	var _y = y;
	var _size = 5;
	var _speed = 5; 
	// How often the zombie doesn't move. Must be at least 3.
	var _activity = 10;
	// How often in milliseconds the zombie moves
	var _move_speed = 100;
	// the mode of the zombie
	var _random_walk = true, _player;

	var draw = function () {
		world.context.beginPath();
		world.context.fillStyle = 'red';
		world.context.arc(_x, _y, _size, 0, 2 * Math.PI);
		world.context.fill();
		world.context.closePath();
	};

	var erase = function () {
		world.context.beginPath();
		world.context.fillStyle = '#FFFFFF';
		world.context.arc(_x, _y, _size + 1, 0, 2 * Math.PI);
		world.context.fill();
		world.context.closePath();
	};

	var randomWalk = function () {
		var rand = Math.floor(Math.random() * _activity);
		if(rand == 0){
			if(_x-_speed <= 0){
				_x = _size;
			}else{
				_x -= _speed;
			}
		}else if(rand == 1) {
			if(_x+_speed >= parseInt(world.canvas.width)){
				_x = (parseInt(world.canvas.width) - _size);
			}else{
				_x += _speed;
			}
		}else if(rand == 2){ 
			if(_y-_speed <= 0){
				_y = _size;
			}else{
				_y -= _speed;
			}
		}else if(rand == 3) {
			if(_y+_speed >= parseInt(world.canvas.width)){
				_y = (parseInt(world.canvas.width) - _size);
			}else{
				_y += _speed;
			}
		}
	};

	var chase = function () {
		if (_x < _player.getX()) {
			_x += _speed;
		}
		if (_y < _player.getY()) {
			_y += _speed;
		}
		if (_x > _player.getX()) {
			_x -= _speed;
		}
		if (_y > _player.getY()) {
			_y -= _speed;
		}
	};

	var move = function () {
		erase();
		if (_random_walk) {
			randomWalk();
		} else {
			chase();
		}
		draw();
	};
	
	draw();
	setInterval(function () {
		move();
	}, _move_speed);
	return {
		getX: function () {
			return _x;
		},
		getY: function () {
			return _y;
		},
		getSize: function () {
			return _size;
		},
		stalk: function (player) {
			_player = player;
			_random_walk = false;
		},
		randomWalk: function () {
			_player = null;
			_random_walk = true;
		}
	};
};

var Collectible = function (x, y, world) {
	var _x = x;
	var _y = y;
	var _size = 5;

	var draw = function () {
		world.context.beginPath();
		world.context.fillStyle = 'green';
		world.context.arc(_x, _y, _size, 0, 2 * Math.PI);
		world.context.fill();
		world.context.closePath();
	};

	var erase = function () {
		world.context.beginPath();
		world.context.fillStyle = '#FFFFFF';
		world.context.arc(_x, _y, _size + 1, 0, 2 * Math.PI);
		world.context.fill();
		world.context.closePath();
	};
	
	draw();
	
	return {
		getX: function () {
			return _x;
		},
		getY: function () {
			return _y;
		},
		getSize: function () {
			return _size;
		},
		doErase: function () {
			erase();
		}
	};
};


var checkCollisions = function (game) {
	var player = game.getPlayer();
	var zombies = game.getZombies();
	var collectibles = game.getCollectibles();
	for (var i in zombies) {
		if (Math.sqrt(Math.pow(zombies[i].getX() - player.getX(), 2) + Math.pow(zombies[i].getY() - player.getY(), 2)) <= zombies[i].getSize() + player.getSize()) {
			alert('u ded. score: ' + game.getScore());
			location.reload();
		}
		if (Math.sqrt(Math.pow(zombies[i].getX() - player.getX(), 2) + Math.pow(zombies[i].getY() - player.getY(), 2)) <= game.getProperties().chaseRadius) {
			zombies[i].stalk(player);
		} else {
			zombies[i].randomWalk();
		}
	}
	for (var i in collectibles) {
		if (Math.sqrt(Math.pow(collectibles[i].getX() - player.getX(), 2) + Math.pow(collectibles[i].getY() - player.getY(), 2) ) <= collectibles[i].getSize() + player.getSize()) {
			game.addToScore(10);
			game.removeCollectible(collectibles[i]);
		} 
	}
};

var ZombieGame = function (canvasid) {
	var properties = {
		background: '#FFFFFF',
		width: window.innerWidth - 25,
		height: window.innerHeight - 100,
		chaseRadius: 100,
		numZombies: 15
	};
	var score = 0;

	document.getElementById('score').innerHTML = score;
	document.getElementById('chase-radius').innerHTML = properties.chaseRadius;
	setInterval(function () {
		score++;
		document.getElementById('score').innerHTML = score;
	}, 10000);
	var canvas = document.getElementById(canvasid);
	var context = canvas.getContext('2d');
	canvas.style.background = properties.background;
	canvas.setAttribute('width', properties.width);
	canvas.setAttribute('height', properties.height);
	var world = {
		canvas: canvas,
		context: context
	};
	var zombies = [];
	var player = new Player(5, 5, world);

	var addZombie = function () {
		var x = Math.floor((Math.random() * canvas.width) + 50);
		var y = Math.floor((Math.random() * canvas.height) + 50);
		var z = new Zombie(x, y, world);
		zombies.push(z);
		document.getElementById('num-zombies').innerHTML = zombies.length;
	}

	for (var i = 0; i < properties.numZombies; i++) {
		addZombie();
	}

	setInterval(function () {
		addZombie();
	}, 10000);
	
	var collects = [];
	setInterval(function () {
		var x = Math.floor((Math.random() * canvas.width) + 50);
		var y = Math.floor((Math.random() * canvas.height) + 50);
		var z = new Collectible(x, y, world);
		collects.push(z);
	}, 6000);

	return {
		getPlayer: function () {
			return player;
		},
		getZombies: function () {
			return zombies;
		},
		getScore: function () {
			return score;
		},
		getProperties: function () {
			return properties;
		},
		getCollectibles: function () {
			return collects;
		},
		addToScore: function(newScore) {
			score += newScore;
			document.getElementById('score').innerHTML = score;
		},
		removeCollectible: function (toRemove) {
			collects.pop(toRemove);
			toRemove.doErase();
		},
		increaseChaseRadius: function (amount) {
			properties.chaseRadius += amount;
			document.getElementById('chase-radius').innerHTML = properties.chaseRadius;
		}
	};
};

var CheatPrevention = {
	oldCoordinates: {
		x: 5,
		y: 5
	},
	checkNotCamping: function (game) {
		if (game.getPlayer().getX() === CheatPrevention.oldCoordinates.x && game.getPlayer().getY() === CheatPrevention.oldCoordinates.y) {
			game.increaseChaseRadius(50);
		}
		CheatPrevention.oldCoordinates = {
			x: game.getPlayer().getX(),
			y: game.getPlayer().getY()
		};
	}
};

var game = new ZombieGame('gamecanvas');

setInterval(function () {
	checkCollisions(game);
}, 10);

setInterval(function () {
	CheatPrevention.checkNotCamping(game);
}, 5000);

