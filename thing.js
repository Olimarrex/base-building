let kingdom = {};

let form = nonNull(document.getElementById('form'));

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


for (let i = 0; i < 10; i++) {
	map.createObject({
		name: 'ant',
		onTick() {
			if (map.getTime() % 4 === 0) {
				while (!this.move(vector.random(3).add(-1))) { }
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
				else if (player.possessed.move(direction)) {
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
				pos: player.possessed.getPos()
			});
			map.tick();
		}
	},
	console: {
		action: (segments) => {
			gameConsole.setMaxConsoleSize(Number(segments[1]));
		}
	},
	possess: {
		action: (segments) => {
			let objects = map.getSegment(player.possessed.getPos()).objects;
			objects = objects.filter(x => x.name === segments[1] && x !== player.possessed);
			if (objects.length > 0) {
				player.possessed = objects[0];
			}
		}
	}
};

//#endregion

//#region Console
let input = /** @type {HTMLInputElement} */ (document.getElementById('inputWindow'));
let gameConsole = (() => {
	let maxConsoleSize = 10;
	let texts = [];
	let textWindow = nonNull(document.getElementById('textWindow'));
	function buildConsole() {
		let pos = player.possessed.getPos();
		let segment = map.getSegment(pos);
		const location = `You're at the coords: ${player.possessed.getPos().x},${player.possessed.getPos().y}
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