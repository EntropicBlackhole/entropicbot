const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Ping",
	description: "Ping!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping!'),
	async execute(interaction, client) {
		interaction.reply('Ping!')
	},
};

