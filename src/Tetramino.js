import { SQUARE_SIZE, PLAYGROUND, SHAPES } from './Constants.js';
import helper from './Helper.js';
export default class Tetramino {
	constructor(type) {
		this.type = type;
		// Position of the tetromino
		this.x = Math.floor(PLAYGROUND.width / 2 - SQUARE_SIZE);
		this.y = 0;
		this.blocks = new PIXI.Container();
		this.vy = 0;
		this.vx = 0;
	}

	create() {
		let matrix = SHAPES[this.type].matrix;
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				if (matrix[y][x] === 1) {
					let block = helper.drawPixel(this.type);
					block.x = x * SQUARE_SIZE;
					block.y = y * SQUARE_SIZE;
					this.blocks.addChild(block);
				}
			}
		}
		this.blocks.x = this.x;
		this.blocks.vx = this.vx;
		this.blocks.y = this.y;
		this.blocks.vy = this.vy;
		return this.blocks;
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

	}
}