import {PLAYGROUND, SHAPES, SQUARE_SIZE} from "./Constants.js";
import helper from "./Helper.js";

export default class Tetramino {
	constructor(type, stage) {
		this.type = type;
		this.x = Math.floor(PLAYGROUND.width / 2 - SQUARE_SIZE);
		this.y = 0;
		this.blocks = new PIXI.Container();
		this.vy = 0;
		this.vx = 0;
		this.angle = 0;
		this.stage = stage;
		this.blocks.pivot.y = SQUARE_SIZE;
		this.blocks.pivot.x = SQUARE_SIZE;
		this.draw();
	}

	draw() {
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				if (this.hasBlock(x, y)) {
					let block = helper.drawSquare(this.type);
					block.x = x * SQUARE_SIZE;
					block.y = y * SQUARE_SIZE;
					this.blocks.addChild(block);

				}
			}
		}
		this.blocks.x = this.x;
		this.blocks.y = this.y;
		this.width = this.blocks.width;
		this.height = this.blocks.height;
	}

	static getRadians(degrees) {
		return degrees * (Math.PI / 180);
	}


	/**
	 * Check if the tetromino has a block in the position (x, y)
	 * x and y being relative the the position of the tetromino
	 */
	hasBlock(x, y) {
		return SHAPES[this.type].matrix[y][x] === 1;
	}

	move(x, y) {
		this.x = x;
		this.y = y;
		this.blocks.x = x;
		this.blocks.y = y;
	}

	speed(vx, vy) {
		this.vy = vy;
		this.vx = vx;
		this.blocks.vx = vx;
		this.blocks.vy = vy;
	}

	rotate() {
		this.angle += 90;
		this.blocks.rotation = Tetramino.getRadians(this.angle);
	}
}

