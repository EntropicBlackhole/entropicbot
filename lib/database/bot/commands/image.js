const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const functions = require('../functions')
const fs = require('node:fs');

module.exports = {
	name: "Image",
	description: 'Edit, generate, or create variations of an image with AI (Currently not working since OpenAI charges for it)',
	usage: '[generate <prompt>, variation, edit]',
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription('Edit, generate, or create variations of an image with AI')
		.addSubcommand(subcommand => subcommand
			.setName('generate')
			.setDescription('Generate an image given a prompt!')
			.addStringOption(stringOption => stringOption
				.setName('prompt')
				.setDescription('Text to turn into an image!')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('variation')
			.setDescription('Variate an image! (WIP)')
			.addAttachmentOption(attachmentOption => attachmentOption
				.setName('variation')
				.setDescription('Image to variate!')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('edit')
			.setDescription('Edit an image! (WIP)')),
	async execute(interaction, client) {
		await interaction.deferReply();
		const subCommand = interaction.options.getSubcommand()
		if (subCommand == 'generate') {
			let prompt = interaction.options.getString('prompt');
			var image = await functions.generateImage({
				prompt: prompt,
				user: interaction.user.id,
			});
			if (image == null) return interaction.editReply('Your prompt was considered invalid/offensive, please try again.')
			return interaction.editReply({ files: [image] });
		}
		else if (subCommand == 'variation') {
			let variation = interaction.options.getAttachment('variation');
			console.log(variation)
			var image = await functions.variateImage({
				image: variation,
				user: interaction.user.id,
			});
			if (image == null) return interaction.editReply('Your image was considered invalid/offensive, please try again.')
			return interaction.editReply({ files: [image] });
		}
	}
}