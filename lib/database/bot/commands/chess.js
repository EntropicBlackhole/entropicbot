const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const jsChessEngine = require('js-chess-engine')
const { codeBlock } = require("@discordjs/builders");
const functions = require('../functions')
const fs = require('node:fs');

module.exports = {
	name: "Chess",
	description: "Play chess with me or a friend!",
	usage: "[start, move, board, resign]",
	data: new SlashCommandBuilder()
		.setName('chess')
		.setDescription('Play chess with me or a friend!')
		.addSubcommand(subcommand => subcommand
			.setName('start')
			.setDescription('Starts a chess match!')
			.addUserOption(userOption => userOption
				.setName('opponent')
				.setDescription('Your opponent for this chess match!')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('move')
			.setDescription('Make a chess move to your current match!')
			.addStringOption(stringOption => stringOption
				.setName('from')
				.setDescription('Move from:')
				.setRequired(true))
			.addStringOption(stringOption => stringOption
				.setName('to')
				.setDescription('Move to:')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('board')
			.setDescription('Shows the board of your current chess match!'))
		.addSubcommand(subcommand => subcommand
			.setName('resign')
			.setDescription('Resigns from your current chess match'))
		.addSubcommand(subcommand => subcommand
			.setName('help')
			.setDescription('Just helps you')),
	async execute(interaction, client) {
		await interaction.deferReply();
		const games = JSON.parse(fs.readFileSync("./lib/database/misc/games/chess/chess_games.json"))
		if (games[interaction.guild.id] == undefined) {
			games[interaction.guild.id] = {
				games: {},
				players: {},
				amount_of_games: 0
			}
			fs.writeFileSync("./lib/database/misc/games/chess/chess_games.json", JSON.stringify(games, null, 2));
		}
		let subCommand = interaction.options.getSubcommand()
		if (subCommand == 'start') {
			if (!["", undefined].includes(games[interaction.guild.id].players[interaction.user.id])) return interaction.editReply('You already are in a match! If you want to start a new game, do chess resign to end your current game!');
			let opponent = interaction.options.getUser('opponent')
			if (interaction.user.id == opponent.id) return interaction.editReply('You played yourself, huh,,,')
			if (!["", undefined].includes(games[interaction.guild.id].players[opponent.id])) return interaction.editReply(`${opponent.username} is already in a match! You probably wanna let them know you wanna play with them!`);
			if (opponent.bot && opponent != client.user) return interaction.editReply("You can't play chess against a bot (unless its me) you dumbass")
			if (opponent == client.user) {
				var difficultyNames = {
					"0": "Bwaby Mwode",
					"1": "Gently Easy",
					"2": "Intermediate",
					"3": "Hard as fuck",
					"4": "AI Overlords"
				}
				var aiTableImage = new AttachmentBuilder("./lib/assets/images/chess/aiLevelTable.png")
				interaction.editReply({ content: "What AI level would you like to play against?", files: [aiTableImage] })
				const filter = m => ((m.content.match(/[0-4]/)) && m.author.id === interaction.user.id);
				const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

				collector.on('collect', m => {
					const level = m.content
					interaction.followUp(`${level}: ${difficultyNames[level]} it is! What color do you wanna be? (white/black/random)`);
					const filter = m => (["white", "black", "random"].includes(m.content.toLowerCase()) && m.author.id === interaction.user.id);
					const collector2 = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

					collector2.on('collect', async m => {
						let color = m.content.toLowerCase();
						if (color === 'random') color = (Math.floor(Math.random() * 2) + 1 == 1) ? 'white' : 'black';
						interaction.followUp(`Okay then! Let's play! Your color is ${color}! (chess move <from> <to>)`)
						const game = new jsChessEngine.Game()
						var chessRound = {
							boardConfig: game.exportJson(),
							white: (color == 'white') ? interaction.user.id : client.user.id,
							black: (color == 'black') ? interaction.user.id : client.user.id,
							botPlaying: true,
							AILevel: parseInt(level)
						}
						let gameID = (games[interaction.guild.id].amount_of_games + 1).toString()
						games[interaction.guild.id].games[gameID] = chessRound;
						games[interaction.guild.id].players[interaction.user.id] = gameID;
						games[interaction.guild.id].amount_of_games += 1;
						fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2))
						if (color == 'black') {
							interaction.channel.send("I'm starting!")
							var aiMoves = game.aiMove(level)
							games[interaction.guild.id].games[gameID].boardConfig = game.exportJson();
							fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2))
							
							// fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2))
							boardNew = await functions.drawBoard(JSON.parse(fs.readFileSync('./lib/database/misc/games/chess/chess_games.json', 'utf8'))[interaction.guild.id].games[gameID].boardConfig)
							var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
							interaction.channel.send(`I'll move from ${Object.keys(aiMoves)} to ${Object.values(aiMoves)}`)
							return interaction.channel.send({ content: `Your turn! (chess move <from> <to>)`, files: [attachment] })

						}
						else if (color == 'white') {
							boardNew = await functions.drawBoard(JSON.parse(fs.readFileSync('./lib/database/misc/games/chess/chess_games.json', 'utf8'))[interaction.guild.id].games[gameID].boardConfig)
							var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
							return interaction.channel.send({ content: "You're starting! You're white! (chess move <from> <to>)", files: [attachment] })
						}
					})
				})
			}
			else {
				interaction.editReply(`Are you sure ${opponent.username} is the correct person you wanna play with? (y/n)`)
				const filter = m => (['y', 'n'].includes(m.content.toLowerCase()) && m.author.id === interaction.user.id);
				const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

				collector.on('collect', m => {
					if (m.content.toLowerCase() == 'n') return interaction.followUp('Please retry the command then! Make sure to choose the correct person!')
					if (m.content.toLowerCase() == 'y') {
						interaction.followUp(`What color do you wanna be? (${opponent.username} will be the other color) (white/black/random)`)
						const filter = m => (['white', 'black', 'random'].includes(m.content.toLowerCase()) && m.author.id === interaction.user.id);
						const colorCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

						colorCollector.on('collect', async m => {
							let color = m.content.toLowerCase();
							if (color === 'random') color = (Math.floor(Math.random() * 2) + 1 == 1) ? 'white' : 'black';
							const game = new jsChessEngine.Game()
							var chessRound = {
								boardConfig: game.exportJson(),
								white: (color == 'white') ? interaction.user.id : opponent.id,
								black: (color == 'black') ? interaction.user.id : opponent.id,
								botPlaying: false,
								AILevel: -1
							}
							let gameID = (games[interaction.guild.id].amount_of_games + 1).toString()
							games[interaction.guild.id].games[gameID] = chessRound;
							games[interaction.guild.id].players[interaction.user.id] = gameID;
							games[interaction.guild.id].players[opponent.id] = gameID;
							games[interaction.guild.id].amount_of_games += 1;
							fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2))
							boardNew = await functions.drawBoard(JSON.parse(fs.readFileSync('./lib/database/misc/games/chess/chess_games.json', 'utf8'))[interaction.guild.id].games[gameID].boardConfig)
							var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
							return interaction.followUp({ content: `Okay then! Let's play! Your color is \`${color}\`, ${opponent}'s color is \`${(color == 'white' ? 'black' : 'white')}\`! (chess move <from> <to>)`, files: [attachment] })
						})
					}
				})
			}
		} 
		else if (subCommand == 'move') {
			if (["", undefined].includes(games[interaction.guild.id].players[interaction.user.id])) return interaction.editReply('You\'re not in a match yet! Start a new match by doing chess start <opponent> and start playing!');
			var currentGame = games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]]
			if (currentGame[currentGame.boardConfig.turn] != interaction.user.id) return interaction.editReply('It is not your turn dumbass, wait until it\'s your turn k?')
			var from = interaction.options.getString('from')
			var to = interaction.options.getString('to')
			if (!(from.toLowerCase().match(/[a-h][1-8]/))) return interaction.editReply("<from> space is invalid, please enter a valid space. i.e. E2")
			if (!(to.toLowerCase().match(/[a-h][1-8]/))) return interaction.editReply("<to> space is invalid, please enter a valid space. i.e. E4")
			const game = new jsChessEngine.Game(currentGame.boardConfig)
			try {
				game.move(from, to);
			} catch (e) {
				return interaction.editReply(e.message);
			}
			currentGame.boardConfig = game.exportJson();
			games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]] = currentGame
			fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2))
			boardNew = await functions.drawBoard(currentGame.boardConfig)
			var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
			if (game.exportJson().isFinished) {
				var winner = currentGame[((game.exportJson().turn == 'white') ? 'black' : 'white')]
				var loser = currentGame[((game.exportJson().turn == 'black') ? 'black' : 'white')]
				// delete games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]]
				games[interaction.guild.id].players[winner] = ""
				games[interaction.guild.id].players[loser] = ""
				currentGame = games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]]
				fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2));
				return interaction.editReply({ content: `<@${winner}> won with <@${loser}> losing! Good job! <@${winner}>`, files: [attachment] })
			}
			await interaction.followUp({ content: `You've moved from ${from.toUpperCase()} to ${to.toUpperCase()}! ${(currentGame.botPlaying) ? 'Now it\'s my turn! (Don\'t play yet I\'m thinking)' : `It's now <@${currentGame[currentGame.boardConfig.turn]}>'s turn!`}`, files: [attachment] })
			if (currentGame.botPlaying) {
				var AIMoved = game.aiMove(currentGame.AILevel);
				currentGame.boardConfig = game.exportJson()
				games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]] = currentGame
				fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2))
				boardNew = await functions.drawBoard(currentGame.boardConfig)
				var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
				if (game.exportJson().isFinished) {
					var winner = client.user.id
					var loser = interaction.user.id
					games[interaction.guild.id].players[interaction.user.id] = ""
					// delete games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]]
					games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]] = currentGame
					fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2));
					if (winner == client.user.id) return interaction.editReply({ content: 'Ha I won, don\'t be a sore loser k?/j', files: [attachment] })
					else if (loser == client.user.id) return interaction.editReply({ content: 'You won. Eh, anyways this round was for fun right everyone?', files: [attachment] })
				}
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('chess-show-moves')
							.setLabel('Show possible moves')
							.setStyle(ButtonStyle.Primary),
					);
				interaction.editReply({ content: `I'll move from ${Object.keys(AIMoved)} to ${Object.values(AIMoved)}! It's your turn now! (chess move <from> <to>)`, files: [attachment], components: [row] })
				client.on('interactionCreate', async interaction => {
					if (!interaction.isButton()) return;
					if (interaction.customId == 'chess-show-moves') {
						var out = ""
						for (i in currentGame.boardConfig.moves) {
							out += `${i}: [${currentGame.boardConfig.moves[i].join(", ")}]\n`
						}
						interaction.reply({ content: codeBlock(out), ephemeral: true})
					}
				});
			}
		}
		else if (subCommand == 'board') {
			if (["", undefined].includes(games[interaction.guild.id].players[interaction.user.id])) return interaction.editReply('You\'re not in a match yet! Start a new match by doing chess start <opponent> and start playing!');
			var currentGame = games[interaction.guild.id].games[games[interaction.guild.id].players[interaction.user.id]]
			boardNew = await functions.drawBoard(currentGame.boardConfig)
			var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'), { name: "board.png" });
			const chessEmbed = new EmbedBuilder()
				.setTitle('Current Chess Board')
				// .setDescription(client.guilds.cache.get(interaction.guild.id).members.cache.get('708026434660204625').user.username)
				.setImage('attachment://board.png')
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return interaction.editReply({ embeds: [chessEmbed], files: [attachment] })
		}
		else if (subCommand == 'resign') {
			interaction.editReply("Are you sure you want to resign from your current chess match? (y/n)")
			const filter = m => (["y", "n"].includes(m.content.toLowerCase()) && m.author.id === interaction.user.id);
			const collectorResign = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			collectorResign.on('collect', m => {
				if (m.content.toLowerCase() == 'y') {
					interaction.followUp("Okay then, deleting board...");
					gameID = games[interaction.guild.id].players[interaction.user.id]
					games[interaction.guild.id].players[interaction.user.id] = ""
					if (!(games[interaction.guild.id].games[gameID].botPlaying))
						for (i in games[interaction.guild.id].players)
							if (games[interaction.guild.id].players[i] == gameID)
								games[interaction.guild.id].players[i] = ""
					// delete games[message.author.id]
					fs.writeFileSync('./lib/database/misc/games/chess/chess_games.json', JSON.stringify(games, null, 2));
					interaction.followUp("Board deleted successfully")
				}
				if (m.content.toLowerCase() == 'n')
					interaction.followUp('Alr then')
			})
		}
		else if (subCommand == 'help') {
			let chessEmbed = new EmbedBuilder()
				.setTitle('Chess Commands')
				.setDescription('`chess start`: Start a new game\n`chess move`: Moves a chess piece\n`chess board`: Shows your current chessboard\n`chess resign`: Resigns from your current game\n`chess help`: Shows this list')
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return await interaction.editReply({ embeds: [chessEmbed] })
		}
	},
};

