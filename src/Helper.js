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
	drawPixel(type) {
		let rectangle = new PIXI.Graphics();
		rectangle.lineStyle(4, 0xFF3300, 1);
		rectangle.beginFill(SHAPES[type].color);
		rectangle.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
		rectangle.endFill();
		return rectangle;
	},
	contain(sprite, container) {

		let collision = undefined;

		//Left
		if (sprite.x < container.x) {
			sprite.x = container.x;
			collision = "left";
		}

		//Top
		if (sprite.y < container.y) {
			sprite.y = container.y;
			collision = "top";
		}

		//Right
		if (sprite.x + sprite.blocks.width > container.width) {
			sprite.x = container.width - sprite.blocks.width;
			collision = "right";
		}

		//Bottom

		if (sprite.y + sprite.blocks.height > container.height) {
			sprite.y = container.height - sprite.blocks.height;
			collision = "bottom";
		}

		//Return the `collision` value
		return collision;
	}
}

export default helper;