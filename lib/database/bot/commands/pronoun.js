const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Pronoun",
	description: "Test out pronouns and register your pronouns so people learn to use them!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('pronoun')
		.setDescription('Test out pronouns and register your pronouns so people learn to use them!')
		.addSubcommand(subcommand => subcommand
			.setName('test')
			.setDescription('Test out your pronouns!')
			.addStringOption(option => option
				.setName('name')
				.setDescription('Your name!')
				.setRequired(true))
			.addStringOption(option => option
				.setName('pronoun-one')
				.setDescription('Example: She')
				.setRequired(true))
			.addStringOption(option => option
				.setName('pronoun-two')
				.setDescription('Example: Her')
				.setRequired(true))),
			// .addStringOption(option => option
				// .setName('pronoun-three')
				// .setDescription('Example: Hers')
				// .setRequired(true))
			// .addStringOption(option => option
				// .setName('pronoun-four')
				// .setDescription('Example: Herself')
				// .setRequired(true)),
	async execute(interaction, client) {
		let name = interaction.options.getString('name');
		let pronounOne = interaction.options.getString('pronoun-one').toLowerCase();
		let pronounTwo = interaction.options.getString('pronoun-two').toLowerCase();
		// let pronounThree = interaction.options.getString('pronoun-three').toLowerCase();
		// let pronounFour = interaction.options.getString('pronoun-four').toLowerCase();
		let sentenceArray = [
			`Are you coming to ${name}'s party tomorrow? ${pronounTwo} parties are the best and ${pronounTwo} parents will be gone!`,
			`Do you know if ${name} is alright? ${pronounOne} didn't reply to my last message, I hope ${pronounOne} is good. I think I'll call ${pronounTwo} after school or visit ${pronounTwo} later.`,
			`Do you remember ${name}? We went to middle school together, ${pronounOne} was that person who always got an A in maths. Yesterday, I met ${pronounTwo} in the cinema, we exchanged phone numbers. I hope we can meet up soon again, ${name} is such a nice person!`,
			`Do you know ${name}? ${pronounOne} is James' younger sibling and goes to another school and plays the piano. I recently heard ${pronounOne}'s playing and ${pronounOne}'s so talented!`,
			`Do you know where I can get some books for ${name}? It's ${pronounTwo} birthday soon and ${pronounOne} absolutely loves fantasy novels.`,
			`Do you want to hang out with me and ${name} today? ${pronounOne} and I planned to watch a horror movie tonight, I'm sure ${pronounOne} will be happy if you join us!`,
			`Have you heard that ${name} recently started a YouTube channel? I have watched every single video and ${pronounOne} is so funny! I hope ${pronounTwo} YouTube channel gains more attention soon, ${pronounOne} deserves it!`,
			`I'm gonna be hanging out with ${name} today, ${pronounOne} wanted me to help with ${pronounTwo} homework and then play some games together.`,
			`I'm sorry, but ${name} isn't here right now. I'm just ${pronounTwo} friend, do you want to leave a message for ${pronounTwo} or should ${pronounOne} call back later?`,
			`I am so excited, tomorrow I will finally get to meet ${name} again! I havent seen ${pronounTwo} in a while, I hope ${pronounOne} is alright! We have already made plans, first ${name} and I will eat some ice cream and after that, we will watch a movie together. I hope everything goes well!`,
			`I enjoy going to the beach with my friend ${name}, we're so different, but still get along very well, ${pronounOne}'s currently on a gap year in Europe, but we still facetime and talk everyday.`,
			`Sorry that I didn't answer your calls last night, I was at ${name}'s house. We worked together on a biology project for school and I stayed for dinner at ${pronounTwo} house. ${pronounOne} and ${pronounTwo} parents were so welcoming and nice!`,
			`Yesterday, we got a new classmate. ${pronounOne} seems to be a nice person, ${pronounTwo} name is ${name}. ${pronounOne}'s from another country and fluent in three languages, I hope I can become friends with ${pronounTwo}!`,
			`Your computer isn't working? You have to see ${name} about that, ${pronounOne}'s such a talented person when it comes to fixing them. I dont know ${pronounTwo} very well, but I can give you ${pronounTwo} number or email address.`,
			`${name} baked a cool cake for my last birthday. ${pronounOne} is always nice to me, I'm so glad that I'm friends with ${pronounTwo}!`,
			`${name} is a very good artist! ${pronounOne} doesn't have much confidence in ${pronounTwo}self, but I know ${pronounOne} will see how wonderful ${pronounOne} is some day.`,
			`${name} and I have been friends since primary school. Next year I will hopefully move together with ${pronounTwo} in our own apartment!`,
			`${name} has a great taste in clothes! The other day ${pronounOne} helped me deciding on my outfit for my date. I'm very grateful for ${pronounTwo}!`,
			`${name} baked a cool cake for my last birthday.${pronounOne} is always nice to me, I'm so glad that I'm friends with ${pronounTwo}!`,
			`${name} and I have so much in common, we like the same food, the same music and have the same style. We have known each other forever, I'm so glad that I'm friends with ${pronounTwo}.`
		]
		await interaction.reply(`${sentenceArray[Math.floor(Math.random() * sentenceArray.length)]}\n\n${sentenceArray[Math.floor(Math.random() * sentenceArray.length)]}\n\n${sentenceArray[Math.floor(Math.random() * sentenceArray.length)]}`)
	},
};