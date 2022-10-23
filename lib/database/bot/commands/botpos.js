const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Botpos",
	description: "Positivity command! You can set reminders and I will DM you a random reminder! (This is used for positive messages, like sending you a positive message)",
	usage: "WIP",
	data: new SlashCommandBuilder()
		.setName('botpos')
		.setDescription('Positive reminders!'),
	async execute(interaction, client) {
		await interaction.reply('WIP');
	},
};

