const Canvas = require('@napi-rs/canvas')
const { Configuration, OpenAIApi } = require("openai");
const config = require('./config.json');
const fs = require('node:fs');
const { createReadStream } = require('node:fs');

exports.ParseDate = ParseDate
exports.FormatDate = FormatDate
exports.subStrBetweenChar = subStrBetweenChar
exports.randomColor = randomColor
exports.shortenText = shortenText
exports.exportBoard = exportBoard
exports.drawBoard = drawBoard
exports.attachIsImage = attachIsImage
exports.rgbToHex = rgbToHex
exports.correctIDs = correctIDs
exports.botPosInterval = botPosInterval
exports.wrapText = wrapText
exports.generateImage = generateImage
exports.variateImage = variateImage
exports.shortenText = shortenText
function Pad(s, w) {
	s = s.toFixed(0);
	while (s.length < w) {
		s = '0' + s;
	}
	return s;
}
function FormatDate(t) {
	const date = t.date;
	var year = Pad(date.getUTCFullYear(), 4);
	var month = Pad(1 + date.getUTCMonth(), 2);
	var day = Pad(date.getUTCDate(), 2);
	var hour = Pad(date.getUTCHours(), 2);
	var minute = Pad(date.getUTCMinutes(), 2);
	var svalue = date.getUTCSeconds() + (date.getUTCMilliseconds() / 1000);
	var second = Pad(Math.round(svalue), 2);
	return `${year}-${month}-${day} ${hour}:${minute}:${second} UTC`;
}
function ParseDate(text) {
	const d = new Date(text);
	if (!Number.isFinite(d.getTime())) {
		console.error(`ERROR: Not a valid date: "${text}"`);
		return null
	}
	return d;
}
function subStrBetweenChar(string, start, end) {
	return string.split(start)[1].split(end)[0]
}
function randomColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
function shortenText(text, delimiter, max) {
	if (text.length <= max) return text;
	else {
		newText = text.toString().split(delimiter.toString())
		newText.pop();
		return shortenText(newText.join(delimiter), delimiter, max);
	}
}
async function exportBoard(configuration, canvas) {
	let context = canvas.getContext('2d');
	context.fillStyle = '#000000';
	context.font = '30px Arial';
	var piecesConfig = configuration.pieces;
	const pieces = {
		'k': 'kb',
		'q': 'qb',
		'r': 'rb',
		'b': 'bb',
		'n': 'nb',
		'p': 'pb',
		'K': 'kw',
		'Q': 'qw',
		'R': 'rw',
		'B': 'bw',
		'N': 'nw',
		'P': 'pw'
	}
	var columns = {
		'A': 0,
		'B': 30,
		'C': 60,
		'D': 90,
		'E': 120,
		'F': 150,
		'G': 180,
		'H': 210
	}
	var rows = {
		'8': 30,
		'7': 60,
		'6': 90,
		'5': 120,
		'4': 150,
		'3': 180,
		'2': 210,
		'1': 240
	}

	for (i in piecesConfig) {
		let piece = piecesConfig[i]
		let letter = i.substr(0, 1)
		let number = i.substr(1, 1)
		let pieceToLoad = await Canvas.loadImage('./lib/assets/images/chess/' + pieces[piece] + '.png')
		await context.drawImage(pieceToLoad, columns[letter], rows[number]-30, 30, 30)
	}
	fs.writeFileSync('test.png', canvas.toBuffer('image/png'))
	return [canvas, context]
}
async function drawBoard(configuration) {
	let canvas = Canvas.createCanvas(240, 240);
	let context = canvas.getContext('2d');
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			if ((i + j) % 2 == 0) {
				context.fillStyle = '#e0e0e0';
			} else {
				context.fillStyle = '#909090';
			}
			context.fillRect(i * 30, j * 30, 30, 30);
		}
	}
	context.fillStyle = '#000000';
	context.font = '12px Arial';
	context.fillText('8', 2, 10)
	context.fillText('7', 2, 40)
	context.fillText('6', 2, 70)
	context.fillText('5', 2, 100)
	context.fillText('4', 2, 130)
	context.fillText('3', 2, 160)
	context.fillText('2', 2, 190)
	context.fillText('1', 2, 220)
	context.fillText('A', 20, 238)
	context.fillText('B', 50, 238)
	context.fillText('C', 80, 238)
	context.fillText('D', 110, 238)
	context.fillText('E', 140, 238)
	context.fillText('F', 170, 238)
	context.fillText('G', 200, 238)
	context.fillText('H', 230, 238)
	return await exportBoard(configuration, canvas)
}
function attachIsImage(msgAttach) {
	var url = msgAttach.url;
	//True if this url is a png image.
	return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
}
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function subStrBetweenChar(string, start, end) {
	return string.split(start)[1].split(end)[0]
}
function correctIDs(object) {
	newObject = {};
	let count = 1;
	for (i in object) {
		newObject[count.toString()] = object[i]
		count++
	}
	return newObject;
}
async function botPosInterval(client) {
	setInterval(() => {
		let reminders = JSON.parse(fs.readFileSync('./lib/database/misc/reminders/botpos.json'))
		for (user in reminders) {
			let time = reminders[user].config.next_reminder
			if (time < Date.now()) {
				reminders[user].config.next_reminder = Date.now() + (reminders[user].config.interval * 1000 * 3600)
				let remindArray = [];
				for (r in reminders[user].reminders) {
					if (reminders[user].reminders[r].hearted) {
						for (let i = 0; i < reminders[user].config.priority; i++) {
							remindArray.push(reminders[user].reminders[r].message)
						}
					}
					else remindArray.push(reminders[user].reminders[r].message)
				}
				var randomItem = remindArray[Math.floor(Math.random() * remindArray.length)];
				let parsedDate = ParseDate(reminders[user].config.next_reminder)
				if (randomItem) client.users.send(user, `\`${randomItem}\`\n\nNext reminder: ${parsedDate.toUTCString()} (in ${reminders[user].config.interval} hour${reminders[user].config.interval == 1 ? '' : 's'})`);
				fs.writeFileSync('./lib/database/misc/reminders/botpos.json', JSON.stringify(reminders, null, 2));
				remindArray = [];
				// console.log(Date.now()/1000)
			}
		}
	}, 10000)

}
function wrapText(text, limit) {
	textArray = text.split(' ')
	// var count = 0;
	var totalAmt = 0;
	let out = "";
	for (i of textArray) {
		totalAmt += i.length
		out += i + " "
		if (totalAmt >= limit) {
			out += '\n'
			totalAmt = 0;
		}
		if (i == '\n') totalAmt = 0;
	}
	return out;
}
async function generateImage({ prompt, amt = 1, size = "1024x1024", user = "general" }) {
	const AIconfig = new Configuration({
		apiKey: config.openAiToken
	});
	const openai = new OpenAIApi(AIconfig);
	try {
		var result = await openai.createImage({
			prompt,
			n: amt,
			size: size,
			user: user
		});
		const url = result.data.data[0].url;
		const imgResult = await fetch(url);
		const blob = await imgResult.blob();
		return Buffer.from(await blob.arrayBuffer())
	} catch (e) {
		if (e.response.status == 400) return null;
	}
}
async function variateImage({ image, amt = 1, size = "1024x1024", user = "general" }) {
	const AIconfig = new Configuration({
		apiKey: config.openAiToken
	});
	const openai = new OpenAIApi(AIconfig);
	try {
		// console.log(Buffer.from(await (await (await fetch(image.url)).blob()).arrayBuffer()))
		var result = await openai.createImageVariation({
			image: Buffer.from(await (await fetch(image.url)).blob()),
			n: amt,
			format: 'url',
			size: size,
			user: user
		});
		const url = result.data.data[0].url;
		const imgResult = await fetch(url);
		const blob = await imgResult.blob();
		return Buffer.from(await blob.arrayBuffer())
	} catch (e) {
		console.log(e);
		if (e.response.status == 400) return null;
	}
}
function shortenText(text, delimiter, max) {
	if (text.length <= max) return text;
	else {
		newText = text.toString().split(delimiter.toString())
		newText.pop();
		return shortenText(newText.join(delimiter), delimiter, max);
	}
}