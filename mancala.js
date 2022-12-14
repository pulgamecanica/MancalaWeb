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
				this.board['1'].addGrains(this.board[pit].totalGrains())
				this.board[pit].takeGrains();
			});
			this.PLAYER_2_PITS.forEach((pit, i) => {
				this.board['2'].addGrains(this.board[pit].totalGrains())
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
		constructor(player1Human = true, player2Human = true, playerStarting = 1) {
			this.state = new Mancala();
			this.playerTurn = playerStarting;
			this.player1Human = player1Human;
			this.player2Human = player2Human;
		}

		gameOver() {
			let finished = this.state.seedsLeft(1) == 0 || this.state.seedsLeft(2) == 0;
			if (finished) {
				this.state.cleanBoard();
			}
			return finished;
		}

		findWinner() {
			if (!this.gameOver())
				return null;
			if (this.state.playerScore(1) > this.state.playerScore(2)) {
				return {player: 1, score: this.state.playerScore(1)}
			} else {
				return {player: 2, score: this.state.playerScore(2)}
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

		turnTypeHuman() {
			if (this.playerTurn == "1") {
				return this.player1Human;
			} else {
				return this.player2Human;
			}
		}
	}

	class Play {
		constructor(player1Human = true, player2Human = true) {
			this.originalGame = new Game(player1Human, player2Human);
		}

		negaMaxAlphaBetaPruning(game, player, depth, alpha, beta) {
			var _, bestPit, bestValue, child_game, value;
			if (game.gameOver() || depth === 1) {
			  bestValue = game.evaluate();
			  bestPit = null;

			  if (player === Play.HUMAN) {
			    bestValue = -bestValue;
			  }

			  return [bestValue, bestPit];
			}
			bestValue = -Infinity;
			bestPit = null;
			for (var pit, _pj_c = 0, _pj_a = game.possibleMoves(), _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
			  pit = _pj_a[_pj_c];
			  child_game = new Game({...game});
			  child_game.doMove(pit);
			  [value, _] = this.negaMaxAlphaBetaPruning(child_game, -player, depth - 1, -beta, -alpha);
			  value = -value;

			  if (value > bestValue) {
			    bestValue = value;
			    bestPit = pit;
			  }

			  if (bestValue > alpha) {
			    alpha = bestValue;
			  }

			  if (beta <= alpha) {
			    break;
			  }
			}
			return [bestValue, bestPit];
		}

		update(x, y) {
			if (this.originalGame.turnTypeHuman() && x != null && y != null) {
				let fosse = null;
				this.originalGame.state.PLAYER_1_PITS.forEach((val, i) => {
					if (this.originalGame.state.board[val].hoverCircle({x: x, y: y})) {
						fosse = this.originalGame.state.board[val];
					}
				});
				this.originalGame.state.PLAYER_2_PITS.forEach((val, i) => {
					if (this.originalGame.state.board[val].hoverCircle({x: x, y: y})) {
						fosse = this.originalGame.state.board[val];
					}
				});
				if (fosse) {
					let turn = this.originalGame.doMove(fosse.id)
					if (turn != null) {
						this.originalGame.playerTurn = turn;
					}
				}
			} else if (!this.originalGame.turnTypeHuman()) {
				let computedAI = this.negaMaxAlphaBetaPruning(this.originalGame, false, 8, -Infinity, Infinity)
				this.originalGame.state.board[computedAI[1]].color = "red";
				let turn = this.originalGame.doMove(computedAI[1])
				if (turn != null) {
					this.originalGame.playerTurn = turn;
				}
			}
		}
	}

	/* LOGIC ENDS, START PLAY */
	let p = new Play();
	let num_grains = null;

	canvas.onmousemove = function(e) {
		if (!p)
			return;
		let rect = this.getBoundingClientRect(),
			x = e.clientX - rect.left,
			y = e.clientY - rect.top;
		num_grains = null;
		p.originalGame.state.PLAYER_1_PITS.forEach((val, i) => {
			if (p.originalGame.state.board[val].hoverCircle({x: x, y: y})) {
				p.originalGame.state.board[val].color = 'pink';
				num_grains = val + " : " + p.originalGame.state.board[val].totalGrains();
			} else {
				p.originalGame.state.board[val].color = 'lightblue';
			}
		});
		p.originalGame.state.PLAYER_2_PITS.forEach((val, i) => {
			if (p.originalGame.state.board[val].hoverCircle({x: x, y: y})) {
				p.originalGame.state.board[val].color = 'pink';
				num_grains = val + " : " + p.originalGame.state.board[val].totalGrains();
			} else {
				p.originalGame.state.board[val].color = 'lightblue';
			}
		});
	};

	canvas.onclick = function(e) {
		if (p.originalGame.turnTypeHuman() && !p.originalGame.gameOver()) {
			let rect = this.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top;
			p.update(x, y);
		}
	};

	function guide() {
		if (num_grains) {
			c.font = "30px Arial";
			c.fillStyle = "primary";
			c.textAlign = "center";
			c.fillText("" + num_grains, canvas.width/2, canvas.height/2);
		}
	}

	function generateStats() {
		const stats = $("<div id='game-stats' class='m-auto p-3'></div>")
		const card = $("<div class='card bg-dark' style='width: 18rem;'>\
				<div class='card-body'>\
				<h5 class='card-title' id='stats-title'></h5>\
				<h6 class='card-subtitle mb-2 text-muted' id='stats-subtitle'></h6>\
				<p class='card-text' id='stats-score1'></p>\
				<p class='card-text' id='stats-score2'></p>\
				<button class='btn btn-primary p-3 m-auto' id='play-again-button'>Play Again</button>\
			</div></div>");
		const close = $("<svg width='24px' height='24px' viewBox='0 0 24 24' id='close-stats' fill='white'><path fill-rule='evenodd' clip-rule='evenodd' d='M4.22676 4.22676C4.5291 3.92441 5.01929 3.92441 5.32163 4.22676L12 10.9051L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0949 12L19.7732 18.6784C20.0756 18.9807 20.0756 19.4709 19.7732 19.7732C19.4709 20.0756 18.9807 20.0756 18.6784 19.7732L12 13.0949L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9051 12L4.22676 5.32163C3.92441 5.01929 3.92441 4.5291 4.22676 4.22676Z'/></svg>");
		close.css("position", "absolute");
		close.css("cursor", "pointer");
		close.css("top", "24px");
		close.css("right", "24px");
		close.on("click", function() {hideStats()});
		stats.append(card);
		stats.append(close);
		stats.css("position", "absolute");
		stats.css("top", "50%");
		stats.css("left", "50%");
		stats.css("transform", "translate(-50%, -50%)");
		stats.css("display", "none");
		$("#container-game").append(stats);
	}

	function updateStats(p) {
		if (p.originalGame.gameOver()) {
			$('#close-stats').css("display", "none");
			$("#stats-title").text("🏆 Winner Player " + p.originalGame.findWinner().player);
		} else {
			$('#close-stats').css("display", "block");
			$("#stats-title").text("No Contest!");
		}
		if (p.originalGame.player1Human && p.originalGame.player1Human) {
			$("#stats-subtitle").text("Human VS Human");
		} else if (!p.originalGame.player1Human || !p.originalGame.player1Human) {
			$("#stats-subtitle").text("AI VS Human");
		} else {
			$("#stats-subtitle").text("Simulation");
		}
		$("#stats-score1").text("Player1 Score: " + p.originalGame.state.playerScore(1));
		$("#stats-score2").text("Player2 Score: " + p.originalGame.state.playerScore(2));
	}

	function showStats(p) {
		if ($("#game-stats").css("display") == "none") {
			$("#game-stats").css("display", "block");
			updateStats(p)
		}
	}

	function hideStats() {
		if ($("#game-stats").css("display") != "none") {
			$("#game-stats").css("display", "none");
		}
	}

	function playVS() {
		p = new Play(true, true);
		hideStats();
	}

	function playAI() {
		p = new Play(true, false);
		hideStats();
	}

	function playSimulation() {
		p = new Play(false, false);
		hideStats();
	}

	function initialize() {
		generateStats();
		const statsInfo = $("<svg x='0px' y='0px'\
			viewBox='0 0 330 330' style='enable-background:new 0 0 330 330;' xml:space='preserve'>\
			<path d='M165,0.008C74.019,0.008,0,74.024,0,164.999c0,90.977,74.019,164.992,165,164.992s165-74.015,165-164.992 C330,74.024,255.981,0.008,165,0.008z M165,299.992c-74.439,0-135-60.557-135-134.992S90.561,30.008,165,30.008 s135,60.557,135,134.991C300,239.436,239.439,299.992,165,299.992z'/>\
			<path d='M165,130.008c-8.284,0-15,6.716-15,15v99.983c0,8.284,6.716,15,15,15s15-6.716,15-15v-99.983 C180,136.725,173.284,130.008,165,130.008z'/>\
			<path d='M165,70.011c-3.95,0-7.811,1.6-10.61,4.39c-2.79,2.79-4.39,6.66-4.39,10.61s1.6,7.81,4.39,10.61 c2.79,2.79,6.66,4.39,10.61,4.39s7.81-1.6,10.609-4.39c2.79-2.8,4.391-6.66,4.391-10.61s-1.601-7.82-4.391-10.61 C172.81,71.61,168.95,70.011,165,70.011z'/>\
		</svg>");
		statsInfo.on("click", function() {showStats(p)});
		statsInfo.css("position", "absolute");
		statsInfo.css("fill", "rgb(25, 122, 242)");
		statsInfo.css("width", "25px");
		statsInfo.css("height", "25px");
		statsInfo.css("top", "25px");
		statsInfo.css("right", "25px");
		statsInfo.css("cursor", "pointer");
		$("#container-game").append(statsInfo);
		$('#game-vs').on("click", function() {
			playVS();
			$("#play-again-button").on("click", function() {playVS()});
	    });
	    $('#game-solo').on("click", function() {
	      	playAI();
			$("#play-again-button").on("click", function() {playAI()});
	    });
	    $('#game-simulation').on("click", function() {
	    	playSimulation();
			$("#play-again-button").on("click", function() {playSimulation()});
	    });
	}

	initialize();

	function animate() {
		if (p != null) {
			window.requestAnimationFrame(animate);
			c.clearRect(0, 0, canvas.width, canvas.height);
			p.originalGame.update();
			updateStats(p)
			guide();
			if (!p.originalGame.gameOver() && !p.originalGame.turnTypeHuman()) {
				p.update(null, null);
			}
			if (p.originalGame.gameOver()) {
				showStats(p);
			}
		}
	}
	animate();
});