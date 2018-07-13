import { SQUARE_SIZE, SHAPES } from './Constants.js';
const helper = {
	keyboard(keyCode) {
		let key = {};
		key.code = keyCode;
		key.isDown = false;
		key.isUp = true;
		key.press = undefined;
		key.release = undefined;
		//The `downHandler`
		key.downHandler = event => {
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) key.press();
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
		};

		//The `upHandler`
		key.upHandler = event => {
			if (event.keyCode === key.code) {
				if (key.isDown && key.release) key.release();
				key.isDown = false;
				key.isUp = true;
			}
			event.preventDefault();
		};

		//Attach event listeners
		window.addEventListener(
			"keydown", key.downHandler.bind(key), false
		);
		window.addEventListener(
			"keyup", key.upHandler.bind(key), false
		);
		return key;
	},
	drawSquare(type) {
		let rectangle = new PIXI.Graphics();
		rectangle.lineStyle(1, 0xFF3300, 1, 1);
		rectangle.beginFill(SHAPES[type].color);
		rectangle.drawRect(0, 0, SQUARE_SIZE-1, SQUARE_SIZE-1);
		rectangle.endFill();
		return rectangle;
	},
	contain(tetromino, container) {

		let collision = undefined;

		//Left
		if (tetromino.x < container.x) {
			tetromino.x = container.x;
			collision = "left";
		}

		//Top
		if (tetromino.y < container.y) {
			tetromino.y = container.y;
			collision = "top";
		}

		//Right
		if (tetromino.x + tetromino.width > container.width) {
			tetromino.x = container.width - tetromino.width;
			collision = "right";
		}

		//Bottom

		if (tetromino.y + tetromino.height > container.height) {
			collision = "bottom";
		}

		//Return the `collision` value
		return collision;
	}
}

export default helper;
