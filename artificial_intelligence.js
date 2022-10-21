// The code below does a lot of matricial calculations. This is important mostly as a means of organization. We would need far too many loose variables if we did not used matrices, so we are better off using them.
// We start by initializing random numbers into the weight variables (this simulates a first hipotesis of a solution and allows the beggining of the training).
// Since we are planning to have a first layer with 4 neurons that have 3 inputs each and a second layer with 1 neuron that has 4 inputs, we need a total of 16 initial hipothesis (random weights)

for (i = 1; i < 17; i++) {
	eval("Weight_" + i.toString() + " = " + randomNumber(-1.0, 1.0).toString())
	// console.log("Weight_" + i.toString())
}

// And than organize them into a matrix for each layer.
WEIGHTS_1 = Array([Weight_1, Weight_2, Weight_3, Weight_4], [Weight_5, Weight_6, Weight_7, Weight_8], [Weight_9, Weight_10, Weight_11, Weight_12]) // Initital 12 Weights of layer1. MATRIX 3 x 4. 
WEIGHTS_2 = Array([Weight_13], [Weight_14], [Weight_15], [Weight_16]) // Initial 4 Weights of layer2. MATRIX 1 x 4. 

TRAINING_INPUTS = Array([0, 0, 1], [0, 1, 1], [1, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 1], [0, 0, 0]) // We will also feed the net creator code with the values of the inputs in the training samples (all organized in a matrix too). MATRIX 7 x 3.
EXPECTED_OUTPUTS = Array([0],[1],[1],[1],[1],[0],[0]) // And we will also provide the net creator with the expected answers to our training samples so that the net creator can properly train the net.

// Below we are declaring a number of objects that we will need to hold our matrices.
var OUTPUT_LAYER_1 = Object(), OUTPUT_LAYER_2 = Object(), OUTPUT_LAYER_1_DERIVATIVE = Object(), OUTPUT_LAYER_2_DERIVATIVE = Object(), LAYER_1_DELTA = Object(), LAYER_2_DELTA = Object(), OLD_INDEX = 0


