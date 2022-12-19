const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const queswers = require('../../misc/trivia/queswers.json')
const fs = require('fs')
module.exports = {
	name: "Trivia",
	description: "Asks trivia questions in a channel! Useful for trivia night and for active members! Source: https://ponly.com/trivia-questions/ (After starting, it'll ping a role to call players, and after a couple minutes it'll start",
	usage: "start <role> <announce-channel> <play-channel> <amt?> <difficulty?> <time?>, end",
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Trivia night time!!')
		.addSubcommand(subcommand => subcommand
			.setName('start')
			.setDescription('Start a trivia night! Someone is coming out winning today!')
			.addRoleOption(option => option
				.setName('role')
				.setDescription('Role to ping for announcing a trivia night, and to also call those users with the role to play')
				.setRequired(true))
			.addChannelOption(option => option
				.setName('announce-channel')
				.setDescription('Channel to announce the trivia night happening')
				.setRequired(true))
			.addChannelOption(option => option
				.setName('play-channel')
				.setDescription('Channel to play the trivia event in')
				.setRequired(true))
			.addIntegerOption(option => option
				.setName('amt')
				.setDescription('Amount of questions per player (Min 1, Max 10)')
				.setMinValue(1)
				.setMaxValue(10))
			.addStringOption(option => option
				.setName('difficulty')
				.setDescription('How hard should the questions be?')
				.setChoices(
					{ name: 'Easy', value: 'easy' },
					{ name: 'Intermediate', value: 'intermediate' },
					{ name: 'Difficult', value: 'difficult' }
				))
			.addIntegerOption(option => option
				.setName('time')
				.setDescription('Time to wait after initial call')
				.setMaxValue(15)
				.setMinValue(1)))
		.addSubcommand(subcommand => subcommand
			.setName('answer')
			.setDescription('Answer the current question!')
			.addStringOption(option => option
				.setName('choice')
				.setDescription('Which one is the correct answer? (There can be multiple)')
				.setChoices(
					{ name: 'A', value: 'a' },
					{ name: 'B', value: 'b' },
					{ name: 'C', value: 'c' },
					{ name: 'D', value: 'd' }
				)
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('end')
			.setDescription('Ends tonight\'s trivia match abruptly, such a party pooper')),
	async execute(interaction, client) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEvents)) return interaction.reply("You don't have the permission to manage trivia events, please contact a moderator to start a trivia night, or someone with the Manage Events permission")
		await interaction.deferReply();
		const subcommand = interaction.options.getSubcommand();
		if (subcommand == 'start') {
			let role = interaction.options.getRole('role'); 
			let announceChannel = interaction.options.getChannel('announce-channel');
			let playChannel = interaction.options.getChannel('play-channel');
			let amt = interaction.options.getInteger('amt') ? interaction.options.getInteger('amt') : 3;
			let difficulty = interaction.options.getString('difficulty') ? interaction.options.getString('difficulty') : "intermediate";
			let time = interaction.options.getInteger('time') ? interaction.options.getInteger('time') : 5;
			interaction.editReply('Successfully started!')
			client.channels.cache.get(announceChannel.id).send(`Hello there guys, gals and non binary pals!\nA trivia night for ${role} is starting in ${time} minute${time > 1 ? 's' : ''}!\nThere will be ${amt} questions on the ${difficulty} difficulty!\nReact below if you wanna play tonight's trivia event in ${playChannel}!`)
				.then(async message => {
					await message.react('✔️');

					const filter = (reaction, user) => {
						return reaction.emoji.name === '✔️';
					};

					const collector = message.createReactionCollector({ filter, max: 30, time: time * 1000 }); // Don't forget to put * 60 here
					let players = new Set()
					collector.on('collect', (reaction, user) => {
						players.add(user.id)
					});

					collector.on('end', collected => {
						players.delete(client.user.id)
						//!DO NOT TOUCH YET, HAVE TO DO SOME BREAK DOWN OF HOW THIS WORKS
						for (let i = 0; i < amt*players.length; i++) {
							//Getting a random number for the question
							let randomItem = Math.floor(Math.random() * queswers[difficulty].length)
							//Getting the question
							let ques = queswers[difficulty][randomItem]
						}
						//Getting a random number for the question
						let randomItem = Math.floor(Math.random() * queswers[difficulty].length)
						//Getting the question
						let ques = queswers[difficulty][randomItem]
						//Shuffling the object
						let temp = [];
						newQues = {};
						for (i in ques.answers) temp.push(i)
						temp.sort(() => Math.random() - 0.5);
						for (i of temp) newQues[i] = ques.answers[i];
						ques = newQues;
						let triviaEvent = {
							amt: amt,
							players: players,
							difficulty: difficulty,
							points: {},
							startTime: Date.now(),
							isFinished: false,
							winner: "",
							playChannel: playChannel.id,
							announceChannel: announceChannel.id
						}
						const triviaEvents = JSON.parse(fs.readFileSync('./lib/database/misc/trivia/trivia_events.json'))
						triviaEvents[interaction.guild.id] = {
							events: {
								"1": triviaEvent
							},
							amount_of_games: 1,
							currentEvent: triviaEvent
						}
						fs.writeFileSync('./lib/database/misc/trivia/trivia_events.json', JSON.stringify(triviaEvents, null, 2))
						temp = '';
						for (i of players) temp += i + ', ' 
						client.channels.cache.get(playChannel.id).send(`Ladies and gents and non binary tents, there's a trivia event happening! ${temp} get ready for a series of questions, you each get two minutes to respond, and your points are determined by how long you took, multiplied by either 3, 5, or 10 depending on difficulty`)
						

						client.channels.cache.get(playChannel.id).send()
					});
					
				})



		}
		if (subcommand == 'end') {
		}
	},
};


/*
TODO:
! ADD THE * 60 IN THE TIMER
* Grab a random player from the set
* Load an amount of questions
* -Shuffle the object
* -Make a new object, assign keys A-D through it
* -And place the answers with their value in there
* Ask them one by one each question
* Make sure all questions are different
* Finish the end and answer commands
? Refactor 
*/
