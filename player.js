import { map } from './map.js';


/**
 * @typedef thing
 * @property {import('./map').mapObject} possessed
 */


export let player = (() => {
	const player = map.createObject({
		name: 'player'
	});
	return /** @type {thing} */ ({
		possessed: player
	});
})();