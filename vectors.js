
/**
 * @typedef vector
 * @property {number} x
 * @property {number} y
 */

export function parseDirection(text) {
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

export function vector(x, y) {
	if (typeof (x.x) === 'number' && typeof (x.y) === 'number') {
		return vector(x.x, x.y);
	}
	let me = {
		x,
		y,
		add(vec) {
			if (typeof (vec) === 'number') {
				vec = vector(vec, vec);
			}
			let newVec = vector(me);
			newVec.x += vec.x;
			newVec.y += vec.y;
			return newVec;
		},
		subtract(vec) {
			if (typeof (vec) === 'number') {
				vec = vector(vec, vec);
			}
			let newVec = vector(me);
			newVec.x -= vec.x;
			newVec.y -= vec.y;
			return newVec;
		},
		multiply(vec) {
			if (typeof (vec) === 'number') {
				vec = vector(vec, vec);
			}
			let newVec = vector(me);
			newVec.x *= vec.x;
			newVec.y *= vec.y;
			return newVec;
		}
	};
	return me;
}
vector.random = (maxRange) => {
	return vector(Math.floor(Math.random() * maxRange), Math.floor(Math.random() * maxRange));
}