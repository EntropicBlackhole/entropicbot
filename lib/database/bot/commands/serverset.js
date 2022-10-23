const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Server-Set",
	description: "Sets options for your server! Like verification, color roles, etc!",
	usage: "WIP",
	data: new SlashCommandBuilder()
		.setName('server-set')
		.setDescription('Sets options for your server! Like verification, color roles, etc!'),
	async execute(interaction, client) {
		await interaction.reply('WIP');
	},
};

