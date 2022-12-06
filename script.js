$(document).ready(function() {
    $('#game-vs').click(function(event) {
      startGame(1)
    });
    $('#game-solo').click(function(event) {
      startGame(2)
    });
    $('#game-simulation').click(function(event) {
      startGame(3)
    });
});

const titleSolo = $("<h1> Play Solo </h1>")
const titleVs = $("<h1> Play vs </h1>")
const titleSimulation = $("<h1> Play Simulation </h1>")

function setTitle(option) {
  if (option == 1) {
    $('#container-game').append(titleSolo);
  } else if (option == 2) {
    $('#container-game').append(titleVs);
  } else if (option == 3) {
    $('#container-game').append(titleSimulation);
  }
}

function startGame(option) {
  $('#container-game').css("display", "flex");
  setTitle(option);
}

