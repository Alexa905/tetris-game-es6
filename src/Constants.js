export const SQUARE_SIZE = 16;
export const PLAYGROUND = {
	height: SQUARE_SIZE * 20,
	width: SQUARE_SIZE * 11
};
export const SHAPES = {
	I: {
		matrix: [
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0]]
		,
		color: '0xFFFF00'
	},
	J: {
		matrix: [
			[0, 0, 1, 0],
			[1, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]]
		,
		color: '0x32CD32'
	},
	L: {
		matrix: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]]
		,
		color: '0xffa500'
	}
};