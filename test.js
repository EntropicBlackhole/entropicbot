const apiKey = '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';
const chatId = '56789';
const apiUrl = 'https://api.openai.com/v1';
start()

async function start() {
	let response = "Output code in JavaScript to , do not give description, only code";
	eval(await sendMessage(response))
}

async function sendMessage(prompt) {
	const requestBody = {
		model: "text-davinci-003",
		prompt: prompt,
		temperature: 0.9,
		max_tokens: 450,
		top_p: 1,
		frequency_penalty: 1.4,
		presence_penalty: 0.6,
		best_of: 1
	};
	try {
		const response = await fetch(apiUrl + '/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify(requestBody)
		});
		const responseBody = await response.json();
		const AIresponse = responseBody.choices[0].text.trim();
		return AIresponse
	}
	catch (e) {
		console.log(e.message)
	}
}
