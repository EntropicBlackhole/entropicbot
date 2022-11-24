class TTTBoard {
	constructor(config = {
		board: {
			"A": { "1": "", "2": "", "3": "" },
			"B": { "1": "", "2": "", "3": "" },
			"C": { "1": "", "2": "", "3": "" }
		},
		isFinished: false,
		turn: 'X'
	}) {
		this.config = config;
	}

	move(row, column) {
		row = row.toUpperCase();
		let occupiedSpots = [];
		for (let i in this.config.board) for (let j in this.config.board[i]) if (this.config.board[i][j]) occupiedSpots.push(`${i}|${j}`);
		if (!["A", "B", "C"].includes(row)) return null
		if (!["1", "2", "3"].includes(column)) return null
		if (occupiedSpots.includes(`${row}|${column}`)) return null
		let winningMoves = [
			["A1", "A2", "A3"],
			["B1", "B2", "B3"],
			["C1", "C2", "C3"],
			["A1", "B1", "C1"],
			["A2", "B2", "C2"],
			["A3", "B3", "C3"],
			["A1", "B2", "C3"],
			["A3", "B2", "C1"]
		]
		this.config.board[row][column] = this.config.turn
		for (let i of winningMoves) if (this.config.board[i[0].split('')[0]][i[0].split('')[1]] == this.config.turn && this.config.board[i[1].split('')[0]][i[1].split('')[1]] == this.config.turn && this.config.board[i[2].split('')[0]][i[2].split('')[1]] == this.config.turn) return ((this.config.isFinished = true) ? [row, column] : [row, column])
		this.config.turn = (this.config.turn == 'X' ? 'O' : 'X')
		return [row, column]
	}
	AImove() {
		let emptySpots = [];
		for (let i in this.config.board)
			for (let j in this.config.board[i]) {
				if (this.config.board[i][j] == '')
					emptySpots.push(`${i}|${j}`);
			}
		let randomMove = emptySpots[Math.floor(Math.random() * (emptySpots.length))].split('|')
		return this.move(randomMove[0], randomMove[1]);
	}
	outputBoard() {
		return this.config
	}
	displayBoard() { }
	writeBoard() {
		let main = '    1   2   3\n\n'
		for (let i in this.config.board) {
			main += `${i}   `
			for (let j in this.config.board[i]) main += (this.config.board[i][j] ? this.config.board[i][j] : ' ') + ((j != "3") ? ' | ' : '')
			main += (i != "C") ? '\n    --+---+--\n' : '' 
		}
		main += '\n'
		return main
	}
	isFinished() {
		return this.config.isFinished
	}
	turn() {
		return this.config.turn
	}
}

module.exports = TTTBoard;