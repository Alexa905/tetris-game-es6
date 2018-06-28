let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
	type = "canvas"
}

PIXI.utils.sayHello(type);
//Aliases
let Application = PIXI.Application,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite,
	Graphics = PIXI.Graphics;

//Create a Pixi Application
let app = new Application({
	width: 256,
	height: 512,
	antialias: true,
	transparent: false,
	backgroundColor: '0x061639',
	resolution: 1 })



document.body.appendChild(app.view);

loader
	.add("images/cat.png")
	.load(setup);

function keyboard(keyCode) {
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
//Define any variables that are used in more than one function
let cat, state;

function setup() {

	//Create the `cat` sprite
	cat = new Sprite(resources["images/cat.png"].texture);
	cat.y = 0;
	cat.vx = 0;
	cat.vy = 0;
	app.stage.addChild(cat);

	//Capture the keyboard arrow keys
	let left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40);

	//Left arrow key `press` method
	left.press = () => {
		//Change the cat's velocity when the key is pressed
		cat.vx = -5;
		cat.vy = 0;
	};

	//Left arrow key `release` method
	left.release = () => {
		//If the left arrow has been released, and the right arrow isn't down,
		//and the cat isn't moving vertically:
		//Stop the cat
		if (!right.isDown && cat.vy === 0) {
			cat.vx = 0;
		}
	};

	//Up
	up.press = () => {
		cat.vy = -5;
		cat.vx = 0;
	};
	up.release = () => {
		if (!down.isDown && cat.vx === 0) {
			cat.vy = 0;
		}
	};

	//Right
	right.press = () => {
		cat.vx = 5;
		cat.vy = 0;
	};
	right.release = () => {
		if (!left.isDown && cat.vy === 0) {
			cat.vx = 0;
		}
	};

	//Down
	down.press = () => {
		cat.vy = 5;
		cat.vx = 0;
	};
	down.release = () => {
		if (!up.isDown && cat.vx === 0) {
			cat.vy = 0;
		}
	};

	//Set the game state
	state = play;

	//Start the game loop
	app.ticker.add(delta => gameLoop(delta));


	let rectangle = new Graphics();
	rectangle.lineStyle(4, 0xFF3300, 1);
	rectangle.beginFill(0x66CCFF);
	rectangle.drawRect(0, 0, 64, 64);
	rectangle.endFill();
	rectangle.x = 170;
	rectangle.y = 170;
	app.stage.addChild(rectangle);
}

function gameLoop(delta){

	//Update the current game state:
	state(delta);
}

function play(delta) {

	//Use the cat's velocity to make it move
	cat.x += cat.vx;
	cat.y += cat.vy;

	let catHitsWall = contain(cat, {x: 0, y: 0, width: 256, height: 512});
	if (catHitsWall === "top" || catHitsWall === "bottom") {
		cat.vy *= 0;
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
	if (sprite.x + sprite.width > container.width) {
		sprite.x = container.width - sprite.width;
		collision = "right";
	}

	//Bottom
	if (sprite.y + sprite.height > container.height) {
		sprite.y = container.height - sprite.height;
		collision = "bottom";
	}

	//Return the `collision` value
	return collision;
}
