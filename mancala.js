$(document).ready(function() {
	const canvas = document.querySelector('#myCanvas');
	const c = canvas.getContext('2d'); // context

	canvas.width = 1024
	canvas.height = 576

	const GRAINE_SIZE = 10;
	const FOSSE_SIZE = (canvas.width * 0.60) / 12;

	class Oval {
		constructor(center, radiusX, radiusY, color) {
			this.center = center;
			this.radiusX = radiusX;
			this.radiusY = radiusY;
			this.color = color;
		}

		draw() {
			c.beginPath();
			c.ellipse(this.center.x, this.center.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
			c.fillStyle = this.color;
			c.fill();
		}

		update() {
			this.draw();
		}
	}

	class Circle extends Oval {
		constructor(center, radius, color, hoverable = false) {
			super(center, radius, radius, color);
			this.radius = radius;
			this.hoverable = hoverable
		}

		hoverCircle(position) {
			if (this.hoverable && ((position.x - this.center.x) ** 2) + ((position.y - this.center.y) ** 2) <= (this.radius**2)) {
				return true;
			}
			return false;
		}
	};

	class Graine extends Circle {
		constructor(center, color = 'green') {
			super(center, GRAINE_SIZE, color);
		}
	};

	class Fosse extends Circle {
		constructor(center, color = 'lightblue') {
			super(center, FOSSE_SIZE, color, true);
			this.graines = new Array();
			this.addGrain();
			this.addGrain();
			this.addGrain();
			this.addGrain();
		}

		addGrain() {
			let col = Math.floor(Math.random() * 3)
			let posX = Math.floor(Math.random() * (this.radius * 0.75))
			if (posX % 2) {
				posX *= -1;
				col *= -1;
			}
			this.graines.push(
				new Graine({
					x: (this.center.x) + posX,
					y: this.center.y + ((this.radius / 4) * col)
				}, "#" + Math.floor(Math.random()*16777215).toString(16))
			);
		}

		draw() {
			super.draw();
			this.graines.forEach((g, i) => {
				g.draw();
			});
		}
	};

	class Magasin extends Oval {
		constructor(center, color = 'lightgray') {
			super(center, FOSSE_SIZE, FOSSE_SIZE * 2, color);
		}
	};

	class Mancala {
		constructor() {
			this.board = {
				'A': new Fosse({x: 147, y: 144}),
				'B': new Fosse({x: 147 * 2 , y: 144}),
				'C': new Fosse({x: 147 * 3 , y: 144}),
				'D': new Fosse({x: 147 * 4 , y: 144}),
				'E': new Fosse({x: 147 * 5 , y: 144}),
				'F': new Fosse({x: 147 * 6 , y: 144}),
				'G': new Fosse({x: 147 , y: 432}),
				'H': new Fosse({x: 147 * 2 , y: 432}),
				'I': new Fosse({x: 147 * 3 , y: 432}),
				'J': new Fosse({x: 147 * 4 , y: 432}),
				'K': new Fosse({x: 147 * 5 , y: 432}),
				'L': new Fosse({x: 147 * 6 , y: 432}),
				'1': new Magasin({x: 68, y: 288}),
				'2': new Magasin({x: 959, y: 288})
			};
	        this.order = "ABCDEF1LKJIHG2";
	        this.PLAYER_1_PITS = ['A', 'B', 'C', 'D', 'E', 'F'];
	        this.PLAYER_2_PITS = ['G', 'H', 'I', 'J', 'K', 'L'];
        }

        checkValidPit(playerTurn, pit) {
			if (playerTurn == 1 && this.PLAYER_1_PITS.includes(pit)) {
			    return false
			} else if (playerTurn == 2 && this.PLAYER_2_PITS.includes(pit)) {
			    return false
			} else if (playerTurn != 1 && playerTurn != 2) {
			    return false
			} else if (this.board[pit] <= 0) {
			    return false
			}
			return true
        }

        /*
		def checkValidPit(self, playerTurn, pit):
		if playerTurn == 1 and pit not in self.PLAYER_1_PITS:
		    return False
		elif playerTurn == 2 and pit not in self.PLAYER_2_PITS:
		    return False
		elif playerTurn != 1 and playerTurn != 2:
		    return False
		elif self.board[pit] <= 0:
		    return False
		return True

		def possibleMoves(self, playerTurn):
		possibilities = list()
		if playerTurn == 1:
		    pits = self.PLAYER_1_PITS
		elif playerTurn == 2:
		    pits = self.PLAYER_2_PITS
		for _ in pits:
		    if self.board[_] > 0:
		        possibilities.append(_)
		return possibilities

		def getNextPit(self, pit):
		if pit not in self.order:
		    return None
		index = self.order.find(pit) + 1
		index %= len(self.order)
		return (self.order[index])

		def getOpositePit(self, pit):
		if pit not in self.order or (pit not in self.PLAYER_1_PITS and pit not in self.PLAYER_2_PITS):
		    return None
		index = self.order.find(pit) + 1
		return (self.order[-(index + 1)])

		def doSpecialMove(self, playerTurn, pit):
		if not self.checkValidPit(playerTurn, pit):
		    return None
		opositePit = self.getOpositePit(pit)
		self.board[str(playerTurn)] += self.board[opositePit] + self.board[pit]
		self.board[opositePit] = 0
		self.board[pit] = 0

		def doMove(self, playerTurn, pit):
		if not self.checkValidPit(playerTurn, pit):
		    return None
		seedsToSow = self.board[pit]
		self.board[pit] = 0
		# Move all seeds that need to be moved
		while seedsToSow > 0:
		    pit = self.getNextPit(pit)
		    self.board[pit] += 1
		    seedsToSow -= 1
		# Check who plays next
		if (playerTurn == 1):
		    # Special move check
		    if pit in self.PLAYER_1_PITS and self.board[pit] == 1:
		        self.doSpecialMove(1, pit)
		    if pit == '1':
		        return 1
		    return 2
		elif (playerTurn == 2):
		    # Special move check
		    if pit in self.PLAYER_2_PITS and self.board[pit] == 1:
		        self.doSpecialMove(2, pit)
		    if pit == '2':
		        return 2
		    return 1

		def seedsLeft(self, player):
		if player != 1 and player != 2:
		    return None
		result = 0
		if player == 1:
		    pits = self.PLAYER_1_PITS
		else:
		    pits = self.PLAYER_2_PITS
		for _ in pits:
		    result += self.board[_]
		return result

		def cleanBoard(self):
		for _ in self.PLAYER_1_PITS:
		    self.board['1'] += self.board[_]
		    self.board[_] = 0
		for _ in self.PLAYER_2_PITS:
		    self.board['2'] += self.board[_]
		    self.board[_] = 0

		def playerScore(self, player):
		return self.board[str(player)]
		*/

		draw() {
			for (let key in this.board) {
				this.board[key].draw();
			};
		}

		update() {
			this.draw();
		}
	}

	const m = new Mancala();
	canvas.onmousemove = function(e) {
		var rect = this.getBoundingClientRect(),
			x = e.clientX - rect.left,
			y = e.clientY - rect.top;

		m.PLAYER_1_PITS.forEach((val, i) => {
			if (m.board[val].hoverCircle({x: x, y: y})) {
				m.board[val].color = 'pink';
			} else {
				m.board[val].color = 'lightblue';
			}
		});
		m.PLAYER_2_PITS.forEach((val, i) => {
			if (m.board[val].hoverCircle({x: x, y: y})) {
				m.board[val].color = 'pink';
			} else {
				m.board[val].color = 'lightblue';
			}
		});
	};

	function animate() {
		window.requestAnimationFrame(animate);
		c.clearRect(0, 0, canvas.width, canvas.height);
		m.update();
	}
	animate();
});