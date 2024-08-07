function parseDirection(text) {
	if (text == 'up') {
		return vector(0, -1);
	}
	else if (text == 'down') {
		return vector(0, 1);
	}
	else if (text == 'left') {
		return vector(-1, 0);
	}
	else if (text == 'right') {
		return vector(1, 0);
	}
}

function vector(x, y) {
	if (typeof (x.x) === 'number' && typeof (x.y) === 'number') {
		return vector(x.x, x.y);
	}
	let me = {
		x,
		y,
		add(vec) {
			me.x += vec.x;
			me.y += vec.y;
		},
		subtract(vec) {
			me.x -= vec.x;
			me.y -= vec.y;
		},
		multiply(vec) {
			me.x *= vec.x;
			me.y *= vec.y;
		}
	};
	return me;
}