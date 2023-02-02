const { sign } = require('crypto');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const functions = require('../functions')
const moneyBegTimer = new Set()
module.exports = {
	name: "Money",
	description: "All money related things!",
	usage: "shop [buy <item> <amount?>, list, sell <item>], transfer <user> <amount>, balance <user?>",
	data: new SlashCommandBuilder()
		.setName('money')
		.setDescription('All currency related things!')
		.addSubcommandGroup(subcommandGroup => subcommandGroup
			.setName('shop')
			.setDescription('Buy and sell things! There\'s a list too!')
			.addSubcommand(subcommand => subcommand
				.setName('buy')
				.setDescription('Buy an item with an item ID! (See ID in List)')
				.addStringOption(option => option
					.setName('item')
					.setDescription('ID of the item to buy')
					.setRequired(true))
				.addIntegerOption(option => option
					.setName('amount')
					.setDescription('Amount of the item to buy (Defaults to 1)')))
			.addSubcommand(subcommand => subcommand
				.setName('list')
				.setDescription('List of items to buy!'))
			.addSubcommand(subcommand => subcommand
				.setName('sell')
				.setDescription('Sell an item for 60% its original price!')
				.addStringOption(option => option
					.setName('item')
					.setDescription('ID of item to sell')
					.setRequired(true))
				.addIntegerOption(option => option
					.setName('amount')
					.setDescription('Amount of the item to sell (Defaults to 1'))))
		.addSubcommand(subcommand => subcommand
			.setName('transfer')
			.setDescription('Transfer money to someone!')
			.addUserOption(option => option
				.setName('user')
				.setDescription('User to transfer')
				.setRequired(true))
			.addIntegerOption(option => option
				.setName('amount')
				.setDescription('Amount of money to transfer')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('balance')
			.setDescription('Check your/someone\'s balance!')
			.addUserOption(option => option
				.setName('user')
				.setDescription('User to check balance of (Defaults to self)')))
		.addSubcommand(subcommand => subcommand
			.setName('beg')
			.setDescription('Don\'t be a choosing beggar')),
	async execute(interaction, client) {
		await interaction.deferReply();
		const bank = JSON.parse(fs.readFileSync('./lib/database/currency/bank.json', 'utf8'));
		const shop = JSON.parse(fs.readFileSync('./lib/database/currency/shop.json', 'utf8'));
		const users = JSON.parse(fs.readFileSync('./lib/database/users/users.json', 'utf8'));
		if (!bank[interaction.user.id]) {
			bank[interaction.user.id] = 0;
			fs.writeFileSync('./lib/database/currency/bank.json', JSON.stringify(bank, null, 2));
		}
		if (!users[interaction.user.id]) {
			users[interaction.user.id] = {};
			fs.writeFileSync('./lib/database/users/users.json', JSON.stringify(users, null, 2));
		}
		const subcommand = interaction.options.getSubcommand();
		const subcommandGroup = interaction.options.getSubcommandGroup();
		if (subcommandGroup == 'shop') {
			if (subcommand == 'buy') {
				let item = interaction.options.getString('item');
				let amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
				if ((!item.includes('|')) || (item.split('|').length != 2) || (item.split('|')[0] == '') || item.split('|')[1] == '') return interaction.editReply('Item is not formatted correctly (trivia|trivia_pass)')
				let shopItem = shop[item.split('|')[0]][item.split('|')[1]]
				if (!(shopItem)) return interaction.editReply('This item does not exist in the shop')
				if ((shopItem.cost * amount) > bank[interaction.user.id]) return interaction.editReply(`You don't have ${(shopItem.cost * amount)} Entropy to buy \`${amount}\` ${item}. You only have &${bank[interaction.user.id]}`)
				bank[interaction.user.id] -= (shopItem.cost * amount)
				users[interaction.user.id][item] = (users[interaction.user.id][item]) ? users[interaction.user.id][item]+1 : 1
				fs.writeFileSync('./lib/database/currency/bank.json', JSON.stringify(bank, null, 2));
				fs.writeFileSync('./lib/database/users/users.json', JSON.stringify(users, null, 2));
				return interaction.editReply(`Successfully bought \`${amount}\` ${item} for &${amount * shopItem.cost}!`)
			}
			else if (subcommand == 'list') {
				let description = '';
				for (i in shop) {
					for (j in shop[i]) {
						let name = shop[i][j].name;
						let desc = shop[i][j].description;
						let cost = shop[i][j].cost;
						let id = `${i}|${j}`
						description += `**${name}**\nDescription: ${desc}\nCost: ${cost}\nID: ${id}\n\n`
					}
				}
				const shopEmbed = new EmbedBuilder()
					.setTitle('Shop')
					.setDescription(description.trim())
					.setColor(functions.randomColor())
					.setTimestamp()
					.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
				return interaction.editReply({ embeds: [shopEmbed] })
			}
			else if (subcommand == 'sell') {
				let item = interaction.options.getString('item');
				let amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
				if ((!item.includes('|')) || (item.split('|').length != 2) || (item.split('|')[0] == '') || item.split('|')[1] == '') return interaction.editReply('Item is not formatted correctly (trivia|trivia_pass)')
				let shopItem = shop[item.split('|')[0]][item.split('|')[1]]
				if (!(shopItem)) return interaction.editReply('This item does not exist in the shop')
				if (!users[interaction.user.id][item]) return interaction.editReply('You don\'t have this item in your inventory')
				bank[interaction.user.id] += Math.round((shopItem.cost * (60 / 100)) * amount)
				users[interaction.user.id][item] -= amount
				fs.writeFileSync('./lib/database/currency/bank.json', JSON.stringify(bank, null, 2));
				fs.writeFileSync('./lib/database/users/users.json', JSON.stringify(users, null, 2));
				return interaction.editReply(`Successfully sold \`${amount}\` ${item} for &${Math.round((shopItem.cost * (60 / 100)) * amount) }!`)
			}
		}
		else if (subcommand == 'transfer') {
			let user = interaction.options.getUser('user');
			let amount = interaction.options.getInteger('amount');
			if (user.id == client.user.id) return interaction.editReply(`I'm a bot you idiot, why would I need money?`)
			if (user.bot) return interaction.editReply(`${user} is a bot, you can't transfer money to them`)
			if (Math.abs(amount) !== amount) return interaction.editReply('You can\'t transfer negative money dumbass')
			bank[user.id] += amount;
			bank[interaction.user.id] -= amount;
			return interaction.editReply(`Successful transaction of ${amount} to ${user}!`)
		}
		else if (subcommand == 'balance') {
			let user = interaction.options.getUser('user').id ? interaction.options.getUser('user').id : interaction.user.id;
			if (user.id == client.user.id) return interaction.editReply(`I don't have money dumbass`)
			if (user.bot) return interaction.editReply(`Oi mate bot ain't got them moolah`)
			const balanceEmbed = new EmbedBuilder()
				.setTitle(`Balance of ${user.name}`)
				.setDescription(parseInt(bank[user.id]) + ' Entropy')
				.setColor(randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			return interaction.editReply({ embeds: [balanceEmbed] })
		}
		else if (subcommand == 'beg') {
			if (!moneyBegTimer.has(interaction.user.id)) {
				let random = Math.round(Math.random() * 50)+1
				bank[interaction.user.id] += random
				fs.writeFileSync('./lib/database/currency/bank.json', JSON.stringify(bank, null, 2));
				moneyBegTimer.add(interaction.user.id);
				setTimeout(() => moneyBegTimer.delete(interaction.user.id), 45000)
				return interaction.editReply(`You got &${random}!`)
			} else return interaction.editReply(`You've already begged! Try again in a few seconds`)
		}
	},
};

