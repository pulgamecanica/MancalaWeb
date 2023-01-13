# MancalaWeb
Play Mancala Online

## Resume

>    ```class Oval``` -> Oval
>
>    ```class Circle extends Oval``` -> Circle
>
>    ```class Graine extends Circle``` -> Graine (it looks like a circle)
>
>    ```class Fosse extends Circle``` -> Fosse (it's the circle where Graines are stored)
>
>    ```class Magasin extends Oval``` -> Magasin (it's an oval where the Graines won are stored)
>
>    ```class Mancala``` -> Represents a Mancala Board
>
>    ```class Game``` -> Represents a Game Between two parties
>
>    ```class Play``` -> This class will set up games

***
### Oval/Circle
To draw Ovals/Circles on the Canvas we use the ```oval#draw``` function.
***
### Fosse
We can add one Grain to the Fosse by using the function ```fosse#addGrain()```
The Fosse can be empty by using the function ```fosse#takeGraines()```
***
### Magasin
There are two ways to add Graines to the Magasin, either from moving one graine to the magasin or by using the special move which moves many graines.
To add graines to the magasin we can use ```magasin#addGrain()``` and ```magasin#addGrains(num)```
***
### Mancala
The mancala represents the boars, the board has only two main elements, the magasines and the fosses.
They can hold graines inside. In order to draw a board, we must draw the two magasines with their grains and the fosses with their grains.

```Mancala#deepCopy``` is a function that copies a ```Mancala```object entirely, so we can simulate many Mancala boards.

Use the function ```mancala#possibleMoves(playerTurn)``` to return a list of all possible Fosses that you can choose.

To know which Pit is next use the function ```mancala#getNextPit(pit)``` (clockwise)
Also you can use ```mancala#getOpositePit(pit)``` to know which pit is oposite, this helps with the special move.

You can use the ```mancala#cleanBoard()``` to clearthe board when the game concludes.

The ```mancala#update()```function will draw the board everytime.
***
### Game
The Game class will store the players, the current player Turn and a copy of the Board (Mancala object)
To perform the simulations we created a ```game#deepCopy()```for the game.

The most important thing to notice is that the ```Game```knows which playerTurn it is.

The ```Game#gameOver()```function will tell us if the game is Over and clear the Board if it's over

The other functions are quite explanatory tbh...
***
### Play
The ```Play``` class help us create Games, against IA, or humans.

If the IA is playing it will use the ```Play#negaMaxAlphaBetaPruning``` to choose the move.

```Play#update```is the function that contains the logic of the game flow, so decide who is playing and make moves.
***
### The Global Canvas

```canvas.onmousemove```
As the name suggest this will track the mouse movement, and everytime the mouse move, we want to check if the mouse is over a Fosse.
When the mouse is over a Fosse, the fosse will change color to pink.

```canvas.onclick```
When the user clicks we will send the input of the fosse clicked.

```guide```
This function will be called when the mouse is over a fosse, it shows the number of graines in the middle of the screen

```generateStats```
The window has an information button which displays the Game statistics.
This function will generate the necessary information and place it on the card.

```updateStats```
Updates the game card statistics

```playVS()``` , ```playAI()``` and ```playSimulation()```
This functions are triggered when the user clicks to play, they will create a new Play object.


```initialize()```
Will Setup buttons and canvas

### ```animate()```
This function is the main infinite loop that allows the game to continue infinitely.
