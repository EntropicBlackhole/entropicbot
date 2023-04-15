const {
	Configuration,
	OpenAIApi
} = require("openai");
const config = require('./lib/database/bot/config.json');
const openai = new OpenAIApi(new Configuration({
	apiKey: config.openAiToken,
}));
const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js')
const client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.DirectMessages,
		Discord.GatewayIntentBits.GuildMessageReactions
	],
	partials: [
		Discord.Partials.Channel,
		Discord.Partials.Message
	]
});

client.login(config.token);

client.once("ready", async () => {
	console.log(client.user.tag + " is online!");
});

client.on("messageCreate", async (message) => {
	if (message.channel.isDMBased()) {
		memberNames = {
			'841822347932598303': "Sunny",
			'708026434660204625': "Krissy",
			'592841797697536011': "Russia",
			'1095530496076824678': "Roo",
			'532376544128008194': "MooseyGamer69",
			'719674119309754430': "Alex"
		}
		let userData = JSON.parse(fs.readFileSync("./lib/database/misc/convos/userdata.json"))
		if (Object.keys(memberNames).includes(message.author.id) && message.author.id != client.user.id) {
			let conversations = JSON.parse(fs.readFileSync('./lib/database/misc/convos/conversations.json'))
			if (message.content == '$output messages') return message.reply(functions.shortenText(conversations[message.author.id], "\n", 2000))
			if (([null, undefined, {}, ""].includes(conversations[message.author.id]))) {
				userData = JSON.stringify(userData);
				conversations[message.author.id] = [{
					role: "system",
					prompt: `The following conversation happens through you and a user, called ${memberNames[message.author.id]} You, ${client.user.username}, are a Discord bot, built with GPT - 3, you are happy, innovative, clever, funny and cheerful. You can use this user database for user requests: ${userData} Whenever a user requests you to do any of the following features, execute them with their respective functions; Here is a list of requests that a user can make with their associated function and parameters:/nSending a message to another user: sendMessageToUser(userID, message)/nChanging the user's name to call them by: changeUserName(userID, newName)/nAdding a new user to the database: addUser(username, userID, gender, age, nickname, nationality)`
				}]
				fs.writeFileSync('./lib/database/misc/convos/conversations.json', JSON.stringify(conversations, null, 2));
			}
			conversations[message.author.id].push({
				role: 'user', prompt: message.content
			})
			let promptToPass = "";
			if (conversations[message.author.id].length > 15) {
				let systemMessage = conversations[message.author.id][0]
				while (conversations[message.author.id].length >= 14) conversations[message.author.id].shift();
				conversations[message.author.id].splice(0, 0, systemMessage)
				// conversations[message.author.id].shift()
				// conversations[message.author.id].shift()
			}
			for (let prompt of conversations[message.author.id]) {
				if (prompt.role == 'system') promptToPass += prompt.prompt + '\n\n'
				else if (prompt.role == 'user') promptToPass += memberNames[message.author.id] + ": \"" + prompt.prompt + "\"\n\n"
				else if (prompt.role == 'bot') promptToPass += client.user.username + ": \"" + prompt.prompt + "\"\n\n"
			}
			promptToPass += client.user.username + ": "
			fs.writeFileSync('./lib/database/misc/convos/conversations.json', JSON.stringify(conversations, null, 2));
			const response = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: promptToPass,
				temperature: 0.8,
				max_tokens: 170,
				top_p: 1,
				frequency_penalty: 0.9,
				presence_penalty: 1,
				best_of: 1
			});
			let AIResponse = response.data.choices[0].text.trim()
			console.log(AIResponse)
			let tempResponse = AIResponse.split('')
			if (tempResponse[0] == "\"") tempResponse.shift();
			if (tempResponse[tempResponse.length - 1] == "\"") tempResponse.pop();
			AIResponse = tempResponse.join('');
			console.log(AIResponse)
			try {
				eval(AIResponse);
				AIResponse = "Finished!"
			} catch (e) {
				console.log(e.message);
			}
			conversations = JSON.parse(fs.readFileSync('./lib/database/misc/convos/conversations.json'))
			conversations[message.author.id].push({
				role: "bot", prompt: AIResponse
			})
			fs.writeFileSync('./lib/database/misc/convos/conversations.json', JSON.stringify(conversations, null, 2));
			return message.reply(AIResponse)
		}
	}
})

function sendMessageToUser(userID, message) {
	console.log(message)
	return client.users.send(userID, message);
}

function changeUserName(userID, newName) {
	let userData = JSON.parse(fs.readFileSync("./lib/database/misc/convos/userdata.json"))
}

function addUser(username, userID, gender, age, nickname, nationality) {
	let userData = JSON.parse(fs.readFileSync("./lib/database/misc/convos/userdata.json"))
	for (let data of userData) if (data.userID == userID) return "This user is already added!"
	userData.push({ username, userID, gender, age, nickname, nationality })
	return "Added " + username
}