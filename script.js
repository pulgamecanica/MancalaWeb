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
    $('#game-close').click(function(event) {
      closeGame();
    });
});


function setTitle(option) {
  if (option == 1) {
    $("#game-title").text("Play Solo");
  } else if (option == 2) {
    $("#game-title").text("Play VS");
  } else if (option == 3) {
    $("#game-title").text("Play Simulation");
  }
}

function closeGame() {
  $('#container-game').css("display", "none");
  $('#game-options').css("display", "flex");
}

function startGame(option) {
  $('#game-options').css("display", "none");
  $('#container-game').css("display", "flex");
  setTitle(option);
}

