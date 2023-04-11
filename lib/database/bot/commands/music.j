const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Music",
	description: "Upload and stream music! A mini Spotify!",
	usage: "upload <name> <link>, search <query> <filter>, stream <id>",
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Upload, listen')
		.addSubcommand(subcommand => subcommand
			.setName('upload')
			.setDescription('Requires a name, and a link, you can add a description if wanted too!')
			.addOption(option => option
				.setName('name')
				.setDescription('Name of the audio')
				.setRequired(true))
			.addOption(option => option
				.setName('link')
				.setDescription('Link to the discord audio message')
				.setRequired(true))
			.addOption(option => option
				.setName('description')
				.setDescription('What is this song/audio about?')))
		.addSubcommand(subcommand => subcommand
			.setName('search')
			.setDescription('Search for artworks!')
			.addOption(option => option
				.setName('query')
				.setDescription('Query time!')
				.setRequired(true))
			.addOption(option => option
				.setName('filter')
				.setDescription('Filters out your query results')
				.setChoices(
					{ name: "Name", value: "name" },
					{ name: "Author", value: "author" },
					{ name: "User", value: "user" },
					{ name: "Link", value: "link" })))
		.addSubcommand(subcommand => subcommand
			.setName('stream')
			.setDescription('Each audio has an ID! Search for it and stream it!')
			.addOption(option => option
				.setName('id')
				.setDescription('ID of said audio')
				.setRequired(true))),
	async execute(interaction, client) {
		await interaction.deferReply();
		const subcommand = interaction.options.getSubcommand();
		if (subcommand == 'upload') {
			let name = interaction.options.getString('name');
			let link = interaction.options.getString('link');
			let description = interaction.options.getString('description') ?? 'None';
			if (link) return
		}
		if (subcommand == 'search') {
			let query = interaction.options.getString('query');
			let filter = interaction.options.getString('filter');
		}
		if (subcommand == 'stream') {
			let id = interaction.options.getString('id');
		}
	},
};