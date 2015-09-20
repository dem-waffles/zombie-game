'use strict';

var Player = function (x, y) {
	var _x = x;
	var _y = y;
	var speed = 15;
	// stores the <div> element associated with this player
	var element;

	var addToDom = function () {
		element = document.createElement('div');
		element.className = 'player';
		document.body.appendChild(element);
		update();
	};

	var setupEvents = function () {
		document.onkeydown = function (e) {
			e = e || window.event;
			if (parseInt(e.keyCode) === 37) {
				_x -= speed;
			} else if (parseInt(e.keyCode) === 39) {
				_x += speed;
			} else if (parseInt(e.keyCode) === 38) {
				_y -= speed;
			} else if (parseInt(e.keyCode) === 40) {
				_y += speed;
			}
			update();
		};
	};

	var update = function () {
		element.style.left = _x + 'px';
		element.style.top = _y + 'px';
	};
	
	addToDom();
	setupEvents();

	return {
		// an API to interact with the player instance
	};
};

var ZombieGame = function () {
	var player = new Player(0, 0);
};

var game = new ZombieGame();