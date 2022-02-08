String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const Converter = {
	/*
		@params 	{integer} 	digit
		@returns 	{string}

		Converts a single digit to it's binary equivalent in 4 binary digit format
		Throws an exception whenever the parameter is not a single decimal digit
	*/
	convertDigitToBinary: (digit) => {
		if (Number.isInteger(digit) && 0 <= digit && digit < 10 ) {
			let bin = (digit >>> 0).toString(2);		
			return '0'.repeat(4 - bin.length) + (bin);
		} else {
			return new Error('Invalid Digit Exception [Custom]');
		}
	},

	/*
		@params 	{integer}	d1
		@params 	{integer}	d2
		@params 	{integer}	d3
		@returns 	{string}

		Converts 3 decimal digits to it's densely packed BCD equivalent
		Throws an exception whenever a parameter is not a single decimal digit

		Note: variable indexes are based on the Densely Packed BCD table show during lectures
	*/

	convertDecimalToDPBCD: (d1, d2, d3) => {
		let d1bin = Converter.convertDigitToBinary(d1);
		let d2bin = Converter.convertDigitToBinary(d2);
		let d3bin = Converter.convertDigitToBinary(d3);

		var inputs = d1bin + d2bin + d3bin;									// Decimal Input in Binary Representation		
		var output = 'PQRSTUVWXY';											// Densely Packed BCD Default Representation
		const idx = require('./bcd-indexes.js');							// Index constants
		const id = inputs[idx.A] + inputs[idx.E] + inputs[idx.I];			// Case ID (A E I); used to indicate which case in the Densely Packed BCD table

		// R U Y Case
		output = output.replaceAt(idx.R, inputs[idx.D]);
		output = output.replaceAt(idx.U, inputs[idx.H]);
		output = output.replaceAt(idx.Y, inputs[idx.M]);

		// V Case
		output = (id == '000') ? output.replaceAt(idx.V, '0') : output.replaceAt(idx.V, '1');

		// P Q S T W X Case
		switch (id) {
			case '000': 
						output = output.replaceAt(idx.P, inputs[idx.B]);
						output = output.replaceAt(idx.Q, inputs[idx.C]);
						output = output.replaceAt(idx.S, inputs[idx.F]);
						output = output.replaceAt(idx.T, inputs[idx.G]);
						output = output.replaceAt(idx.W, inputs[idx.J]);
						output = output.replaceAt(idx.X, inputs[idx.K]);
				break;
			case '001': 
						output = output.replaceAt(idx.P, inputs[idx.B]);
						output = output.replaceAt(idx.Q, inputs[idx.C]);
						output = output.replaceAt(idx.S, inputs[idx.F]);
						output = output.replaceAt(idx.T, inputs[idx.G]);
						output = output.replaceAt(idx.W, '0');
						output = output.replaceAt(idx.X, '0');
				break;
			case '010': 
						output = output.replaceAt(idx.P, inputs[idx.B]);
						output = output.replaceAt(idx.Q, inputs[idx.C]);
						output = output.replaceAt(idx.S, inputs[idx.J]);
						output = output.replaceAt(idx.T, inputs[idx.K]);
						output = output.replaceAt(idx.W, '0');
						output = output.replaceAt(idx.X, '1');
				break;
			case '011': 
						output = output.replaceAt(idx.P, inputs[idx.B]);
						output = output.replaceAt(idx.Q, inputs[idx.C]);
						output = output.replaceAt(idx.S, '1');
						output = output.replaceAt(idx.T, '0');
						output = output.replaceAt(idx.W, '1');
						output = output.replaceAt(idx.X, '1');
				break;
			case '100': 
						output = output.replaceAt(idx.P, inputs[idx.J]);
						output = output.replaceAt(idx.Q, inputs[idx.K]);
						output = output.replaceAt(idx.S, inputs[idx.F]);
						output = output.replaceAt(idx.T, inputs[idx.G]);
						output = output.replaceAt(idx.W, '1');
						output = output.replaceAt(idx.X, '0');
				break;
			case '101': 
						output = output.replaceAt(idx.P, inputs[idx.F]);
						output = output.replaceAt(idx.Q, inputs[idx.G]);
						output = output.replaceAt(idx.S, '0');
						output = output.replaceAt(idx.T, '1');
						output = output.replaceAt(idx.W, '1');
						output = output.replaceAt(idx.X, '1');
				break;
			case '110': 
						output = output.replaceAt(idx.P, inputs[idx.J]);
						output = output.replaceAt(idx.Q, inputs[idx.K]);
						output = output.replaceAt(idx.S, '0');
						output = output.replaceAt(idx.T, '0');
						output = output.replaceAt(idx.W, '1');
						output = output.replaceAt(idx.X, '1');
				break;
			case '111': 
						output = output.replaceAt(idx.P, '0');
						output = output.replaceAt(idx.Q, '0');
						output = output.replaceAt(idx.S, '1');
						output = output.replaceAt(idx.T, '1');
						output = output.replaceAt(idx.W, '1');
						output = output.replaceAt(idx.X, '1');
				break;
		}

		return output;
	}
}

module.exports = Converter;