const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs')
const { drawCard } = require('discord-welcome-card')

module.exports = {
	name: "Server-Set",
	description: "Sets options for your server! Like verification, color roles, welcome/goodbye cards, etc!!",
	usage: "WIP",
	data: new SlashCommandBuilder()
		.setName('server-set')
		.setDescription('Sets features and small things for your server! Like verification, color roles, etc!')
		.addSubcommand(subcommand => subcommand //verification system
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
		.addSubcommandGroup(subcommandGroup => subcommandGroup //welcome and goodbye cards
			.setName('member-update')
			.setDescription('A welcome/goodbye card when a user joins/leaves the server!')
			.addSubcommand(subcommand => subcommand
				.setName('welcome-card')
				.setDescription('A welcome card for when a user joins')
				.addChannelOption(channelOption => channelOption
					.setName('channel')
					.setDescription('The channel where this will go!')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('theme')
					.setDescription('Select a theme with some default options')
					.addChoices(
						{ name: 'Circuit', value: 'circuit' },
						{ name: 'Code', value: 'code' },
						{ name: 'Dark', value: 'dark' }
					)
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('title')
					.setDescription('Text in the Top (Place "$member" or "$server" to put that name into the card)')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('text')
					.setDescription('Text in the middle (big) (Place "$member" or "$server" to put that name into the card)')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('subtitle')
					.setDescription('Text on the bottom (Place "$member" or "$server" to put that name into the card)')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('image')
					.setDescription('Use either the server pfp, the user\'s pfp, or no image')
					.addChoices(
						{ name: 'User\'s profile pic', value: 'user' },
						{ name: 'Server\'s profile pic', value: 'server' },
						{ name: 'None', value: 'none' }
					)
					.setRequired(true))
				.addBooleanOption(booleanOption => booleanOption
					.setName('blur')
					.setDescription('If the background should be blurred')
					.setRequired(true))
				.addBooleanOption(booleanOption => booleanOption
					.setName('border')
					.setDescription('When enabled a blurred border is drawn')
					.setRequired(true))
				.addBooleanOption(booleanOption => booleanOption
					.setName('rounded')
					.setDescription('If enabled the edges will be rounded')
					.setRequired(true))
				.addAttachmentOption(attachmentOption => attachmentOption
					.setName('background')
					.setDescription('Override the default theme'))
				.addStringOption(stringOption => stringOption
					.setName('color')
					.setDescription('Font Color (Use a hex code PLEASE (#ffffaa for example)'))
				.addStringOption(stringOption => stringOption
					.setName('font')
					.setDescription('Custom Font (i.e Times New Roman, SegoeUI'))
				.addIntegerOption(numberOption => numberOption
					.setName('outline-width')
					.setDescription('Width of the outline around the avatar')
					.setMinValue(1)
					.setMaxValue(10))
				.addStringOption(stringOption => stringOption
					.setName('outline-color')
					.setDescription('Color of the outline (Use a hex code PLEASE (#ffffaa for example)'))
				.addNumberOption(integerOption => integerOption
					.setName('border-radius')
					.setDescription('Border radius of the avatar between 0.0 and 1.0')
					.setMaxValue(1.0)
					.setMinValue(0.0))
				.addNumberOption(integerOption => integerOption
					.setName('image-radius')
					.setDescription('Radius of the image, 1.0 makes it the height of the card, 0.8 is recommended')
					.setMaxValue(1.0)
					.setMinValue(0.0)))
			.addSubcommand(subcommand => subcommand
				.setName('goodbye-card')
				.setDescription('A goodbye card for when a user leaves')
				.addChannelOption(channelOption => channelOption
					.setName('channel')
					.setDescription('The channel where this will go!')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('theme')
					.setDescription('Select a theme with some default options')
					.addChoices(
						{ name: 'Circuit', value: 'circuit' },
						{ name: 'Code', value: 'code' },
						{ name: 'Dark', value: 'dark' }
					)
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('title')
					.setDescription('Text in the Top (Place "$member" or "$server" to put that name into the card)')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('text')
					.setDescription('Text in the middle (big) (Place "$member" or "$server" to put that name into the card)')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('subtitle')
					.setDescription('Text on the bottom (Place "$member" or "$server" to put that name into the card)')
					.setRequired(true))
				.addStringOption(stringOption => stringOption
					.setName('image')
					.setDescription('Use either the server pfp, the user\'s pfp, or no image')
					.addChoices(
						{ name: 'User\'s profile pic', value: 'user' },
						{ name: 'Server\'s profile pic', value: 'server' },
						{ name: 'None', value: 'none' }
					)
					.setRequired(true))
				.addBooleanOption(booleanOption => booleanOption
					.setName('blur')
					.setDescription('If the background should be blurred')
					.setRequired(true))
				.addBooleanOption(booleanOption => booleanOption
					.setName('border')
					.setDescription('When enabled a blurred border is drawn')
					.setRequired(true))
				.addBooleanOption(booleanOption => booleanOption
					.setName('rounded')
					.setDescription('If enabled the edges will be rounded')
					.setRequired(true))
				.addAttachmentOption(attachmentOption => attachmentOption
					.setName('background')
					.setDescription('Override the default theme'))
				.addStringOption(stringOption => stringOption
					.setName('color')
					.setDescription('Font Color (Use a hex code PLEASE (#ffffaa for example)'))
				.addStringOption(stringOption => stringOption
					.setName('font')
					.setDescription('Custom Font (i.e comic-sans'))
				.addIntegerOption(numberOption => numberOption
					.setName('outline-width')
					.setDescription('Width of the outline around the avatar')
					.setMinValue(1)
					.setMaxValue(10))
				.addStringOption(stringOption => stringOption
					.setName('outline-color')
					.setDescription('Color of the outline (Use a hex code PLEASE (#ffffaa for example)'))
				.addNumberOption(integerOption => integerOption
					.setName('border-radius')
					.setDescription('Border radius of the avatar between 0.0 and 1.0')
					.setMaxValue(1.0)
					.setMinValue(0.0))
				.addNumberOption(integerOption => integerOption
					.setName('image-radius')
					.setDescription('Radius of the image, 1.0 makes it the height of the card, 0.8 is recommended')
					.setMaxValue(1.0)
					.setMinValue(0.0)))),
	async execute(interaction, client) {
		await interaction.deferReply();
		const serverConfig = JSON.parse(fs.readFileSync('./lib/database/misc/servers/config/servers_config.json'));
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
			fs.writeFileSync('./lib/database/misc/servers/config/servers_config.json', JSON.stringify(serverConfig, null, 2));
		}
		let subCommand = interaction.options.getSubcommand();
		let subCommandGroup = interaction.options.getSubcommandGroup();
		if (subCommand == 'verification') {
			serverConfig[interaction.guild.id].verification.verificationCode = interaction.options.getString('code');
			serverConfig[interaction.guild.id].verification.verificationChannel = interaction.options.getChannel('channel').id;
			serverConfig[interaction.guild.id].verification.verificationRole = interaction.options.getRole('role').id;
			serverConfig[interaction.guild.id].verification.verifiedMessage = interaction.options.getString('verified-message');
			serverConfig[interaction.guild.id].verification.nonVerifiedMessage = interaction.options.getString('non-verified-message');
			fs.writeFileSync('./lib/database/misc/servers/config/servers_config.json', JSON.stringify(serverConfig, null, 2));
			return interaction.editReply("All good! Updated your verification system!")
		} else if (subCommandGroup == 'member-update') {
			let channel = interaction.options.getChannel('channel').id;
			let theme = interaction.options.getString('theme');
			let title = interaction.options.getString('title');
			let text = interaction.options.getString('text')
			let subtitle = interaction.options.getString('subtitle');
			let image = interaction.options.getString('image')
			let blur = interaction.options.getBoolean('blur')
			let border = interaction.options.getBoolean('border')
			let rounded = interaction.options.getBoolean('rounded')
			let background = interaction.options.getAttachment('background')
			let color = interaction.options.getString('color')
			let font = interaction.options.getString('font');
			let outlineWidth = interaction.options.getInteger('outline-width')
			let outlineColor = interaction.options.getString('outline-color')
			let borderRadius = interaction.options.getNumber('border-radius')
			let imageRadius = interaction.options.getNumber('image-radius')
			const sendImage = await drawCard({
				theme: theme,
				text: {
					title: title.replace('$member', interaction.user.tag).replace('$server', interaction.guild.name),
					text: text.replace('$member', interaction.user.tag).replace('$server', interaction.guild.name),
					subtitle: subtitle.replace('$member', interaction.user.tag).replace('$server', interaction.guild.name),
					color: color,
					font: font
				},
				avatar: {
					image: (image == 'user' ? interaction.user.displayAvatarURL({ extension: 'png' }) : (image == 'server' ? interaction.guild.iconURL({ extension: 'png' }) : undefined)),
					outlineWidth: outlineWidth,
					outlineColor: outlineColor,
					borderRadius: borderRadius,
					imageRadius: imageRadius
				},
				background: (background != undefined) ? background.url : undefined,
				blur: blur,
				border: border,
				rounded: rounded,
			});
			interaction.editReply({ content: "This is what it looks like, is this good? (y/n)", files: [sendImage] });
			const filter = m => (['y', 'n'].includes(m.content.toLowerCase()) && m.author.id === interaction.user.id);
			const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 })

			collector.on('collect', m => {
				if (m.content.toLowerCase() == 'n') return interaction.followUp('Retry the command! Change up a few parameters to adjust it to your liking!')
				else if (m.content.toLowerCase() == 'y') {
					const cardInfo = {
						channel: channel,
						theme: theme,
						text: {
							title: title,
							text: text,
							subtitle: subtitle,
							color: color,
							font: font
						},
						avatar: {
							image: image,
							outlineWidth: outlineWidth,
							outlineColor: outlineColor,
							borderRadius: borderRadius,
							imageRadius: imageRadius
						},
						background: (background != undefined) ? background.url : undefined,
						blur: blur,
						border: border,
						rounded: rounded,
					};
					const serverConfig = JSON.parse(fs.readFileSync('./lib/database/misc/servers/config/servers_config.json'));
					serverConfig[interaction.guild.id].memberUpdate = { [subCommand]: cardInfo }
					fs.writeFileSync('./lib/database/misc/servers/config/servers_config.json', JSON.stringify(serverConfig, null, 2));
					return interaction.followUp('Okay! Set as your ' + subCommand.replace('-', ' ') + ' card!');
				}
			})

		}
	},
};

