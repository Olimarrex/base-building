import { vector } from './vectors.js';
import { gameConsole } from './thing.js';

/**
 * @typedef mapObject
 * @property {() => vector} getPos
 * @property {(vector: vector) => boolean} move
 * @property {string} name
 * @property {string} properName
 */

/**
 * @exports mapObject
 */

// Map Stuff
const mapSize = 10;
export const map = (() => {
	let mapArray = [];
	let objects = [];
	let ticks = 0;

	const terrains = ['rocky', 'flat'];

	//generate map
	for (let i = 0; i < mapSize; i++) {
		let strip = [];
		for (let i = 0; i < mapSize; i++) {
			let a = {
				terrain: terrains[Math.floor(Math.random() * terrains.length)],
				/** @type {mapObject[]} */
				objects: []
			};
			strip.push(a);
		}
		mapArray.push(strip);
	}

	let map = {
		getTime() {
			return ticks;
		},
		getSegment(pos) {
			return mapArray?.[pos.x]?.[pos.y];
		},
		/**
		 * 
		 * @param {*} spread 
		 * @returns {mapObject}
		 */
		createObject(spread) {
			let pos = spread.pos || vector(0, 0);
			let hp = spread.hp || 10;
			delete spread.pos;
			delete spread.hp;
			let obj = {
				name: 'Unnamed',
				tags: [],
				...spread,
				getHp() {
					return hp;
				},
				hurt(source, name, dmg) {
					hp = hp - dmg;
					if (this.onHurt) {
						this.onHurt(source, name, dmg);
					}
					if (hp === 0) {
						if (this.onDie) {
							this.onDie();
						}
					}
				},

				getPos: () => {
					return vector(pos);
				},
				move(dir) {
					let segment = map.getSegment(pos);
					var index = segment.objects.indexOf(obj);
					let newPos = pos.add(dir);
					let newSegment = map.getSegment(newPos);
					if (newSegment) {
						segment.objects.splice(index, 1);
						pos = newPos;
						newSegment.objects.push(obj);
						return true;
					}
					else {
						return false;
					}
				}
			};
			{
				let segment = map.getSegment(pos);
				segment.objects.push(obj);
			}
			objects.push(obj);
			return obj;
		},
		getObjects() {
			return objects;
		},
		tick() {
			ticks++;
			for (let i = 0; i < objects.length; i++) {
				let item = objects[i];
				if (item.onTick) {
					item.onTick();
				}
			}
			weather.weatherTick();
		}
	};
	return map;
})();


//#region Weather & Natural events
const weather = (() => {
	const maxWeatherCount = 1;
	let activeWeather = [];
	let obj = {
		weatherTick() {
			if (activeWeather.length < maxWeatherCount) {
				if (Math.floor(Math.random() * 2) === 0) {
					gameConsole.addLine('A storm has come about!');
					activeWeather.push({
						onTick() {
							this.duration--;
							if (this.duration < 8) {
								let objects = map.getObjects();
								objects.forEach(x => x.hurt('lashed', 'the rain', 1));
							}
							else {
								gameConsole.addLine('The storm worsens!');
							}
						},
						getDuration() {
							return this.duration;
						},
						onRemove() {
							gameConsole.addLine('The storm abates');
						},
						getDescription() {
							return 'STOOOORM AMOGUD';
						},
						duration: 10
					});
				}
			}

			for (let i = 0; i < activeWeather.length; i++) {
				let item = activeWeather[i];
				item.onTick();
				console.log(item.getDuration());
				if (item.getDuration() <= 0) {
					activeWeather.splice(i, 1);
					item.onRemove();
					i--;
				}
			}
		}
	}
	return obj;
})();
//#endregion
