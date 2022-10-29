const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "money",
	description: "All money related things!",
	usage: "[shop [buy <item> <amount>, list, sell <item>], transfer <user> <amount>]",
	data: new SlashCommandBuilder()
		.setName('money')
		.setDescription('Shop for all currency related things!'),
	async execute(interaction, client) {
		await interaction.reply('WIP');
	},
};

