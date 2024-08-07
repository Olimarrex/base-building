let kingdom = {};

let form = document.getElementById('form');

// Map Stuff
const mapSize = 10;
const map = (() => {
	let mapArray = [];
	let objects = [];
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
		getSegment(pos) {
			return mapArray[pos.x][pos.y];
		},
		createObject(name) {
			let pos = vector(Math.floor(mapSize / 2), Math.floor(mapSize / 2));
			let obj = {
				name: '',
				getPos: () => {
					return vector(pos);
				},
				move(dir) {
					let segment = map.getSegment(pos);
					var index = segment.objects.indexOf(obj);
					segment.objects.splice(index, 1);
					pos.add(dir);
					let newSegment = map.getSegment(pos);
					newSegment.objects.push(obj);
				}
			};
			{
				let segment = map.getSegment(pos);
				segment.objects.push();
			}
			objects.push(obj);
			return obj;
		}
	};
	return map;
})();

const player = map.createObject('bogey');


//Commands
const commands = {
	move: {
		action: (segments) => {
			try {
				const direction = parseDirection(segments[1]);
				player.move(direction);
			}
			catch (ex) {
				gameConsole.addLine('invalid direction');
			}
		},
		aliases: []
	},
	console: {
		action: (segments) => {
			gameConsole.setMaxConsoleSize(Number(segments[1]));
		}
	}
};

//Console
let input = document.getElementById('inputWindow');
let gameConsole = (() => {
	let maxConsoleSize = 10;
	let texts = [];
	let textWindow = document.getElementById('textWindow');
	textWindow.innerHTML = texts;
	function buildConsole() {
		let pos = player.getPos();
		let segment = map.getSegment(pos);
		console.log(segment.objects);
		const location = `You're at the coords: ${player.getPos().x},${player.getPos().y}
		<br/>
		The terrain is: ${segment.terrain}
		<br/>
		Here there is: ${segment.objects.reduce((reduced, object) => reduced += object.name, '')}`;

		let shownTexts = texts.slice(Math.max(texts.length - maxConsoleSize, 0), texts.length);
		let toShow = shownTexts.join('<br/>');
		toShow += '<br/>' + location;
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
			console.log(command);
			if (command) {
				command.action(segments);
				buildConsole();
			}
			else {
				this.addLine(line);
			}
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

gameConsole.addLine('Hello');
gameConsole.addLine('Welcome To Game.');