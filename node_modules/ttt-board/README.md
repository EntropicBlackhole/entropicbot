# TTT Board

> A simple TicTacToe package for NodeJS, uses an Object Matrix type implementation for the board. Automatically takes care of turns and the board, simply move, get outputs and check if it's finished

## Installation

```sh
$ npm install ttt-board
```

### Running the tests

```sh
$ npm run test-ttt
```

## Getting started
Basically just set it up
```js
const ttt = new TTTBoard();

ttt.move("A", "2") // This uses an ABC 123 system, ABC for rows and 123 for columns, to move simply place ttt.move("A", "2") for example, top center, automatically turns to uppercase if lowercase
ttt.AImove() //Really is just a random move but it's cool to call it AI

let boardConfig = ttt.outputBoard() //Returns the board in it's config format, basically an object matrix
let boardImage = ttt.displayBoard() //Returns the board in a PNG format, just an image of the board
let boardASCII = ttt.writeBoard() //Returns the board in ASCII format (as a string), so you can write it to console! 

ttt.isFinished() //Returns true if the match has finished, to avoid making any more moves
ttt.turn() //Returns X or O depending on who's turn it is. When winning, ttt.turn() will output the winning letter
```
