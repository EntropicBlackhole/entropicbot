const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs')
module.exports = {
	name: "Server-Set",
	description: "Sets options for your server! Like verification, color roles, welcome/goodbye cards, etc!!",
	usage: "WIP",
	data: new SlashCommandBuilder()
		.setName('server-set')
		.setDescription('Sets features and small things for your server! Like verification, color roles, etc!')
		.addSubcommand(subcommand => subcommand
			.setName('verification')
			.setDescription('Set up a channel, role, and code to verify someone with!')
			.addStringOption(stringOption => stringOption
				.setName('code')
				.setDescription('Input the code to verify with!')
				.setRequired(true))
			.addChannelOption(channelOption => channelOption
				.setName('channel')
				.setDescription('Input the channel to verify in!')
				.setRequired(true))
			.addRoleOption(roleOption => roleOption
				.setName('role')
				.setDescription('Input the role to place after verifying!')
				.setRequired(true))
			.addStringOption(stringOption => stringOption
				.setName('verified-message')
				.setDescription('The message to display when the code is right!')
				.setRequired(true))
			.addStringOption(stringOption => stringOption
				.setName('non-verified-message')
				.setDescription('The message to display when the code is wrong!')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand), //welcome and goodbye cards
	async execute(interaction, client) {
		await interaction.deferReply();
		const serverConfig = JSON.parse(fs.readFileSync('./lib/database/servers/config/servers_config.json'));
		if (serverConfig[interaction.guild.id] == undefined) {
			serverConfig[interaction.guild.id] = { 
				verification: {
					verificationCode: null,
					verificationChannel: null,
					verificationRole: null,
					verifiedMessage: null,
					nonVerifiedMessage: null
				},
				guildMemberUpdateCard: {
					join: {
						theme: null,
						text: {
							title: null,
							text: null,
							subtitle: null,
							color: null,
							font: null
						},
						avatar: {
							image: null,
							outlineWidth: null,
							outlineColor: null,
							borderRadius: null,
							imageRadius: null
						},
						background: null,
						blur: null,
						border: null,
						rounded: null
					},
					leave: {
						theme: null,
						text: {
							title: null,
							text: null,
							subtitle: null,
							color: null,
							font: null
						},
						avatar: {
							image: null,
							outlineWidth: null,
							outlineColor: null,
							borderRadius: null,
							imageRadius: null
						},
						background: null,
						blur: null,
						border: null,
						rounded: null
					}
				}
			}
			fs.writeFileSync('./lib/database/servers/config/servers_config.json', JSON.stringify(serverConfig, null, 2));
		}
		let subCommand = interaction.options.getSubcommand();
		if (subCommand == 'verification') {
			serverConfig[interaction.guild.id].verification.verificationCode = interaction.options.getString('code');
			serverConfig[interaction.guild.id].verification.verificationChannel = interaction.options.getChannel('channel').id;
			serverConfig[interaction.guild.id].verification.verificationRole = interaction.options.getRole('role').id;
			serverConfig[interaction.guild.id].verification.verifiedMessage = interaction.options.getString('verified-message');
			serverConfig[interaction.guild.id].verification.nonVerifiedMessage = interaction.options.getString('non-verified-message');
			fs.writeFileSync('./lib/database/servers/config/servers_config.json', JSON.stringify(serverConfig, null, 2));
			return interaction.editReply("All good! Updated your verification system!")
		}
	},
};

