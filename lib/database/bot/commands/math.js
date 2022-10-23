const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Math",
	description: "Input a math equation and I'll try to solve it!",
	usage: "<equation>",
	data: new SlashCommandBuilder()
		.setName('math')
		.setDescription('Input a math equation and I\'ll try to solve it!')
		.addStringOption(stringOption => stringOption
			.setName('equation')
			.setDescription('Input the equation here!')
			.setRequired(true)),
	async execute(interaction, client) {
		await interaction.deferReply();
		let equation = interaction.options.getString('equation')
		try {
			return interaction.editReply(Function("return " + equation)().toString())
		} catch (e) {
			return interaction.editReply(`Invalid math expression: ${equation}`)
		}
	},
};

