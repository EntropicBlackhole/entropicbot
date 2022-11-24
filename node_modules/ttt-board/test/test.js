const TTTBoard = require('../index')
const ttt = new TTTBoard();
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
play()

function play() {
	if (ttt.isFinished()) {
		console.log(ttt.writeBoard());
		return console.log(ttt.turn() + " has won!")
	}
	else {
		if (ttt.turn() == 'X') {
			console.log(ttt.writeBoard());
			readline.question('Make your move (Use row column: "A3"): ', move => {
				moveMade = ttt.move(move.split('')[0], move.split('')[1])
				if (moveMade === null) {
					console.log('Your input is invalid, please try again')
					play();
				}
				else {
					console.log(ttt.writeBoard());
					console.log("My turn!")
					play();
				}
			})
		}
		else if (ttt.turn() == 'O') {
			ttt.AImove()
			console.log(ttt.writeBoard());
			console.log("Your turn!")
			play()
		}
	}
}