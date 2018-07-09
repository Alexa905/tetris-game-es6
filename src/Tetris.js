import '../lib/pixi.min.js'
import helper from './Helper.js';
import Tetramino from './Tetramino.js';
import { SHAPES , SQUARE_SIZE, PLAYGROUND } from './Constants.js';



/**
 @containerId String Element id to render game in it
 **/
export default class Tetris {
	constructor(containerId) {
		this.container = document.getElementById(containerId);
		this.init();
	}

	init() {
		this.app = new PIXI.Application({
			width: PLAYGROUND.width,
			height: PLAYGROUND.height,
			backgroundColor: '0x061639',
			resolution: 1
		});


		this.container.appendChild(this.app.view);

		PIXI.loader.load(this.setup.bind(this));
		this.drawStage()
	}

	setup() {

		this.tetromino = this.generateTetromino();

		this.keyPressHandler();

		//Set the game state
		this.state = this.play;

		//Start the game loop
		this.app.ticker.add(delta => this.gameLoop(delta));
	}

	gameLoop(delta) {
		this.state(delta);
	}

	play(delta) {

		this.tetromino.move(this.tetromino.x, this.tetromino.y + this.tetromino.vy);
		this.tetromino.speed(this.tetromino.vx, 1);

		let tetrominoHitsWall = helper.contain(this.tetromino, {
			x: 0,
			y: 0,
			width: PLAYGROUND.width,
			height: PLAYGROUND.height
		});
		if (tetrominoHitsWall === "bottom") {
			this.tetromino.speed(this.tetromino.vx, 0);
			this.tetromino = this.generateTetromino();
		}
	}

	end() {
		this.app.ticker.stop();
	}

	generateTetromino() {
		let shapeTypes = Object.keys(SHAPES);
		let randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
		let block = new Tetramino(randomType);
		let tetromino = block.create();
		this.app.stage.addChild(tetromino);
		return block;
	}

	drawStage(){
		const arena = createMatrix(12, 20);
		const app = this.app
		function createMatrix(w, h) {
			const matrix = [];
			while (h--) {
				matrix.push(new Array(w).fill(0));
			}
			return matrix;
		}

		function drawMatrix(matrix, offset) {matrix.forEach((row, y) => {
				row.forEach((value, x) => {
					if (value !== 0) {
						let block = new PIXI.Graphics();
						block.lineStyle(4, 0xFF3300, 1);
						block.beginFill(0xFF3300);
						block.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
						block.endFill();
						block.x = x + offset.x;
						block.y = y + offset.y;
						app.stage.addChild(block);
					}
				});
			});

		}
		drawMatrix(arena, {x: 0, y: 0});
	}

	keyPressHandler() {

		//Capture the keyboard arrow keys
		let left = helper.keyboard(37),
			up = helper.keyboard(38),
			right = helper.keyboard(39),
			down = helper.keyboard(40);
		//Left arrow key `press` method
		left.press = () => {
			//Change the cat's velocity when the key is pressed
			this.tetromino.speed(-5, 0);
			this.tetromino.move(this.tetromino.x - SQUARE_SIZE, this.tetromino.y);
		};

		//Left arrow key `release` method
		left.release = () => {
			//If the left arrow has been released, and the right arrow isn't down,
			//and the cat isn't moving vertically:
			//Stop the cat
			if (!right.isDown && this.tetromino.vy === 0) {
				this.tetromino.speed(0, 0)
			}
		};

		//Up
		up.press = () => {
			//this.y = -5;
			//this.vx = 0;
			this.tetromino.rotate();
		};
		up.release = () => {
			if (!down.isDown && this.tetromino.vx === 0) {
				this.tetromino.speed(0, 0)
			}
		};

		//Right
		right.press = () => {
			this.tetromino.move(this.tetromino.x + SQUARE_SIZE, this.tetromino.y);
			this.tetromino.speed(5, 0)
		};
		right.release = () => {
			if (!left.isDown && this.tetromino.vy === 0) {
				this.tetromino.speed(0, 0)
			}
		};

		//Down
		down.press = () => {
			if (this.tetromino.y >= PLAYGROUND.height - SQUARE_SIZE * 4) {
				this.tetromino.speed(0, 0)
			} else {
				this.tetromino.move(this.tetromino.x, this.tetromino.y + 20);
				this.tetromino.speed(0, 5);
			}

		};
		down.release = () => {
			if (!up.isDown && this.tetromino.vx === 0) {
				this.tetromino.vy = 0;
			}
		};

	}
}






