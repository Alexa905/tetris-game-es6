import "../lib/pixi.min.js";
import helper from "./Helper.js";
import Tetramino from "./Tetramino.js";
import {PLAYGROUND, SHAPES, SQUARE_SIZE} from "./Constants.js";


/**
 @containerId String Element id to render game in it
 **/
export default class Tetris {
	constructor(containerId) {
		this.domContainer = document.getElementById(containerId);
		this.stage = new PIXI.Container();
		this.paused = false;
		this.delay = 500;
		this._timer = new Date().getTime();
		this.init();

	}

	init() {
		this._tetraminos = Object.keys(SHAPES).map((type) => new Tetramino(type, this.stage));
		this.app = PIXI.autoDetectRenderer(PLAYGROUND.width, PLAYGROUND.height);
		PIXI.loader.load(this.setup.bind(this));

	}

	setup() {
		this.drawStage();
		this.tetromino = this.getRandomTetramino();
		const ticker = new PIXI.ticker.Ticker();

		this.bindKeyPressHandler();

		ticker.autoStart = false;
		ticker.stop();
		//Set the game state
		this.state = this.play;
		//Start the game loop
		const gameLoop = (time) => {
			ticker.update(time);
			if (new Date().getTime() - this._timer > this.delay) {
				this._timer = new Date().getTime();
				this.state(time);
			}
			this.app.render(this.stage);
			requestAnimationFrame(gameLoop);
		};
		this.domContainer.appendChild(this.app.view);
		gameLoop(performance.now());

	}

	play() {
		this.tetromino.move(this.tetromino.x, this.tetromino.y + this.tetromino.vy);
		this.tetromino.speed(this.tetromino.vx, SQUARE_SIZE);

		let tetrominoHitsWall = helper.contain(this.tetromino, {
			x: 0,
			y: 0,
			width: PLAYGROUND.width,
			height: PLAYGROUND.height
		});
		if (this.isCollision(this.arena, this.tetromino)) {
			console.log('isCollision')
			this.merge(this.tetromino);
			this.tetromino.speed(this.tetromino.vx, 0);
			this.tetromino = this.getRandomTetramino();
		}

		if (tetrominoHitsWall === "bottom") {
			//if(this.isStageCollision(this.tetromino)){
			console.log('isCollision2')
			this.tetromino.speed(0, 0);
			this.merge(this.tetromino);
			this.tetromino = this.getRandomTetramino();
		}
	}

	/**
	 * Check if 'tetromino' is in collision with the stage
	 */
	isStageCollision(tetromino) {
		let size = SHAPES[tetromino.type].matrix.length;

		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				const posY = Math.floor(tetromino.y / SQUARE_SIZE);
				const posX = Math.floor(tetromino.x / SQUARE_SIZE);
				if (tetromino.x + x < 0 || tetromino.x + x >= PLAYGROUND.width || y >= PLAYGROUND.height || tetromino.y >= 0 && this.arena[posX + x][posY + y] !== 0) {
					if (tetromino.hasBlock(x, y)) {
						return true;
					}
				}
			}
		}
		return false;
	}


	isCollision(arena, tetromino) {
		const matrix = SHAPES[tetromino.type].matrix;
		let posY = Math.floor(tetromino.y / SQUARE_SIZE);
		let posX = Math.floor(tetromino.x / SQUARE_SIZE);
		for (let x = 0; x < matrix.length; ++x) {
			for (let y = 0; y < matrix[x].length; ++y) {
				if (tetromino.hasBlock(x, y)) {
					if (arena[posX] && arena[posX][posY] !== 0) {
						return true;
					}
				}
			}
		}

		return false;
	}

	pause() {
		this.paused ? this.app.ticker.start() : this.app.ticker.stop();
		this.paused = !this.paused;
	}

	getRandomTetramino() {
		let tetramino = this._tetraminos[Math.floor(Math.random() * this._tetraminos.length)]
		this.stage.addChild(tetramino.blocks);
		return tetramino;
	}

	drawStage() {
		const createMatrix = (w, h) => {
			const matrix = [];
			while (h--) {
				matrix.push(new Array(w).fill(0));
			}
			return matrix;
		}
		const drawMatrix = (matrix) => {

			matrix.forEach((row, y) => {
				row.forEach((value, x) => {
					//if (value !== 0) {
					let block = new PIXI.Graphics();
					block.lineStyle(0.5, 0xFF3300, 1, 0.5);
					block.beginFill(0x000000);
					block.drawRect(0, 0, SQUARE_SIZE - 0.5, SQUARE_SIZE - 0.5);
					block.endFill();
					block.x = x * SQUARE_SIZE;
					block.y = y * SQUARE_SIZE;
					this.stage.addChild(block);

					//}
				});
			});

			this.app.render(this.stage);

		}
		this.arena = createMatrix(PLAYGROUND.columns, PLAYGROUND.rows);

		drawMatrix(this.arena, {x: 0, y: 0});
	}

	merge(tetromino) {
		SHAPES[tetromino.type].matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					let posY = Math.floor(y + tetromino.y / SQUARE_SIZE) - 1;
					let posX = Math.floor(x + tetromino.x / SQUARE_SIZE) - 1;
					this.arena[posY][posX] = value;
				}
			});
		});
	}

	bindKeyPressHandler() {

		//Capture the keyboard arrow keys
		let left = helper.keyboard(37),
			up = helper.keyboard(38),
			right = helper.keyboard(39),
			space = helper.keyboard(32),
			down = helper.keyboard(40);

		space.press = () => {
			this.pause()
		};
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
			this.tetromino.speed(-5, 0);
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
				this.tetromino.move(this.tetromino.x, this.tetromino.y + SQUARE_SIZE);
				this.tetromino.speed(0, 5);
			}

		};
		down.release = () => {
			if (!up.isDown && this.tetromino.vx === 0) {
				this.tetromino.speed(0, 0)
			}
		};

	}
}






