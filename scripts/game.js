// 'use strict';

var Player = function (x, y, world) {
	var _x = x;
	var _y = y;
	var _size = 5;
	var _speed = 10; 

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
	var _speed = 10; 
	var _activity = 10; //How often the zombie doesn't move. Must be at least 3.
	var _move_speed = 100; //How often in milliseconds the zombie moves

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

	var move = function () {
		erase();
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
		}
	};
};

var checkCollisions = function (game) {

	var player = game.getPlayer();
	var zombies = game.getZombies();
	for (var i in zombies) {
		if (Math.sqrt(Math.pow(zombies[i].getX() - player.getX(), 2) + Math.pow(zombies[i].getY() - player.getY(), 2) ) <= zombies[i].getSize() + player.getSize()) {
			alert('u ded');
			game.reset();
		} 
	}
};

var ZombieGame = function (canvasid) {
	var properties = {
		background: '#FFFFFF',
		width: window.innerWidth - 25,
		height: window.innerHeight - 100
	};
	var canvas = document.getElementById(canvasid);
	var context = canvas.getContext('2d');
	var player, zombies;
	canvas.style.background = properties.background;
	canvas.setAttribute('width', properties.width);
	canvas.setAttribute('height', properties.height);
	var world = {
		canvas: canvas,
		context: context
	};
	var addZombies = function (number) {
		var zom = [];
		for (var i = 0; i < number; i++) {
			var x = Math.floor((Math.random() * canvas.width) + 50);
			var y = Math.floor((Math.random() * canvas.height) + 50);
			var z = new Zombie(x, y, world);
			zom.push(z);
		}
		return zom;
	}
	
	var reset = function () {
		for (var i in zombies) {
			delete zombies[i];
		}
		delete player;
		zombies = [];
		context.clearRect(0, 0, canvas.width, canvas.height);
		player = new Player(5, 5, world);
		zombies = addZombies(12);
	};
	reset();

	return {
		getPlayer: function () {
			return player;
		},
		getZombies: function () {
			return zombies;
		},
		reset: function () {
			reset();
		}
	};
};

var game = new ZombieGame('gamecanvas');

setInterval(function () {
	checkCollisions(game);
}, 100);
