let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
	type = "canvas"
}

PIXI.utils.sayHello(type);
//Aliases
let Application = PIXI.Application,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite;

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

//This `setup` function will run when the image has loaded
function setup() {

	//Create the cat sprite
	let cat = new Sprite(resources["images/cat.png"].texture);

	cat.position.set(96, 96)
	cat.width = 80;
	cat.height = 120;
	cat.scale.set(0.5, 0.5);
	cat.rotation = 3.142;
	//Add the cat to the stage
	app.stage.addChild(cat);
	app.ticker.add(delta => gameLoop(1));
	function gameLoop(delta){

		//Update the cat's velocity
		cat.vx = 1;
		cat.vy = 1;

		//Apply the velocity values to the cat's
		//position to make it move
		cat.x += cat.vx;
		cat.y += cat.vy;
	}
}