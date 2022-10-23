const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "TicTacToe",
	description: "Play TicTacToe with someone!",
	usage: "WIP",
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('Play TicTacToe with someone!'),
	async execute(interaction, client) {
		await interaction.reply('WIP');
	},
};

