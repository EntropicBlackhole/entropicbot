const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const functions = require('../functions')
const fs = require('node:fs')

module.exports = {
	name: "Botpos",
	description: "Positivity command! You can set reminders and I will DM you a random reminder! (This is used for positive messages, like sending you a positive message)",
	usage: "[add, delete <id>, list, edit <id>, settings[interval, priority]]",
	data: new SlashCommandBuilder()
		.setName('botpos')
		.setDescription('Positive reminders!')
		.addSubcommand(subcommand => subcommand
			.setName('add')
			.setDescription('Adds a reminder!')
			.addStringOption(stringOption => stringOption
				.setName('reminder')
				.setDescription('Write the reminder here')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('heart')
			.setDescription('Hearts a message!')
			.addNumberOption(numberOption => numberOption
				.setName('id')
				.setDescription('ID of the reminder to delete')
				.setRequired(true))
			.addBooleanOption(booleanOption => booleanOption
				.setName('hearted')
				.setDescription('True is to heart it, False is to unheart it')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('delete')
			.setDescription('Deletes a reminder given an ID!')
			.addNumberOption(numberOption => numberOption
				.setName('id')
				.setDescription('ID of the reminder to delete')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('list')
			.setDescription('Shows you the list of reminders!'))
		.addSubcommand(subcommand => subcommand
			.setName('edit')
			.setDescription('Edits a reminder!')
			.addNumberOption(numberOption => numberOption
				.setName('id')
				.setDescription('ID of the reminder to edit')
				.setRequired(true))
			.addStringOption(stringOption => stringOption
				.setName('new-message')
				.setDescription('Place here the new message you want to edit it to')
				.setRequired(true)))
		.addSubcommandGroup(subcommandGroup => subcommandGroup
			.setName('settings')
			.setDescription('Settings for your reminders!')
			.addSubcommand(subcommand => subcommand
				.setName('interval')
				.setDescription('The interval of how frequent you will be reminded! (Min 1 hour, Max 1 week (168 hours))')
				.addNumberOption(numberOption => numberOption
					.setName('interval')
					.setDescription('New interval for your reminders (Min 1 hour, Max 1 week (168 hours))')
					.setMaxValue(168)
					.setMinValue(1)
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('priority')
				.setDescription('Sets the priority of hearted messages')
				.addNumberOption(numberOption => numberOption
					.setName('priority')
					.setDescription('New priority for hearted messages (Min 1, Max 10)')
					.setMaxValue(10)
					.setMinValue(1)
					.setRequired(true))))
			.addSubcommand(subcommand => subcommand
				.setName('help')
				.setDescription('Shows a list of what Botpos can do')),
	async execute(interaction, client) {
		await interaction.deferReply();
		let subCommand = interaction.options.getSubcommand();
		let subCommandGroup = interaction.options.getSubcommandGroup()
		const reminders = JSON.parse(fs.readFileSync("./lib/database/reminders/botpos.json"))
		if (reminders[interaction.user.id] == undefined) {
			reminders[interaction.user.id] = {
				reminders: {},
				config: {
					interval: 2,
					priority: 5
				}
			}
			fs.writeFileSync("./lib/database/reminders/botpos.json", JSON.stringify(reminders, null, 2));
		}
		if (subCommand == 'add') {
			let message = interaction.options.getString('reminder');
			var newID = Object.keys(reminders[interaction.user.id].reminders).length + 1
			reminders[interaction.user.id].reminders[newID.toString()] = {
				message: message,
				hearted: false
			}
			fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
			return interaction.editReply(`Set your message to \`${message}\` with the ID as \`#${newID}\` (Write \`botpos list\` to show a list of your messages)`)
		}
		else if (subCommand == 'heart') {
			let hearted = interaction.options.getBoolean('hearted')
			let id = interaction.options.getNumber('id');
			if (reminders[interaction.user.id].reminders[id] == undefined) return interaction.editReply("Please provide an existing ID, i.e. `1`")
			reminders[interaction.user.id].reminders[id].hearted = hearted
			fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
			return interaction.editReply(`${hearted ? 'Hearted' : 'Unhearted'} the message successfully!`)
		}
		else if (subCommand == 'list') {
			const listBotposEmbed = new EmbedBuilder()
				.setTitle('List of messages')
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			for (i in reminders[interaction.user.id].reminders) {
				var item = reminders[interaction.user.id].reminders[i]
				listBotposEmbed.addFields({ name: i, value: `Message: \`${item.message}\`\nHearted: \`${item.hearted}\``})
			}
			return interaction.editReply({ embeds: [listBotposEmbed] });
		}
		else if (subCommand == 'edit') {
			let id = interaction.options.getNumber('id');
			let newMessage = interaction.options.getString('new-message')
			if (reminders[interaction.user.id].reminders[id] == undefined) return interaction.editReply("Please provide an existing ID, i.e. `1`")
			reminders[interaction.user.id].reminders[id].message = newMessage;
			fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
			return interaction.editReply(`Edited message to \`${newMessage}\``) 
		}
		else if (subCommand == 'delete') {
			let id = interaction.options.getNumber('id');
			if (reminders[interaction.user.id].reminders[id] == undefined) return interaction.editReply("Please provide an existing ID, i.e. `1`")
			delete reminders[interaction.user.id].reminders[id]
			reminders[interaction.user.id].reminders = functions.correctIDs(reminders[interaction.user.id].reminders)
			fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
			return interaction.editReply('Reminder deleted successfully!')
		}
		else if (subCommandGroup == 'settings') {
			let newData = interaction.options.getNumber(subCommand);
			reminders[interaction.user.id].config[subCommand] = newData;
			fs.writeFileSync('./lib/database/reminders/botpos.json', JSON.stringify(reminders, null, 2));
			return interaction.editReply('Reminder updated successfully!')
		}
		else if (subCommand == 'help') {
			const botposEmbed = new EmbedBuilder()
				.setTitle('BotPos Commands')
				.setDescription('`botpos add`: Sets a reminder/message \n`botpos heart <id>`: Hearts a message to give it priority\n`botpos list`: Shows the list of your messages showing their ID\n`botpos edit <id>`: Edits one of your messages\n`botpos delete <id>`: Deletes one of your messages\n`botpos settings <setting>`: You can edit one of these settings which is `priority` or `interval`, `priority` being the priority of hearted reminders, and `interval` being the interval that I\'ll give you these messages\n`help`: Shows this list')
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return interaction.editReply({ content: "Please mention one of these subcommands!!", embeds: [botposEmbed] })
		}
	},
};