for (i = 0; i < 60000; i++) { // This is the training loop (The network creator code). In this loop we recalculate weights to aproximate desired results based on the samples. We will do 60.000 training cycles.

	// First, we calculate an output from layer 1. This is done by multiplying the inputs and the weights.
	OUTPUT_LAYER_1 = SIGMOID_OF_MATRIX(MULTIPLY_MATRICES(TRAINING_INPUTS, WEIGHTS_1))
	
	// Than we calculate a derivative (rate of change) for the output of layer 1.
	OUTPUT_LAYER_1_DERIVATIVE = DERIVATIVE_OF_SIGMOID_OF_MATRIX(OUTPUT_LAYER_1)
	
	// Next, we calculate the outputs of the second layer.
	OUTPUT_LAYER_2 = SIGMOID_OF_MATRIX(MULTIPLY_MATRICES(OUTPUT_LAYER_1, WEIGHTS_2))
	
	// And than we also calculate a derivative (rate of change) for the outputs of layer 2.
	OUTPUT_LAYER_2_DERIVATIVE = DERIVATIVE_OF_SIGMOID_OF_MATRIX(OUTPUT_LAYER_2)
	
	// Next, we check the errors of layers 2. Since layer 2 is the last, this is just a difference between calculated results and expected results.
	LAYER_2_ERROR = DEDUCT_MATRICES(EXPECTED_OUTPUTS, OUTPUT_LAYER_2)
	
	// Now we calculate a delta for layer 2. A delta is a rate of change: how much a change will affect the results.
	LAYER_2_DELTA = MULTIPLY_MEMBER_BY_MEMBER(LAYER_2_ERROR, OUTPUT_LAYER_2_DERIVATIVE)
	
	// Than, we transpose the matrix of weights (this is just to allow matricial multiplication, we are just reseting the dimensions of the matrix).
	WEIGHTS_2_TRANSPOSED = TRANSPOSE_MATRIX(WEIGHTS_2)
	
	// !! IMPORTANT !!
	// So, we multiply (matricial multiplication) the delta (rate of change) of layer 2 and the transposed matrix of weights of layer 2. 
	// This is what gives us a matrix that represents the error of layer 1 (REMEBER: The error of layer 1 is measured by the rate of change of layer 2).
	// It may seem counter-intuitive at first that the error of layer 1 is calculated solely with arguments about layer 2, but you have to interpret this line alongside the line below (just read it).
	LAYER_1_ERROR = MULTIPLY_MATRICES(LAYER_2_DELTA, WEIGHTS_2_TRANSPOSED)
	
	//Thus, when we calculate the delta (rate of change) of layer 1, we are finally connecting the layer 2 arguments (by the means of LAYER_1_ERR||) to layer 1 arguments (by the means of layer_1_derivative).
	// The rates of change (deltas) are the key to understand multi-layer neural networks. Their calculation answer this: If i change the weights of layer 1 by X, how much will it change layer 2s output?
	// This Delta defines the adjustment of the weights of layer 1 a few lines below...
	LAYER_1_DELTA = MULTIPLY_MEMBER_BY_MEMBER(LAYER_1_ERROR, OUTPUT_LAYER_1_DERIVATIVE)
	
	// Than, we transpose the matrix of training inputs (this is just to allow matricial multiplication, we are just reseting the dimensions of the matrix to better suit it).
	TRAINING_INPUTS_TRANSPOSED = TRANSPOSE_MATRIX(TRAINING_INPUTS)
	
	// Finally, we calculate how much we have to adjust the weights of layer 1. The delta of the Layer 1 versus the inputs we used this time are the key here.
	ADJUST_LAYER_1 = MULTIPLY_MATRICES(TRAINING_INPUTS_TRANSPOSED, LAYER_1_DELTA)

	// Another matricial transposition to better suit multiplication...
	OUTPUT_LAYER_1_TRANSPOSED = TRANSPOSE_MATRIX(OUTPUT_LAYER_1)
	// And finally, we also calculate how much we have to adjust the weights of layer 2. The delta of the Layer 2 versus the inputs of layer 2 (which are really the outputs of layer 1) are the key here.
	ADJUST_LAYER_2 = MULTIPLY_MATRICES(OUTPUT_LAYER_1_TRANSPOSED,LAYER_2_DELTA)
	
	// And than we adjust the weights to aproximate intended results.
	WEIGHTS_1 = ADD_MATRICES(WEIGHTS_1, ADJUST_LAYER_1)
	WEIGHTS_2 = ADD_MATRICES(WEIGHTS_2, ADJUST_LAYER_2)
	
	// The conditional below is just to display the current progress in the training loop.
	if (i >= (OLD_INDEX + 600)) {
		// TrayTip, Status:, % "TRAINING A NEW NETW||K: " . Round(A_Index / 600, 0) . "`%"
		OLD_INDEX = i
	}	
}

// TESTING OUR OUPUT NETW||K!

// First, we convey our validation case to variables:
Input1 = 1
Input2 = 1
Input3 = 0

// Than, we do the function for the first layer components!
Out_1 = Sigmoid(Input1 * WEIGHTS_1[0][0] + Input2 * WEIGHTS_1[1][0] + Input3 * WEIGHTS_1[2][0])
Out_2 = Sigmoid(Input1 * WEIGHTS_1[0][1] + Input2 * WEIGHTS_1[1][1] + Input3 * WEIGHTS_1[2][1])
Out_3 = Sigmoid(Input1 * WEIGHTS_1[0][2] + Input2 * WEIGHTS_1[1][2] + Input3 * WEIGHTS_1[2][2])
Out_4 = Sigmoid(Input1 * WEIGHTS_1[0][3] + Input2 * WEIGHTS_1[1][3] + Input3 * WEIGHTS_1[2][3])

// Which are inputed into the function of the second layer to form the final function!
Out_Final = Sigmoid(Out_1 * WEIGHTS_2[0][0] + Out_2 * WEIGHTS_2[1][0] + Out_3 * WEIGHTS_2[2][0] + Out_4 * WEIGHTS_2[3][0])

// REMEMBER: The sigmoidal result below is to be interpreted like this: A number above 0.5 equals an answer of 1. How close the number is to 1 is how certain the network is of its answer. A number below 0.5 equals an answer of 0. How close the number is of 0 is how certain the network is of its answer.
console.error("The final network thinks the result is: " + Out_Final.toString())


