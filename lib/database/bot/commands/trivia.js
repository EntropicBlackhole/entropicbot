const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Trivia",
	description: "Asks trivia questions in a channel! Useful for trivia night! Source: https://ponly.com/trivia-questions/",
	usage: "WIP",
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Trivia night time!!'),
	async execute(interaction, client) {
		await interaction.reply('WIP');
	},
};

