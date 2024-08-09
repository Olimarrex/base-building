let kingdom = {};

let form = document.getElementById('form');

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
			strip.push({
				terrain: terrains[Math.floor(Math.random() * terrains.length)],
				objects: []
			});
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
				...spread,
				getHp() {
					return hp;
				},
				hurt(dmg) {
					hp = hp - dmg;
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
		tick() {
			ticks++;
			for (let i = 0; i < objects.length; i++) {
				let item = objects[i];
				if (item.onTick) {
					item.onTick();
				}
			}
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
			if (activeWeather.length > maxWeatherCount) {
				if (Math.floor(Math.random() * 10) === 0) {
					activeWeather += {
						type: 'thunder',
						onTick: () => {
							map.createObject({
								name: 'thunder cloud',

							})
						}
					};
				}
			}
		}
	}
})();
//#endregion

const player = map.createObject({
	name: 'player',
	onTick() {

	}
});

for (let i = 0; i < 10; i++) {
	map.createObject({
		name: 'ant',
		onTick() {
			while (!this.move(vector.random(3).add(-1))) {
				
			}
		}
	});
}


//#region Commands
const commands = {
	move: {
		action: (segments) => {
			try {
				const direction = parseDirection(segments[1]);
				if (!direction) {
					gameConsole.addLine(`Unrecognised direction '${segments[1]}'`);
				}
				else if (player.move(direction)) {
					map.tick();
				}
				else {
					gameConsole.addLine('can\'t reach there m\'lord');
				}
			}
			catch (ex) {
				gameConsole.addLine('invalid direction');
			}
		},
		aliases: []
	},
	build: {
		action(segments) {
			map.createObject({
				name: segments[1],
				pos: player.getPos()
			});
			map.tick();
		}
	},
	console: {
		action: (segments) => {
			gameConsole.setMaxConsoleSize(Number(segments[1]));
		}
	}
};
//#endregion

//#region Console
let input = document.getElementById('inputWindow');
let gameConsole = (() => {
	let maxConsoleSize = 10;
	let texts = [];
	let textWindow = document.getElementById('textWindow');
	textWindow.innerHTML = texts;
	function buildConsole() {
		let pos = player.getPos();
		let segment = map.getSegment(pos);
		const location = `You're at the coords: ${player.getPos().x},${player.getPos().y}
		<br/>
		The terrain is: ${segment.terrain}
		<br/>
		Here there is: ${segment.objects.map(x => x.name).join(', ')}
		<br/>
		Time: ${map.getTime()}`;

		let shownTexts = texts.slice(Math.max(texts.length - maxConsoleSize, 0), texts.length);
		let toShow = location;
		toShow += '<br/>' + shownTexts.join('<br/>');
		textWindow.innerHTML = toShow;
	}
	return {
		/**@param {string} line*/
		addLine(line) {
			texts.push(line);
			buildConsole();
		},
		parseLine(line) {
			let segments = line.split(' ');
			let command = commands[segments[0]];
			this.addLine(line);
			if (command) {
				command.action(segments);
			}
			buildConsole();
		},
		setMaxConsoleSize(newSize) {
			maxConsoleSize = newSize;
		}
	};
})();


input.focus();
form.addEventListener('submit', (event) => {
	event.preventDefault();
	event.stopPropagation();
	if (input.value.length > 0) {
		gameConsole.parseLine(input.value);
		input.value = '';
	}
	event.preventDefault();
});
//#endregion

gameConsole.addLine('Hello');
gameConsole.addLine('Welcome To Game.');