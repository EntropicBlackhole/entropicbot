const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Ping",
	description: "Pong!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	async execute(interaction, client) {
		interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
	},
};