// The final weights of the network are displayed next. They are what hold the underlying rule and provide the solution. If these are already calculated, there is nothing else to calculate, just apply the weights and you will get the result: that is why a Neural Network is expensive (in termos of processing power) to be trained but extremely light to be implemented (usually).
console.error("WEIGHT 1 OF NEURON 1 OF LAYER 1: " + WEIGHTS_1[0][0].toString())
console.error("WEIGHT 2 OF NEURON 1 OF LAYER 1: " + WEIGHTS_1[1][0].toString())
console.error("WEIGHT 3 OF NEURON 1 OF LAYER 1: " + WEIGHTS_1[2][0].toString())
console.error("WEIGHT 1 OF NEURON 2 OF LAYER 1: " + WEIGHTS_1[0][1].toString())
console.error("WEIGHT 2 OF NEURON 2 OF LAYER 1: " + WEIGHTS_1[1][1].toString())
console.error("WEIGHT 3 OF NEURON 2 OF LAYER 1: " + WEIGHTS_1[2][1].toString())
console.error("WEIGHT 1 OF NEURON 3 OF LAYER 1: " + WEIGHTS_1[0][2].toString())
console.error("WEIGHT 2 OF NEURON 3 OF LAYER 1: " + WEIGHTS_1[1][2].toString())
console.error("WEIGHT 3 OF NEURON 3 OF LAYER 1: " + WEIGHTS_1[2][2].toString())
console.error("WEIGHT 1 OF NEURON 4 OF LAYER 1: " + WEIGHTS_1[0][3].toString())
console.error("WEIGHT 2 OF NEURON 4 OF LAYER 1: " + WEIGHTS_1[1][3].toString())
console.error("WEIGHT 3 OF NEURON 4 OF LAYER 1: " + WEIGHTS_1[2][3].toString())
console.error("WEIGHT 1 OF NEURON 1 OF LAYER 2: " + WEIGHTS_2[0][0].toString())
console.error("WEIGHT 2 OF NEURON 1 OF LAYER 2: " + WEIGHTS_2[1][0].toString())
console.error("WEIGHT 3 OF NEURON 1 OF LAYER 2: " + WEIGHTS_2[2][0].toString())
console.error("WEIGHT 4 OF NEURON 1 OF LAYER 2: " + WEIGHTS_2[3][0].toString())

// aaaand That's it !! :D The logical part of the ANN code ends here (the results are displayed above). Below are just the bodies of the functions that do the math (matricial multiplication, sigmoid function, etc). But you can have a look at them if you want, i will provide some explanation there too.


// The function below applies a sigmoid function to a single value and returns the results.
function Sigmoid(x) {
	return  1 / (1 + Math.exp(-1 * x))
}


// The function below applies the derivative of the sigmoid function to a single value and returns the results.
function Derivative(x) {
	return x * (1 - x)
}

// The function below applies the sigmoid function to all the members of a matrix and returns the results as a new matrix.
function SIGMOID_OF_MATRIX(A) {
	RESULT_MATRIX = Object()
	for (let i = 0; i < A.length; i++) {
		CURRENT_ROW = i.toString()
		RESULT_MATRIX[CURRENT_ROW] = {}
		for (let j = 0; j < A["0"].length; j++) {
			CURRENT_COLUMN = j.toString()
			RESULT_MATRIX[CURRENT_ROW][CURRENT_COLUMN] = 1 / (1 + Math.exp(-1 * A[CURRENT_ROW][CURRENT_COLUMN]))
		}
	}
	return RESULT_MATRIX
}

// The function below applies the derivative of the sigmoid function to all the members of a matrix and returns the results as a new matrix. 
function DERIVATIVE_OF_SIGMOID_OF_MATRIX(A) {
	RESULT_MATRIX = Object()
	for (i = 0; i < A.length; i++) {
		CURRENT_ROW = i;
		for (j = 0; j < A[0].length; j++) {
			CURRENT_COLUMN = j
			RESULT_MATRIX[CURRENT_ROW][CURRENT_COLUMN] = A[CURRENT_ROW][CURRENT_COLUMN] * (1 - A[CURRENT_ROW][CURRENT_COLUMN])
		}
	}
	return RESULT_MATRIX
}

