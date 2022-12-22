const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const functions = require('../functions')
const fs = require('fs');

module.exports = {
	name: "Note",
	description: "Notes info about a user!",
	usage: "create <user> <note> <hidden>, edit <user> <note> <hidden>, list, see <user>, delete <user>",
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription('Lets you note info about a user!')
		.addSubcommand(subcommand => subcommand
			.setName('create')
			.setDescription('Creates a note about a user!')
			.addUserOption(option => option
				.setName('user')
				.setDescription('User to note about')
				.setRequired(true))
			.addStringOption(option => option
				.setName('note')
				.setDescription('Note to create')
				.setRequired(true))
			.addBooleanOption(option => option
				.setName('hidden')
				.setDescription('When seeing it, should only you see it?')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('edit')
			.setDescription('Edit a note about a user!')
			.addUserOption(option => option
				.setName('user')
				.setDescription('User who\'s note to edit')
				.setRequired(true))
			.addStringOption(option => option
				.setName('note')
				.setDescription('Note to edit')
				.setRequired(true))
			.addBooleanOption(option => option
				.setName('hidden')
				.setDescription('Should this be hidden?')))
		.addSubcommand(subcommand => subcommand
			.setName('list')
			.setDescription('Lists all notes! (Hides hidden ones)'))
		.addSubcommand(subcommand => subcommand
			.setName('see')
			.setDescription('See your notes about a user!')
			.addUserOption(option => option
				.setName('user')
				.setDescription('User to see notes of')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('delete')
			.setDescription('Delete your notes about a user!')
			.addUserOption(option => option
				.setName('user')
				.setDescription('User to delete notes of')
				.setRequired(true))),
	async execute(interaction, client) {
		// await interaction.deferReply(); //!! Cannot edit message into ephemeral apparently
		const notes = JSON.parse(fs.readFileSync('./lib/database/misc/reminders/notes.json'));
		const subcommand = interaction.options.getSubcommand();
		if (notes[interaction.user.id] == undefined) notes[interaction.user.id] = {};
		if (subcommand == 'create') {
			let user = interaction.options.getUser('user');
			let note = interaction.options.getString('note');
			let hidden = interaction.options.getBoolean('hidden');
			notes[interaction.user.id][user.id] = {
				note: note,
				hidden: hidden
			}
			fs.writeFileSync('./lib/database/misc/reminders/notes.json', JSON.stringify(notes, null, 2));
			return interaction.reply('Successfully created note!');
		}
		if (subcommand == 'edit') {
			let user = interaction.options.getUser('user');
			let note = interaction.options.getString('note');
			let hidden = interaction.options.getBoolean('hidden');
			if (notes[interaction.user.id][user.id] == undefined) return interaction.reply('There is no note yet, create one with `/note create`')
			notes[interaction.user.id][user.id].note = note;
			console.log(notes[interaction.user.id][user.id].hidden)
			if (hidden !== null && hidden !== undefined) notes[interaction.user.id][user.id].hidden = hidden;
			console.log(hidden)
			console.log(notes[interaction.user.id][user.id].hidden)
			fs.writeFileSync('./lib/database/misc/reminders/notes.json', JSON.stringify(notes, null, 2));
			return interaction.reply('Successfully edited note!');
		}
		if (subcommand == 'list') {
			let userNotes = [];
			for (i in notes[interaction.user.id]) {
				console.log(client.guilds.cache.get(interaction.guild.id).members.cache.get(i))
				userNotes.push({
					name: (client.guilds.cache.get(interaction.guild.id).members.cache.get(i).user.username),
					value: (notes[interaction.user.id][i].hidden ? "Hidden" : notes[interaction.user.id][i].note)
				})
			}
			// console.log(userNotes)
			const noteEmbed = new EmbedBuilder()
				.setTitle('Notes about users')
				.setFields(...userNotes)
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return interaction.reply({ embeds: [noteEmbed] });
		}
		if (subcommand == 'see') {
			let user = interaction.options.getUser('user');
			if (notes[interaction.user.id][user.id] == undefined) return interaction.reply('There\'s no such note about this user');
			const noteEmbed = new EmbedBuilder()
				.setTitle('Note')
				.setDescription(notes[interaction.user.id][user.id].note)
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return interaction.reply({ embeds: [noteEmbed], ephemeral: notes[interaction.user.id][user.id].hidden });
		}
		if (subcommand == 'delete') {
			let user = interaction.options.getUser('user');
			if (notes[interaction.user.id][user.id] == undefined) return interaction.reply('There is no note associated with this user')
			delete notes[interaction.user.id][user.id]
			fs.writeFileSync('./lib/database/misc/reminders/notes.json', JSON.stringify(notes, null, 2));
			return interaction.reply('Deleted note!');
		}
	},
};