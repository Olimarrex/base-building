// Map Stuff
const mapSize = 10;
const map = (() => {
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
