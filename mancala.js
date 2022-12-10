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

		restore() {
			this.radiusX = this.radius;
			this.radiusY = this.radius;
		}

		growShrink() {
			if (this.radiusX < this.radius / 1.2) {
				this.restore();
			} else {
				this.radiusX -= 0.1;
				this.radiusY -= 0.1
			}
		}
	};

	class Graine extends Circle {
		constructor(center, color = 'green') {
			super(center, GRAINE_SIZE, color);
		}
	};

	class Fosse extends Circle {
		constructor(center, id, color = 'lightblue') {
			super(center, FOSSE_SIZE, color, true);
			this.id = id;
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

		totalGrains() {
			return this.graines.length;
		}

		takeGrains() {
			this.graines = [];
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
			this.graines = new Array();
		}

		addGrains(num) {
			while (num > 0) {
				this.addGrain();
				num -= 1;
			}
		}

		addGrain() {
			let col = Math.floor(Math.random() * 3)
			let posX = Math.floor(Math.random() * (this.radiusX * 0.75))
			if (posX % 2) {
				posX *= -1;
				col *= -1;
			}
			this.graines.push(
				new Graine({
					x: (this.center.x) + posX,
					y: this.center.y + ((this.radiusY / 4) * col)
				}, "#" + Math.floor(Math.random()*16777215).toString(16))
			);
		}

		draw() {
			super.draw();
			this.graines.forEach((g, i) => {
				g.draw();
			});
		}

		score() {
			return this.graines.length;
		}
	};

	class Mancala {
		constructor() {
			this.board = {
				'A': new Fosse({x: 147, y: 432}, 'A'),
				'B': new Fosse({x: 147 * 2 , y: 432}, 'B'),
				'C': new Fosse({x: 147 * 3 , y: 432}, 'C'),
				'D': new Fosse({x: 147 * 4 , y: 432}, 'D'),
				'E': new Fosse({x: 147 * 5 , y: 432}, 'E'),
				'F': new Fosse({x: 147 * 6 , y: 432}, 'F'),
				'G': new Fosse({x: 147 , y: 144}, 'G'),
				'H': new Fosse({x: 147 * 2 , y: 144}, 'H'),
				'I': new Fosse({x: 147 * 3 , y: 144}, 'I'),
				'J': new Fosse({x: 147 * 4 , y: 144}, 'J'),
				'K': new Fosse({x: 147 * 5 , y: 144}, 'K'),
				'L': new Fosse({x: 147 * 6 , y: 144}, 'L'),
				'1': new Magasin({x: 959, y: 288}),
				'2': new Magasin({x: 68, y: 288})
			};
	        this.order = "ABCDEF1LKJIHG2";
	        this.PLAYER_1_PITS = ['A', 'B', 'C', 'D', 'E', 'F'];
	        this.PLAYER_2_PITS = ['G', 'H', 'I', 'J', 'K', 'L'];
        }

        checkValidPit(playerTurn, pit) {
			if (playerTurn == 1 && !this.PLAYER_1_PITS.includes(pit)) {
			    return false;
			} else if (playerTurn == 2 && !this.PLAYER_2_PITS.includes(pit)) {
			    return false;
			} else if (playerTurn != 1 && playerTurn != 2) {
			    return false;
			} else if (this.board[pit] <= 0) {
			    return false;
			}
			return true;
        }

		possibleMoves(playerTurn) {
			let possibilities = new Array();
			let pits = null;
			if (playerTurn == 1) {
				pits = this.PLAYER_1_PITS;
			} else if (playerTurn == 2) {
				pits = this.PLAYER_2_PITS;
			}
			if (!pits) {
				return;
			}
			pits.forEach((pit, i) => {
				if (this.board[pit].graines.length > 0)
					possibilities.push(pit);
			});
			return possibilities;
		}

		getNextPit(pit) {
			if (!this.order.includes(pit)) {
				return null;
			}
			let index = this.order.indexOf(pit) + 1;
			index %= this.order.length;
			return (this.order[index]);
		}
		
		getOpositePit(pit) {
			if (!this.PLAYER_1_PITS.includes(pit) && !this.PLAYER_2_PITS.includes(pit)) {
				return null;
			}
			let index = this.order.indexOf(pit) + 1;
			return (this.order[this.order.length - (index + 1)]);
		}

		
		doSpecialMove(playerTurn, pit) {
			if (!this.checkValidPit(playerTurn, pit)) {
				return null;
			}
			let opositePit = this.getOpositePit(pit);
			this.board["" + playerTurn].addGrains(this.board[opositePit].totalGrains() + this.board[pit].totalGrains());
			this.board[opositePit].takeGrains();
			this.board[pit].takeGrains();
		}

		doMove(playerTurn, pit) {
			if (!this.checkValidPit(playerTurn, pit)) {
				return null;
			}
			let seedsToSow = this.board[pit].totalGrains();
			this.board[pit].takeGrains();
			while (seedsToSow > 0) {
		    	pit = this.getNextPit(pit);
		    	this.board[pit].addGrain();
		    	seedsToSow -= 1;
		    }
		    if (playerTurn == 1) {
			    if (this.PLAYER_1_PITS.includes(pit) && this.board[pit].totalGrains() == 1) {
			        this.doSpecialMove(playerTurn, pit);
			    }
			    if (pit == '1') {
			        return 1;
			    }
			    return 2;
			} else if (playerTurn == 2) {
			    if (this.PLAYER_2_PITS.includes(pit) && this.board[pit].totalGrains() == 1) {
			        this.doSpecialMove(playerTurn, pit);
			    }
			    if (pit == '2') {
			        return 2;
			    }
			}
		    return 1;
		}

		seedsLeft(player) {
			if (player != 1 && player != 2) {
		    	return null	
			}
			let result = 0, pits = [];
			if (player == 1) {
				pits = this.PLAYER_1_PITS;
			} else {
				pits = this.PLAYER_2_PITS;
			}
			pits.forEach((pit, i) => {
				result += this.board[pit].totalGrains();
			});
			return result;
		}

		cleanBoard() {
			this.PLAYER_1_PITS.forEach((pit, i) => {
				this.board['1'] += self.board[pit];
				this.board[pit].takeGrains();
			});
			this.PLAYER_2_PITS.forEach((pit, i) => {
				this.board['2'] += self.board[pit];
				this.board[pit].takeGrains();
			});
		}

		playerScore(player) {
			return this.board["" + player].score();
		}
		

		draw() {
			for (let key in this.board) {
				this.board[key].draw();
			};
		}

		update(playerTurn) {
			let restoreFosses = null
			if (playerTurn == "1") {
				restoreFosses = this.PLAYER_2_PITS;
			} else if (playerTurn == "2") {
				restoreFosses = this.PLAYER_1_PITS;
			}
			restoreFosses.forEach((key, i) => {
				this.board[key].restore();
			});
			this.draw();
			let pits = this.possibleMoves("" + playerTurn);
			for (let key in this.possibleMoves("" + playerTurn)) {
				this.board[pits[key]].growShrink();
			};
		}
	}

	class Game {
		constructor(playerStarting = 1) {
			this.state = new Mancala();
			this.playerTurn = playerStarting;
		}

		gameOver() {
			let finished = this.state.seedsLeft(1) == 0 || this.state.seedsLeft(2) == 0
			if (finished) {
				this.state.cleanBoard();
			}
			return finished;
		}

		findWinner() {
			if (!this.gameOver())
				return null;
			if (this.state.playerScore(1) > this.state.playerScore(2)) {
				return {1: this.state.playerScore(1)}
			} else {
				return {2: this.state.playerScore(2)}
			}
		}

		doMove(pit) {
			return this.state.doMove(this.playerTurn, pit);
		}

		evaluate() {
			return this.state.playerScore(1) - this.state.playerScore(2);
		}

		possibleMoves() {
			return this.state.possibleMoves(this.playerTurn);
		}

		update() {
			this.state.update(this.playerTurn);
		}
	}

	const game = new Game();
	let num_grains = null;
	canvas.onmousemove = function(e) {
		let rect = this.getBoundingClientRect(),
			x = e.clientX - rect.left,
			y = e.clientY - rect.top;
		num_grains = null;
		game.state.PLAYER_1_PITS.forEach((val, i) => {
			if (game.state.board[val].hoverCircle({x: x, y: y})) {
				game.state.board[val].color = 'pink';
				num_grains = val + " : " + game.state.board[val].totalGrains();
			} else {
				game.state.board[val].color = 'lightblue';
			}
		});
		game.state.PLAYER_2_PITS.forEach((val, i) => {
			if (game.state.board[val].hoverCircle({x: x, y: y})) {
				game.state.board[val].color = 'pink';
				num_grains = val + " : " + game.state.board[val].totalGrains();
			} else {
				game.state.board[val].color = 'lightblue';
			}
		});
	};

	canvas.onclick = function(e) {
		let rect = this.getBoundingClientRect(),
			x = e.clientX - rect.left,
			y = e.clientY - rect.top;
		let fosse = null;
		game.state.PLAYER_1_PITS.forEach((val, i) => {
			if (game.state.board[val].hoverCircle({x: x, y: y})) {
				fosse = game.state.board[val];
			}
		});
		game.state.PLAYER_2_PITS.forEach((val, i) => {
			if (game.state.board[val].hoverCircle({x: x, y: y})) {
				fosse = game.state.board[val];
			}
		});
		if (fosse) {
			let turn = game.doMove(fosse.id)
			if (turn != null) {
				game.playerTurn = turn;
			}
		}

	};

	function guide() {
		if (num_grains) {
			c.font = "30px Arial";
			c.fillStyle = "red";
			c.textAlign = "center";
			c.fillText("" + num_grains, canvas.width/2, canvas.height/2);
		}
	}

	function animate() {
		window.requestAnimationFrame(animate);
		c.clearRect(0, 0, canvas.width, canvas.height);
		game.update();
		guide();
	}
	animate();
});