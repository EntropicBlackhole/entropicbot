const jsChessEngine = require('js-chess-engine')
const config = require('./lib/database/bot/config.json');
const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.DirectMessages
	]
});
const commands = [];
const commandsPath = path.join(__dirname, './lib/database/bot/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();

// Deploying commands 
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}
const rest = new Discord.REST({ version: '10' }).setToken(config.token);
rest.put(Discord.Routes.applicationCommands(config.clientId), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

//Deployed all commands

client.once("ready", () => {
	console.log(client.user.tag + " is online!");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(config.token);
// ==================
const pieces = {
	'k': '\u265A',
	'q': '\u265B',
	'r': '\u265C',
	'b': '\u265D',
	'n': '\u265E',
	'p': '\u2659',
	'K': '\u2654',
	'Q': '\u2655',
	'R': '\u2656',
	'B': '\u2657',
	'N': '\u2658',
	'P': '\u2659'
}

client.on("messageCreate", (message) => {
	var serverConfig = JSON.parse(fs.readFileSync("./lib/database/servers/config/servers_config.json"))

	if (!([null, undefined, {}].includes(serverConfig[message.guild.id]))) {
		if (serverConfig[message.guild.id].verification.verificationChannel == message.channel.id) {
			if (message.content.includes(serverConfig[message.guild.id].verification.verificationCode) && !message.author.bot) {
				role = message.guild.roles.cache.find(role => role.id === serverConfig[message.guild.id].verification.verificationRole);
				message.member.roles.add(role);
				message.channel.send(serverConfig[message.guild.id].verification.verifiedMessage).then(msg => setTimeout(() => msg.delete(), 2000)).then(setTimeout(() => message.delete(), 2000))
			}
			else if (!(message.content.includes(serverConfig[message.guild.id].verification.verificationCode)) && !message.author.bot) return message.channel.send(serverConfig[message.guild.id].verification.nonVerifiedMessage).then(msg => setTimeout(() => msg.delete(), 2000)).then(setTimeout(() => message.delete(), 2000))
		}
	}

	if (message.author.bot || !message.content.startsWith(conprefix)) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command == 'ping') {
		message.channel.send('Pong!');
	}
	else if (command == 'chess') {
		const games = JSON.parse(fs.readFileSync("./lib/database/games/chess/chess_games.json"))
		if (args.length < 1 || args[0] == 'help') {
			const chessEmbed = new EmbedBuilder()
				.setTitle('Chess Commands')
				.setDescription('`chess start`: Start a new game\n`chess move`: Moves a chess piece\n`chess board`: Shows your current chessboard\n`chess resign`: Resigns from your current game')
				.setColor(randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return message.channel.send({ content: "Please mention one of these subcommands!!", embeds: [chessEmbed] })
		}
		const command = args.shift().toLowerCase();
		if (command == 'start') {
			const games = JSON.parse(fs.readFileSync("./lib/database/games/chess/chess_games.json"))
			if (games[message.author.id]) return message.channel.send('You already are in a match! If you want to start a new game, do ' + prefix + 'chess resign to end your current game!');
			if (!(message.mentions.users.first())) return message.channel.send("Mention someone (or me) to play against!")
			if (message.mentions.users.first().bot && message.mentions.users.first() != client.user) return message.channel.send("You can't play chess against a bot (unless its me) you dumbass")

			if (message.mentions.users.first() == client.user) {
				var difficultyNames = {
					"0": "Bwaby Mwode",
					"1": "Gently Easy",
					"2": "Intermediate",
					"3": "Hard as fuck",
					"4": "AI Overlords"
				}

				var aiTableImage = new AttachmentBuilder("./lib/assets/images/aiLevelTable.png")
				message.channel.send({ content: "What AI level would you like to play against?", files: [aiTableImage] })
				const filter = m => ((m.content.match(/[0-4]/)) && m.author.id === message.author.id);
				const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

				collector.on('collect', m => {
					const level = m.content
					message.channel.send(`${level}: ${difficultyNames[level]} it is! What color do you wanna be? (white/black/random)`);
					const filter = m => (["white", "black", "random"].includes(m.content.toLowerCase()) && m.author.id === message.author.id);
					const collector2 = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

					collector2.on('collect', m => {
						let color = m.content.toLowerCase();
						if (color === 'random') color = (Math.floor(Math.random() * 2) + 1 == 1) ? 'white' : 'black';
						message.channel.send(`Okay then! Let's play! Your color is ${color}! (${prefix}chess move <from> <to>)`)
						const game = new jsChessEngine.Game()
						var chessRound = {
							boardConfig: game.exportJson(),
							white: (color == 'white') ? message.author.id : client.user.id,
							black: (color == 'black') ? message.author.id : client.user.id,
							turn: (color == 'white') ? message.author.id : client.user.id,
							botPlaying: true,
							AILevel: parseInt(level)
						}
						var games = JSON.parse(fs.readFileSync("./lib/database/games/chess/chess_games.json"))
						games[message.author.id] = chessRound
						fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2))
						if (color == 'black') {
							message.channel.send("I'm starting!")
							// boardNew = drawBoard(JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json', 'utf8'))[message.author.id].boardConfig)
							// var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
							// message.channel.send({ files: [attachment] })

							var aiMoves = game.aiMove(level)
							games[message.author.id].boardConfig = game.exportJson();
							fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2))

							var games = JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json'))
							if (games[message.author.id].white == games[message.author.id].turn)
								games[message.author.id].turn = games[message.author.id].black
							else if (games[message.author.id].black == games[message.author.id].turn)
								games[message.author.id].turn = games[message.author.id].white
							fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2))
							boardNew = drawBoard(JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json', 'utf8'))[message.author.id].boardConfig)
							var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
							message.channel.send(`I'll move from ${Object.keys(aiMoves)} to ${Object.values(aiMoves)}`)
							return message.channel.send({ content: `Your turn! (${prefix}chess move <from> <to>)`, files: [attachment] })

						}
						else if (color == 'white') {
							boardNew = drawBoard(JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json', 'utf8'))[message.author.id].boardConfig)
							var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
							return message.channel.send({ content: "You're starting! You're white!", files: [attachment] })
						}
					})
				})
			}
			else {
				message.channel.send("No play with someone else yet")
			}
		}
		else if (command == 'move') {
			const games = JSON.parse(fs.readFileSync("./lib/database/games/chess/chess_games.json"))
			if (!(games[message.author.id])) return message.channel.send('You aren\'t in a match! Do ' + prefix + 'chess start <user/me>');
			if (!(games[message.author.id].turn == message.author.id)) return message.channel.send('It is not your turn dumbass, wait until it\'s your turn k?')
			if (!args[0]) return message.channel.send("Please enter a <from> parameter")
			if (!args[1]) return message.channel.send("Please enter a <to> parameter")
			if (!(args[0].match(/[a-h][1-8]/))) return message.channel.send("<from> space is invalid, please enter a valid space. i.e. E4")
			if (!(args[1].match(/[a-h][1-8]/))) return message.channel.send("<to> space is invalid, please enter a valid space. i.e. E4")
			var from = args[0];
			var to = args[1];

			const game = new jsChessEngine.Game(games[message.author.id].boardConfig)
			try {
				game.move(from, to);
			} catch (e) {
				return message.channel.send(e.message);
			}
			games[message.author.id].boardConfig = game.exportJson();
			if (games[message.author.id].white == games[message.author.id].turn)
				games[message.author.id].turn = games[message.author.id].black
			else if (games[message.author.id].black == games[message.author.id].turn)
				games[message.author.id].turn = games[message.author.id].white
			fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2))
			boardNew = drawBoard(JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json', 'utf8'))[message.author.id].boardConfig)
			var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
			if (game.exportJson().isFinished) {
				var winner = games[message.author.id][((game.exportJson().turn == 'white') ? 'black' : 'white')]
				var loser = games[message.author.id][((game.exportJson().turn == 'black') ? 'black' : 'white')]
				delete games[message.author.id]
				fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2));
				if (winner == client.user.id) return message.channel.send({ content: 'Ha I won, don\'t be a sore loser k?/j', files: [attachment] })
				else if (loser == client.user.id) return message.channel.send({ content: 'You won. Eh, anyways this round was for fun right everyone?', files: [attachment] })
				else return message.channel.send({ content: `<@${winner}> won with <@${loser}> losing! Good job! <@${winner}>`, files: [attachment] })
			}
			message.channel.send({ content: `You've moved from ${from.toUpperCase()} to ${to.toUpperCase()}! ${(games[message.author.id].botPlaying) ? 'Now it\'s my turn!' : ''}`, files: [attachment] })
			if (games[message.author.id].botPlaying) {
				var AIMoved = game.aiMove(JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json', 'utf8')).AILevel);
				games[message.author.id].boardConfig = game.exportJson()
				if (games[message.author.id].white == games[message.author.id].turn)
					games[message.author.id].turn = games[message.author.id].black
				else if (games[message.author.id].black == games[message.author.id].turn)
					games[message.author.id].turn = games[message.author.id].white
				fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2))
				boardNew = drawBoard(JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json', 'utf8'))[message.author.id].boardConfig)
				var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
				if (game.exportJson().isFinished) {
					var winner = games[message.author.id][((game.exportJson().turn == 'white') ? 'black' : 'white')]
					var loser = games[message.author.id][((game.exportJson().turn == 'black') ? 'black' : 'white')]
					delete games[message.author.id]
					fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2));
					if (winner == client.user.id) return message.channel.send({ content: 'Ha I won, don\'t be a sore loser k?/j', files: [attachment] })
					else if (loser == client.user.id) return message.channel.send({ content: 'You won. Eh, anyways this round was for fun right everyone?', files: [attachment] })
					else return message.channel.send({ content: `<@${winner}> won with <@${loser}> losing! Good job! <@${winner}>`, files: [attachment] })
				}
				return message.channel.send({ content: `I'll move from ${Object.keys(AIMoved)} to ${Object.values(AIMoved)}! It's your turn now! (${prefix}chess move <from> <to>)`, files: [attachment] })
			}
			else return message.channel.send(`<@${games[message.author.id].turn}> it's your turn!!`)
		}
		else if (command == 'board') {
			const games = JSON.parse(fs.readFileSync("./lib/database/games/chess/chess_games.json"))
			if (!(games[message.author.id])) return message.channel.send('You aren\'t in a match! Do ' + prefix + 'chess start <user/me>');
			boardNew = drawBoard(JSON.parse(fs.readFileSync('./lib/database/games/chess/chess_games.json', 'utf8'))[message.author.id].boardConfig)
			var attachment = new AttachmentBuilder(boardNew[0].toBuffer('image/png'));
			return message.channel.send({ files: [attachment] })
		}
		else if (command == 'resign') {
			const games = JSON.parse(fs.readFileSync("./lib/database/games/chess/chess_games.json"))
			message.channel.send("Are you sure you want to resign from your current Chess match? (y/n)")
			const filter = m => (["y", "n"].includes(m.content.toLowerCase()) && m.author.id === message.author.id);
			const collectorResign = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			collectorResign.on('collect', m => {
				if (m.content.toLowerCase() == 'y') {
					message.channel.send("Okay then, deleting board...");
					delete games[message.author.id]
					fs.writeFileSync('./lib/database/games/chess/chess_games.json', JSON.stringify(games, null, 2));
					message.channel.send("Board deleted successfully")
				}
				if (m.content.toLowerCase() == 'n')
					message.channel.send("Alr")
			})
		}
		else return message.channel.send(`\`${command}\` is not a valid subcommand, do ${prefix}chess help to see the list of subcommands`)
	}
	else if (command == 'math') {
		let math = args.join(" ")
		try {
			return message.channel.send(eval(math).toString())
		} catch (e) {
			return message.channel.send("Invalid math expression")
		}
	}
	else if (command == 'trivia') {
		if (args.length == 0) return message.channel.send("Please specify an amount of questions to ask!")
		if (isNaN(args[0])) return message.channel.send("Please enter a number between 1 and 10");
		return message.channel.send("Command not implemented yet")
	}
	else if (command == 'tictactoe' || command == 'ttt') {
		const games = JSON.parse(fs.readFileSync("./lib/database/games/chess/chess_games.json"))
		if (args.length < 1 || args[0] == 'help') {
			const tttEmbed = new EmbedBuilder()
				.setTitle('TicTacToe Commands')
				.setDescription('`start`: Start a new game\n`place`: Moves a chess piece\n`board`: Shows your current board\n`resign`: Resigns from your current match')
				.setColor(randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return message.channel.send({ content: "Please mention one of these subcommands!!", embeds: [tttEmbed] })
		}
		const subcommand = args.shift().toLowerCase();
		if (subcommand == 'start') {
			// const games = JSON.parse(fs.readFileSync("./lib/database/games/ttt/tictactoe_games.json"))
			// if (games[message.author.id]) return message.channel.send('You already are in a match! If you want to start a new game, do ' + prefix + 'tictactoe (or ttt) resign to end your current game!');
			// if (!(message.mentions.users.first())) return message.channel.send("Mention someone (or me) to play against!")
			// if (message.mentions.users.first().bot && message.mentions.users.first() != client.user) return message.channel.send("You can't play chess against a bot (unless its me) you dumbass")
		}
	}
	else if (command == 'botpos') {
		const reminders = JSON.parse(fs.readFileSync("./lib/database/reminders/botpos.json"))
		if (args.length < 1 || args[0] == 'help') {
			const botposEmbed = new EmbedBuilder()
				.setTitle('BotPos Commands')
				.setDescription('`botpos set`: Sets a reminder/message \n`botpos heart <id>`: Hearts a message to give it priority\n`botpos list`: Shows the list of your messages showing their ID\n`botpos edit <id>`: Edits one of your messages\n`botpos delete <id>`: Deletes one of your messages\n`botpos settings <setting>`: You can edit one of these settings which is `priority` or `interval`, `priority` being the priority of hearted reminders, and `interval` being the interval that I\'ll give you these messages')
				.setColor(randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return message.channel.send({ content: "Please mention one of these subcommands!!", embeds: [botposEmbed] })
		}
		const command = args.shift().toLowerCase();
		if (command == 'set') {
			if (args.length < 1) return message.channel.send("Please specify a reminder/message you wanna set")
			var newID = (reminders.main[message.author.id]) ? (Object.keys(reminders.main[message.author.id]).length) + 1 : 1;
			if (!((reminders.main[message.author.id]))) {
				reminders.main[message.author.id] = {};
				reminders.config[message.author.id] = {
					interval: 3600000,
					priority: 5
				};
			}
			reminders.main[message.author.id]['#' + newID.toString()] = {
				message: args.join(" "),
				hearted: false
			}
			fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
			return message.channel.send(`Set your message to \`${args.join(" ")}\` with the ID as \`#${newID}\` (Say \`${prefix}botpos list\` to show a list of your messages)`)
		}
		else if (command == 'list') {
			var description = "";
			for (i in reminders.main[message.author.id]) {
				var item = reminders.main[message.author.id][i]
				description += `${i}: \nMessage: \`${item.message}\`\nHearted: \`${item.hearted}\`\n\n`
			}
			const listBotposEmbed = new EmbedBuilder()
				.setTitle('List of messages')
				.setDescription(description)
				.setColor(randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			message.channel.send({ embeds: [listBotposEmbed] });
		}
		else if (command == 'edit') {
			if (args.length < 1) return message.channel.send("Please provide an ID, i.e. `#3`")
			if (!(args[0].match(/#[\d]/))) return message.channel.send("This is not a valid ID number, please input a valid ID number, i.e. #3 (you can check each message's ID number with " + prefix + "botpos list)")
			if (reminders.main[message.author.id][args[0]] == undefined) return message.channel.send("Please provide an existing ID, i.e. #1")
			var item = reminders.main[message.author.id][args[0]]
			message.channel.send(`Message: \`${item.message}\`\nHearted: \`${item.hearted}\`\n\nWhat would you like to edit? (message/heart)`)
			var filter = m => (["message", "heart"].includes(m.content.toLowerCase()) && m.author.id === message.author.id);
			let editCollect = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			editCollect.on('collect', m => {
				if (m.content.toLowerCase() == 'message') {
					message.channel.send("Okay, what would you like to edit the message to?");
					var filter = m => (m.author.id === message.author.id);
					let editCollectMessage = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

					editCollectMessage.on('collect', m => {
						reminders.main[message.author.id][args[0]].message = m.content;
						fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
						return message.channel.send(`Edited message to \`${m.content}\``)
					})
				}
				else if (m.content.toLowerCase() == 'heart') {
					message.channel.send("Do you want to set it to true or false?")
					var filter = m => (['true', 'false'].includes(m.content.toLowerCase()))
					let editCollectHeart = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

					editCollectHeart.on('collect', m => {
						reminders.main[message.author.id][args[0]].hearted = (m.content.toLowerCase() == 'true') ? true : false;
						fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
						return message.channel.send(`Set message's heart state to ${m.content}`)
					})
				}
			})
		}
		else if (command == 'delete') {
			if (args.length < 1) return message.channel.send("Please provide an ID, i.e. `#3`")
			if (!(args[0].match(/#[\d]+/))) return message.channel.send("This is not a valid ID number, please input a valid ID number, i.e. #3 (you can check each message's ID number with " + prefix + "botpos list)")
			if (reminders.main[message.author.id][args[0]] == undefined) return message.channel.send("Please provide an existing ID, i.e. #1")

			message.channel.send("Are you sure you want to delete this reminder? (y/n)")
			var filter = m => (["y", "n"].includes(m.content.toLowerCase()) && m.author.id === message.author.id);
			let deleteCollect = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			deleteCollect.on('collect', m => {
				if (m.content.toLowerCase() == 'y') {
					message.channel.send('Deleting message...')
					delete reminders.main[message.author.id][args[0]]
					fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
					return message.channel.send('Reminder deleted successfully!')
				}
				else if (m.content.toLowerCase() == 'n') {
					return message.channel.send('Alr then')
				}
			})
		}
		else if (command == 'settings') {
			if (args.length < 1) return message.channel.send("Please provide an setting, either `priority` or `interval`")
			if (!(['priority', 'interval'].includes(args[0]))) return message.channel.send("Please mention an actual setting, either `priority` or `interval`")
		}
		else return message.channel.send("This is not a valid subcommand")
	}
	else if (command == 'serverset') {
		const serverConfig = JSON.parse(fs.readFileSync("./lib/database/servers/config/servers_config.json"))
		if (args.length < 1 || args[0] == 'help') {
			const serverConfigEmbed = new EmbedBuilder()
				.setTitle('General Server Commands')
				.setDescription('`serverset verify`: Allows for verification when someone joins a server, set a channel, role, and other stuff when someone verifies')
				.setColor(randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return message.channel.send({ content: "Please mention one of these subcommands!!", embeds: [chessEmbed] })
		}
		const command = args.shift().toLowerCase();
		if (command == 'verify') {
			message.channel.send("Okay! You'll need a verification code, a channel where people will verify, a role to place when verified, a message to display if it's correct, and a message to display when its incorrect, do you have all of these? (y/n)")
			let filter = m => (["y", "n"].includes(m.content.toLowerCase()) && m.author.id === message.author.id);
			var collectVerify = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			collectVerify.on('collect', m => {
				if (m.content.toLowerCase() == 'n') return message.channel.send("Have these ready then, and redo the command!")
				else if (m.content.toLowerCase() == 'y') {
					message.channel.send("Alright then, what will the code be?")
					let filter = m => (m.author.id === message.author.id)
					var collectVerifyCode = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

					collectVerifyCode.on('collect', m => {
						const verifCode = m.content
						message.channel.send("Great, now mention a channel for it!")
						let filter = m => (m.author.id === message.author.id)
						var collectVerifyChannel = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

						collectVerifyChannel.on('collect', m => {
							const verifChannel = subStrBetweenChar(m.mentions.channels.first().toString(), '#', '>')
							message.channel.send("Mention a role to place on the verified user!")
							let filter = m => (m.author.id === message.author.id)
							var collectVerifyRole = message.channel.createMessageCollector({ filter, max: 1, time: 30000 })

							collectVerifyRole.on('collect', m => {
								const verifRole = subStrBetweenChar(m.content, '@&', '>')
								message.channel.send("Now a message to say when the code they send is correct!")
								let filter = m => (m.author.id === message.author.id)
								var collectVerifyMessage = message.channel.createMessageCollector({ filter, max: 1, time: 120000 })

								collectVerifyMessage.on('collect', m => {
									const verifMessage = m.content
									message.channel.send("Last one! Now place a message to say when the code they send is incorrect!")
									let filter = m => (m.author.id === message.author.id)
									var collectVerifyNonMessage = message.channel.createMessageCollector({ filter, max: 1, time: 120000 })

									collectVerifyNonMessage.on('collect', m => {
										const verifNonMessage = m.content
										message.channel.send("Great! Now creating a new verification system, hold on..")
										console.log("start", Date.now())
										setTimeout(() => { }, 5000)
										console.log("end", Date.now())
										serverConfig[message.guild.id] = {
											verification: {
												verificationCode: verifCode,
												verificationChannel: verifChannel,
												verificationRole: verifRole,
												verifiedMessage: verifMessage,
												nonVerifiedMessage: verifNonMessage
											}
										}
										fs.writeFileSync('./lib/database/servers/config/servers_config.json', JSON.stringify(serverConfig, null, 2));
										message.channel.send("Set your verification system up!")
									})
								})
							})
						})
					});
				}
			});
		}
	}
	/*
	else if (command == 'scan') {
		if (message.attachments.size < 1) return message.channel.send("Please send an attachment to scan");
		if (args.length < 1) return message.channel.send("Please specify all the names of the colors separated by |, i.e. \"DARK GREEN|LIGHT BLUE|RED\"")
		let canvas = Canvas.createCanvas(940, 788);
		let ctx = canvas.getContext('2d');
	 
		if (message.attachments.every(attachIsImage)) {
			colors = [];
			Canvas.loadImage(message.attachments.first().url).then((image) => {
				ctx.drawImage(image, 0, 0, 940, 788)
				var x = 20;
				var y = 20;
				for (let i = 0; i < 5; i++) {
					for (let j = 0; j < 4; j++) {
						var rgb = ctx.getImageData(x, y, 1, 1).data;
						var hex = rgbToHex(rgb[0], rgb[1], rgb[2])
						colors.push(hex)
						x += 235
					}
					x = 20;
					y += 135;
				}
				var a = 0;
				var colorNames = args.join(" ").split("|")
				if (colorNames.length != colors.length) return message.channel.send("Amount of names isn't equal to the amount of colors")
				for (i of colors) {
					message.guild.roles.create({ name: colorNames[a], color: i });
					a++;
				}
				return message.channel.send("Color roles created!!")
	var attachment = new AttachmentBuilder(canvas.toBuffer('image/png'));
				return message.channel.send(colors.join(' '))
				return message.channel.send({ content: "test", files: [attachment] })
			})
		}
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('color-roles')
					.setLabel('Scan colors')
					.setStyle(ButtonStyle.Primary),
			);
		message.channel.send({ content: "What do you want to scan?", components: [row] });
	}
	*/
	// else if (command == 'makerole') {
	// if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.channel.send("Sorry but you don't have the permission to use this command yknow?")

	// const row = new ActionRowBuilder()
	// 	.addComponents(
	// 		new ButtonBuilder()
	// 			.setCustomId('test-button')
	// 			.setLabel('Click me!')
	// 			.setStyle(ButtonStyle.Primary),
	// 	);
	// // console.log("a")
	// message.channel.send({ content: "I think you should", components: [row]})
	// return message.guild.roles.create({ name: "", color: '' });
	// }
	else if (command == 'kill') return message.channel.send("Committing sewer slide").then(() => process.exit());
})


client.on("guildMemberAdd", (member) => {
	let channel = member.guild.channels.cache;
	let embed = new EmbedBuilder()
		.setThumbnail(member.guild.iconURL())
		.addField(`Welcome!`, `Hello, welcome to ${member.guild.name} <@${member.user.id}>!`, true)
		.addField(`Guild Statistics`, `Server member count: ${member.guild.memberCount}`, true)
		.setColor(randomColor())
		.setImage(member.avatarURL());
	channel
		.find((channel) => channel.id === '1023008971042340908')
		.send({ embeds: [embed] });
});

function exportBoard(configuration, context) {
	context.fillStyle = '#000000';
	context.font = '30px Arial';
	var piecesConfig = configuration.pieces;
	const pieces = {
		'k': '\u265A',
		'q': '\u265B',
		'r': '\u265C',
		'b': '\u265D',
		'n': '\u265E',
		'p': '\u2659',
		'K': '\u2654',
		'Q': '\u2655',
		'R': '\u2656',
		'B': '\u2657',
		'N': '\u2658',
		'P': '\u2659'
	}
	var columns = {
		'A': 0,
		'B': 30,
		'C': 60,
		'D': 90,
		'E': 120,
		'F': 150,
		'G': 180,
		'H': 210
	}
	var rows = {
		'8': 30,
		'7': 60,
		'6': 90,
		'5': 120,
		'4': 150,
		'3': 180,
		'2': 210,
		'1': 240
	}

	for (i in piecesConfig) {
		var piece = piecesConfig[i]
		var letter = i.substr(0, 1)
		var number = i.substr(1, 1)
		if (piece === 'p') context.strokeText(pieces[piece], columns[letter], rows[number])
		else context.fillText(pieces[piece], columns[letter], rows[number])
	}
	return context
}
function drawBoard(configuration) {
	let canvas = Canvas.createCanvas(240, 240);
	let context = canvas.getContext('2d');

	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			if ((i + j) % 2 == 0) {
				context.fillStyle = '#e0e0e0';
			} else {
				context.fillStyle = '#909090';
			}
			context.fillRect(i * 30, j * 30, 30, 30);
		}
	}
	context = exportBoard(configuration, context)
	context.font = '12px Arial';
	context.fillText('8', 2, 10)
	context.fillText('7', 2, 40)
	context.fillText('6', 2, 70)
	context.fillText('5', 2, 100)
	context.fillText('4', 2, 130)
	context.fillText('3', 2, 160)
	context.fillText('2', 2, 190)
	context.fillText('1', 2, 220)
	context.fillText('A', 20, 238)
	context.fillText('B', 50, 238)
	context.fillText('C', 80, 238)
	context.fillText('D', 110, 238)
	context.fillText('E', 140, 238)
	context.fillText('F', 170, 238)
	context.fillText('G', 200, 238)
	context.fillText('H', 230, 238)
	return [canvas, context]
}
function randomColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
function attachIsImage(msgAttach) {
	var url = msgAttach.url;
	//True if this url is a png image.
	return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
}
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function subStrBetweenChar(string, start, end) {
	return string.split(start)[1].split(end)[0]
}