const { SlashCommandBuilder } = require('discord.js');
const TTTBoard = require('ttt-board')
const fs = require('fs')
module.exports = {
	name: "TicTacToe",
	description: "Play TicTacToe with someone!",
	usage: "start <opponent>, move <spot>, end",
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('Play TicTacToe with someone!')
		.addSubcommand(subcommand => subcommand
			.setName('start')
			.setDescription('Starts a ttt match!')
			.addUserOption(option => option
				.setName('opponent')
				.setDescription('User you wanna play against!')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('move')
			.setDescription('Make your move!')
			.addStringOption(option => option
				.setName('spot')
				.setDescription('Spot to make your move, example A2 would be top center, C3 would be bottom right')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('end')
			.setDescription('Ends your current match')),
	async execute(interaction, client) {
		await interaction.deferReply();
		const tttGames = JSON.parse(fs.readFileSync('./lib/database/misc/games/ttt/tictactoe_games.json'));
		if (tttGames[interaction.guild.id] == undefined) {
			tttGames[interaction.guild.id] = {
				games: {},
				players: {},
				amount_of_games: 0
			}
			fs.writeFileSync("./lib/database/misc/games/ttt/tictactoe_games.json", JSON.stringify(tttGames, null, 2));
		}
		const subcommand = interaction.options.getSubcommand();
		if (subcommand == 'start') {
			if (!["", undefined].includes(tttGames[interaction.guild.id].players[interaction.user.id])) return interaction.editReply('You already are in a match! If you want to start a new game, do tictactoe end to end your current game!');
			let opponent = interaction.options.getUser('opponent')
			if (interaction.user.id == opponent.id) return interaction.editReply('You played yourself, huh,,,')
			if (!["", undefined].includes(tttGames[interaction.guild.id].players[opponent.id])) return interaction.editReply(`${opponent.username} is already in a match! You probably wanna let them know you wanna play with them!`);
			if (opponent.bot) return interaction.editReply("You can't play tictactoe against a bot you dumbass")

			interaction.editReply(`Are you sure ${opponent.username} is the correct person you wanna play with? (y/n)`)
			const filter = m => (['y', 'n'].includes(m.content.toLowerCase()) && m.author.id === interaction.user.id);
			const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			collector.on('collect', m => {
				if (m.content.toLowerCase() == 'n') return interaction.followUp('Please retry the command then! Make sure to choose the correct person!')
				if (m.content.toLowerCase() == 'y') {
					const ttt = new TTTBoard();
					let tttRound = {
						boardConfig: ttt.outputBoard(),
						X: interaction.user.id,
						O: opponent.id
					}
					let gameID = (tttGames[interaction.guild.id].amount_of_games + 1).toString()
					tttGames[interaction.guild.id].games[gameID] = tttRound;
					tttGames[interaction.guild.id].players[interaction.user.id] = gameID;
					tttGames[interaction.guild.id].players[opponent.id] = gameID;
					tttGames[interaction.guild.id].amount_of_games += 1;
					fs.writeFileSync("./lib/database/misc/games/ttt/tictactoe_games.json", JSON.stringify(tttGames, null, 2));
					boardNew = '```' + ttt.writeBoard() + '```'
					return interaction.followUp({ content: `You start! Do tictactoe move <spot>! With <spot> being something like A2 for example!\n${boardNew}`, files: [] })
				}
			})
		}
		if (subcommand == 'move') {
			let spot = interaction.options.getString('spot');
			if (["", undefined].includes(tttGames[interaction.guild.id].players[interaction.user.id])) return interaction.editReply('You\'re not in a match yet! Start a new match by doing tictactoe start <opponent> and start playing!');
			var currentGame = tttGames[interaction.guild.id].games[tttGames[interaction.guild.id].players[interaction.user.id]]
			if (currentGame[currentGame.boardConfig.turn] != interaction.user.id) return interaction.editReply('It is not your turn dumbass, wait until it\'s your turn k?')
			let row = spot.split('')[0].toUpperCase()
			let col = spot.split('')[1]
			if (!(row.match(/[A-C]/))) return interaction.editReply("Row is invalid, please enter a valid space. (A, B, C)")
			if (!(col.match(/[1-3]/))) return interaction.editReply("Column is invalid, please enter a valid space. (1, 2, 3)")
			const ttt = new TTTBoard(currentGame.boardConfig)
			let move = ttt.move(row, col)
			if (move == null) return interaction.editReply('You can\'t move here!')
			currentGame.boardConfig = ttt.outputBoard();
			tttGames[interaction.guild.id].games[tttGames[interaction.guild.id].players[interaction.user.id]] = currentGame
			fs.writeFileSync('./lib/database/misc/games/ttt/tictactoe_games.json', JSON.stringify(tttGames, null, 2))
			boardNew = ttt.writeBoard()
			if(ttt.isFinished()) {
				var winner = currentGame[((ttt.outputBoard().turn == 'O') ? 'O' : 'X')]
				var loser = currentGame[((ttt.outputBoard().turn == 'X') ? 'O' : 'X')]
				tttGames[interaction.guild.id].players[winner] = ""
				tttGames[interaction.guild.id].players[loser] = ""
				currentGame = tttGames[interaction.guild.id].games[tttGames[interaction.guild.id].players[interaction.user.id]]
				fs.writeFileSync('./lib/database/misc/games/ttt/tictactoe_games.json', JSON.stringify(tttGames, null, 2))
				return interaction.editReply({ content: `<@${winner}> won with <@${loser}> losing! Good job <@${winner}>!` + '\n```' + boardNew + '```', files: [] })
			}
			interaction.followUp({ content: `You've moved on ${row}${col}! It's now <@${currentGame[currentGame.boardConfig.turn]}>'s turn!` + '\n```' + boardNew + '```', files: [] })

		}
		if (subcommand == 'end') {
			interaction.editReply("Are you sure you want to resign from your current tictactoe match? (y/n)")
			const filter = m => (["y", "n"].includes(m.content.toLowerCase()) && m.author.id === interaction.user.id);
			const collectorResign = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			collectorResign.on('collect', m => {
				if (m.content.toLowerCase() == 'y') {
					interaction.followUp("Okay then, deleting board...");
					gameID = tttGames[interaction.guild.id].players[interaction.user.id]
					tttGames[interaction.guild.id].players[interaction.user.id] = ""
					if (!(tttGames[interaction.guild.id].games[gameID].botPlaying))
						for (i in tttGames[interaction.guild.id].players)
							if (tttGames[interaction.guild.id].players[i] == gameID)
								tttGames[interaction.guild.id].players[i] = ""
					// delete games[message.author.id]
					fs.writeFileSync('./lib/database/misc/games/ttt/tictactoe_games.json', JSON.stringify(tttGames, null, 2));
					return interaction.followUp("Board deleted successfully")
				}
				if (m.content.toLowerCase() == 'n')
					return interaction.followUp('Alr then')
			})
		}
	},
};

