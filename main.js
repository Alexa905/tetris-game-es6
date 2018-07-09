let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
	type = "canvas"
}
//cat = new Sprite(resources["images/cat.png"].texture);
PIXI.utils.sayHello(type);
const PIECES = ['J', 'L', 'I'];
const SQUARE_SIZE = 16;
const PLAYGROUND = {
	height: SQUARE_SIZE * 20 ,
	width: SQUARE_SIZE * 11
};
const SHAPES = {
	I: {
		matrix: [[
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0]], [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		]
		],
		color: '0xFFFF00'
	},
	J: {
		matrix: [[
			[0, 0, 1, 0],
			[1, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]], [
			[1, 0, 0, 0],
			[1, 0, 0, 0],
			[1, 1, 0, 0],
			[0, 0, 0, 0]
		]
		],
		color: '0x32CD32'
	},
	L: {
		matrix: [[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]]
		],
		color: '0xffa500'
	}
};

//Aliases
let Application = PIXI.Application,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Graphics = PIXI.Graphics;
let tetromino, state;
//Create a Pixi Application
let app = new Application({
	width: PLAYGROUND.width,
	height: PLAYGROUND.height,
	antialias: true,
	transparent: false,
	backgroundColor: '0x061639',
	resolution: 1
});



document.body.appendChild(app.view);

loader
	.add("images/cat.png")
	.load(setup);

let helper = {
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
	}
}

//Define any variables that are used in more than one function
function drawPixel(type) {
	let rectangle = new Graphics();
	rectangle.lineStyle(4, 0xFF3300, 1);
	rectangle.beginFill(SHAPES[type].color);
	rectangle.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
	rectangle.endFill();
	return rectangle;
}

function keyPressHandler() {

	//Capture the keyboard arrow keys
	let left = helper.keyboard(37),
		up = helper.keyboard(38),
		right = helper.keyboard(39),
		down = helper.keyboard(40);
	//Left arrow key `press` method
	left.press = () => {
		//Change the cat's velocity when the key is pressed
		this.speed(-5,0);
		this.move(this.x-SQUARE_SIZE,this.y);
	};

	//Left arrow key `release` method
	left.release = () => {
		//If the left arrow has been released, and the right arrow isn't down,
		//and the cat isn't moving vertically:
		//Stop the cat
		if (!right.isDown && this.vy === 0) {
			this.speed(0, 0 )
		}
	};

	//Up
	up.press = () => {
		//this.y = -5;
		//this.vx = 0;
		this.rotate();
	};
	up.release = () => {
		if (!down.isDown && this.vx === 0) {
			this.speed(0, 0 )
		}
	};

	//Right
	right.press = () => {
		this.move(this.x+SQUARE_SIZE,this.y);
		this.speed(5, 0)
	};
	right.release = () => {
		if (!left.isDown && this.vy === 0) {
			this.speed(0,0)
		}
	};

	//Down
	down.press = () => {
		if (this.y >= PLAYGROUND.height - SQUARE_SIZE * 4) {
			this.speed(0,0)
		} else {
			this.move(this.x,this.y +20);
			this.speed(0,5)
		}

	};
	down.release = () => {
		if (!up.isDown && this.vx === 0) {
			this.vy = 0;
		}
	};

}

class Tetramino {
	constructor(type) {
		this.type = type;
		this.angle = 0;
		// Position of the tetromino
		this.x = Math.floor(PLAYGROUND.width / 2 - SQUARE_SIZE);
		this.y = 0;
		this.blocks = new PIXI.Container();
		this.vy = 0;
		this.vx = 0;
		this.create();
	}

	create() {
		let matrix = SHAPES[this.type].matrix;
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				if (matrix[this.angle][y][x] === 1) {
					let block = drawPixel(this.type);
					block.x = x * SQUARE_SIZE;
					block.y = y * SQUARE_SIZE;
					this.blocks.addChild(block);
				}
			}
		}
		this.blocks.x = this.x;
		this.blocks.vx =  this.vx;
		this.blocks.y = this.y;
		this.blocks.vy = this.vy;
	}

	move(x, y) {
		this.x = x;
		this.y = y;
		this.blocks.x = x;
		this.blocks.y = y;
	}

	speed(vx, vy){
		this.vy = vy;
		this.vx = vx;
		this.blocks.vx = vx;
		this.blocks.vy = vy;
	}

	rotate() {
		this.angle += 1;
	}
}
function generateTetromino() {
	let randomType = PIECES[Math.floor(Math.random() * PIECES.length)];
	let block =  new Tetramino(randomType);
	let tetromino = block.blocks;
	app.stage.addChild(tetromino);

	keyPressHandler.call(block);
	return block;
}
function setup() {

	tetromino = generateTetromino();

	//Set the game state
	state = play;

	//Start the game loop
	app.ticker.add(delta => gameLoop(delta));


}

function gameLoop(delta) {
	//Update the current game state:
	state(delta);
}

function play(delta) {
	//Use the tetromino's velocity to make it move
	tetromino.move(tetromino.x, tetromino.y + tetromino.vy);
	tetromino.speed(tetromino.vx, 10);

	let tetrominoHitsWall = contain(tetromino, {x: 0, y: 0, width: PLAYGROUND.width, height: PLAYGROUND.height});
	if (tetrominoHitsWall === "bottom") {
		tetromino.speed(tetromino.vx, 0);
		tetromino = generateTetromino();
	}
}

function contain(sprite, container) {

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