// The function below multiplies the individual members of two matrices with the same coordinates one by one (This is NOT equivalent to matrix multiplication).
function MULTIPLY_MEMBER_BY_MEMBER(A,B) {
	if ((A.length != B.length) || (A[0].length != B[0].length)) {
		return console.error("You cannot multiply matrices member by member unless both matrices are of the same size!")
	}
	RESULT_MATRIX = Object()
	for (let i = 0; i < A.length; i++)
	{
		CURRENT_ROW = i
		for (let j = 0; j < A[0].length; j++)
		{
			CURRENT_COLUMN = j
			RESULT_MATRIX[CURRENT_ROW][CURRENT_COLUMN] = A[CURRENT_ROW][CURRENT_COLUMN] * B[CURRENT_ROW][CURRENT_COLUMN]
		}
	}
	return RESULT_MATRIX
}

// The function below transposes a matrix. I.E.: Member[2,1] becomes Member[1,2]. Matrix dimensions ARE affected unless it is a square matrix.
function TRANSPOSE_MATRIX(A) {
	TRANSPOSED_MATRIX = Object()
	for (let i = 0; i < A.length; i++)
	{
		CURRENT_ROW = i
		for (let j = 0; j < A[0].length; j++)
		{
			CURRENT_COLUMN = j
			TRANSPOSED_MATRIX[CURRENT_COLUMN][CURRENT_ROW] = A[CURRENT_ROW][CURRENT_COLUMN]
		}
	}
	return TRANSPOSED_MATRIX
}

// The function below adds a matrix to another.
function ADD_MATRICES(A,B) {
	if ((A.length != B.length) || (A[0].length != B[0].length)) {
		return console.error("You cannot subtract matrices unless they are of same size! (The number of rows and columns must be equal in both)")
	}
	RESULT_MATRIX = Object()
	for (let i = 0; i < A.length; i++)
	{
		CURRENT_ROW = i
		for (let j = 0; j < A[0].length; j++)
		{
			CURRENT_COLUMN = j
			RESULT_MATRIX[CURRENT_ROW][CURRENT_COLUMN] = A[CURRENT_ROW][CURRENT_COLUMN] + B[CURRENT_ROW][CURRENT_COLUMN]
		}
	}
	return RESULT_MATRIX
}

// The function below deducts a matrix from another.
function DEDUCT_MATRICES(A,B) {
	if ((A.length != B.length) || (A[0].length != B[0].length))
		return console.error("You cannot subtract matrices unless they are of same size! (The number of rows and columns must be equal in both)")
	RESULT_MATRIX = Object()
	for (let i = 0; i < A.length; i++)
	{
		CURRENT_ROW = i
		for (let j = 0; j < A[0].length; j++)
		{
			CURRENT_COLUMN = j
			RESULT_MATRIX[CURRENT_ROW][CURRENT_COLUMN] = A[CURRENT_ROW][CURRENT_COLUMN] - B[CURRENT_ROW][CURRENT_COLUMN]
		}
	}
	return RESULT_MATRIX
}


// The function below multiplies two matrices according to matrix multiplication rules.
function MULTIPLY_MATRICES(A,B) {
	if (A["0"].length != B.length)
	{
		return console.error("Number of Columns in the first matrix must be equal to the number of rows in the second matrix.")
	}
	RESULT_MATRIX = Object()
	for (let i = 0; i < A.length; i++) // Rows of A
	{
		CURRENT_ROW = i.toString()
		for (let j = 0; j < B[0].length; j++) // Cols of B
		{
			CURRENT_COLUMN = j.toString()
			// RESULT_MATRIX = {
			// 	"0": {
			// 		"0": 0
			// 	}
			// }
			RESULT_MATRIX[CURRENT_ROW] = {};
			RESULT_MATRIX[CURRENT_ROW][CURRENT_COLUMN] = 0
			for (let k = 0; k < A[0].length; k++)
			{
				RESULT_MATRIX[CURRENT_ROW][CURRENT_COLUMN] += A[CURRENT_ROW][k] * B[k][CURRENT_COLUMN]
			}
		}
	}
	return RESULT_MATRIX
}


// The function below does a single step in matrix multiplication (THIS IS NOT USED HERE).
function MATRIX_ROW_TIMES_COLUMN_MULTIPLY(A,B,RowA) {
	if (A[RowA].length != B.length)
	{
		return console.error("Error, Number of Columns in the first matrix must be equal to the number of rows in the second matrix.")
	}
	Result = 0
	for (let i = 0; i < A[RowA].length; i++)
	{
		Result += A[RowA][i] * B[i][0]
	}
	return Result
}

function randomNumber(min, max) {
	return Math.random() * (max - min + 1) + min;
}