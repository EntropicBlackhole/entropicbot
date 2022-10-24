reminders = {
	reminders: {},
	config: {
		interval: 2,
		priority: 5
	}
}
console.log(Object.keys(reminders.reminders).length)
/*
let Weight1 = randomNumber(-4, 4);
let Weight2 = randomNumber(-4, 4);
let Weight3 = randomNumber(-4, 4);
const WEIGHTS = [[Weight1], [Weight2], [Weight3]]
TRAINING_INPUTS = [[0, 0, 1], [1, 1, 1], [1, 0, 1], [0, 1, 1]]
EXPECTED_OUTPUTS = [[0], [1], [1], [1]]
 
for (let i = 0; i < 10000; i++) {
	for (let j = 0; j < 4; j++) {
		ACQUIRED_OUTPUT = 1 / (1 + Math.exp(-1 * MATRIX_ROW_TIMES_COLUMN_MULTIPLY(TRAINING_INPUTS, WEIGHTS, j)))
		SIGMOID_GRADIENT = ACQUIRED_OUTPUT * (1 - ACQUIRED_OUTPUT)
		WEIGHTS[0][0] += TRAINING_INPUTS[j][0] * ((EXPECTED_OUTPUTS[j][0] - ACQUIRED_OUTPUT) * SIGMOID_GRADIENT)
		WEIGHTS[1][0] += TRAINING_INPUTS[j][1] * ((EXPECTED_OUTPUTS[j][0] - ACQUIRED_OUTPUT) * SIGMOID_GRADIENT)
		WEIGHTS[2][0] += TRAINING_INPUTS[j][2] * ((EXPECTED_OUTPUTS[j][0] - ACQUIRED_OUTPUT) * SIGMOID_GRADIENT)
	}
}

var Input1 = 0
var Input2 = 1
var Input3 = 1

var resolve = (1 / (1 + Math.exp(-1 * (Input1 * WEIGHTS[0][0] + Input2 * WEIGHTS[1][0] + Input3 * WEIGHTS[2][0]))))

var validationCase = `Validation Case: \n${Input1}, ${Input2}, ${Input3}`
var finalWeights = `Final Weights: \nWeight1: ${WEIGHTS[1, 1]}\nWeight2: ${WEIGHTS[2, 1]}\nWeight3: ${WEIGHTS[3, 1]}`
var weightedSolution = `Weighted Solution: \n${Input1 * WEIGHTS[0][0] + Input2 * WEIGHTS[1][0] + Input3 * WEIGHTS[2][0]}`
var finalSolution = `Final Solution: ${resolve}`
console.log(validationCase + "\n\n" + finalWeights + "\n\n" + weightedSolution + "\n\n" + finalSolution)

function MATRIX_ROW_TIMES_COLUMN_MULTIPLY(A, B, RowOfA) {
	if (A[RowOfA].length != B.length) return console.error('Number of Columns in the first matrix must be equal to the number of rows in the second matrix.') 
	Result = 0;
	for (i = 0; i < A[RowOfA].length; i++)
		Result += A[RowOfA][i] * B[i][0]
	return Result
}
function randomNumber(min, max) {
	return Math.random() * (max - min + 1) + min;
}

/*
const Client = require('brainly-client')
const brainly = new Client();
const answer = "1 + 1"
console.log("Pergunta: " + answer);
try {
	brainly.search(answer)
		.then(questions => {
			const question = questions[0]
			const answer = question.answers[0]
			const itemTitle = question.content.replaceAll("<br />", "\n").replaceAll(/<[^>]*>/g, '');
			const itemAuthorNick = answer.author.nick;
			const itemRatingQuestion = answer.rating;
			const itemThanksCount = answer.thanksCount;
			const answer_formatted = answer.content.replaceAll("<br />", "\n").replaceAll(/<[^>]*>/g, '');
			const final_result = "⚠️ *RESULTADO DA PESQUISA!*\n\n" + "_Se não achou a answer/resposta desejada,tente fazer a answer com mais detalhes_" + "\n\n*Pergunta encontrada:* " + itemTitle + "\n\n*Resposta encontrada:* \n" + answer_formatted + "\n\n*Autor da resposta:* " + itemAuthorNick + "\n\n*Avaliação da resposta:* " + itemRatingQuestion + " estrelas" + "\n\n*Curtidas:* " + itemThanksCount;
			console.log(final_result)
			console.log(question);
			console.log(answer);
		})


} catch (e) {
	console.log('Não foi possível executar a pesquisa no Brainly :(\n\nTente novamente');
}

const fs = require('fs')
const input = fs.readFileSync('./input.txt', 'utf8')
let j = 0;
var question = ""
var answer = ""

var object = {
	intermediate: []
}
var object2Add = {
	question: "",
	answers: {
		"1": false,
		"2": false,
		"3": false
	}
}

for (i of input.split('\n')) {
	j++
	if (j == 1) {
		question = i;
		object2Add.question = question;
	}
	if (j == 3) {
		answer = i.substr(8, i.length)
		object2Add.answers[answer] = true
	}
	if (j == 6) {
		j = 0;
		object.intermediate.push(object2Add)
		object2Add = {
			question: "",
			answers: {
				"1": false,
				"2": false,
				"3": false
			}
		}
	}
}
console.log(JSON.stringify(object, null, 2));
*/
