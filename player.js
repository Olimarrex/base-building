/**
 * @typedef thing
 * @property {mapObject} possessed
 */

/**
 * @typedef mapObject
 * @property {() => vector} getPos
 * @property {(vector: vector) => boolean} move
 * @property {string} name
 * @property {string} properName
 */

/**
 * @typedef vector
 * @property {number} x
 * @property {number} y
 */


let player = (() => {
	const player = map.createObject({
		name: 'player'
	});
	return /** @type {thing} */ ({
		possessed: player
	});
})();