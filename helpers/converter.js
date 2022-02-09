const idx = require('./bcd-indexes.js');			// Index constants

/*
	Note: Code to replace and insert substrings inside a string
	@params 	{integer} 	index 			- Index to replace
	@params 	{string} 	repalcement 	- String to replace
	
*/
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

/*
	Note: Redundant Code to replace certain indexes in a binary decimal string
		  Variable names are based on the Densly Packed BCD table given during lectures
*/
function setDecimalFields(dec, AEI, B, C, F, G, J, K) {
	var res = dec;

	res = res.replaceAt(idx.A, AEI[0]);
	res = res.replaceAt(idx.E, AEI[1]);
	res = res.replaceAt(idx.I, AEI[2]);

	res = res.replaceAt(idx.B, B);
	res = res.replaceAt(idx.C, C);

	res = res.replaceAt(idx.F, F);
	res = res.replaceAt(idx.G, G);

	res = res.replaceAt(idx.J, J);
	res = res.replaceAt(idx.K, K);

	return res;
}

const Converter = {
	/*
		@params 	{string} 	hex
		@returns 	{string}

		Converts a Hexdecimal to it's binary string equivalent 
	*/
	convertHexToBinary: (hex) => {
		return parseInt(hex, 16).toString(2);
	},

	/*
		@params 	{integer} 	dec
		@returns 	{string}

		Converts a decimal to it's binary string equivalent 
	*/
	convertDecimalToBinary: (dec) => {
		if (!isNaN(dec)) {
			return (dec >>> 0).toString(2);
		}
	},

	/*
		@params 	{string} 	bin
		@returns 	{string}
	
		Converts a binary string to it's decimal equivalent
	*/
	convertBinaryToDecimal: (bin) => {
		return parseInt(bin, 2).toString();
	},

	/*
		@params		{string} 	bin 	- Binary String to pad
		@params 	{integer}	bits    - total number of bits of the resulting padded binary string

		Pads zeroes to the given binary string
	*/
	padZeroBinary: (bin, bits) => {
		return (bits < bin.length) ? new Error('Binary string parameter is shorter than total bits parameter!') : '0'.repeat(bits - bin.length) + bin;
	},

	convertDPBCDToDecimal: (bcd) => {	
		var dec = 'XXXXYYYYZZZZ';							// Decimal Output in Binary Representation	
		
		// D H M Case
		dec = dec.replaceAt(idx.D, bcd[idx.R]);
		dec = dec.replaceAt(idx.H, bcd[idx.U]);
		dec = dec.replaceAt(idx.M, bcd[idx.Y]);

		// A E I Case
		const case_id = bcd[idx.V] + bcd[idx.W] + bcd[idx.X];

		if (bcd[idx.V] == '0') {																							 			// Case 000 (AEI)
			dec = setDecimalFields(dec, '000', bcd[idx.P], bcd[idx.Q], bcd[idx.S], bcd[idx.T], bcd[idx.W], bcd[idx.X]);
		} else {
			switch (case_id) {
				case '100': dec = setDecimalFields(dec, '001', bcd[idx.P], bcd[idx.Q], bcd[idx.S], bcd[idx.T], '0', '0');				// Case 001 (AEI)
					break;
				case '101': dec = setDecimalFields(dec, '010', bcd[idx.P], bcd[idx.Q], '0', '0', bcd[idx.S], bcd[idx.T]);				// Case 010 (AEI)
					break;
				case '110': dec = setDecimalFields(dec, '100', '0', '0', bcd[idx.S], bcd[idx.T], bcd[idx.P], bcd[idx.Q]);				// Case 100 (AEI)
					break;
				case '111':
							switch(bcd[idx.S] + bcd[idx.T]) {
								case '10': dec = setDecimalFields(dec, '011', bcd[idx.P], bcd[idx.Q], '0', '0', '0', '0');				// Case 011 (AEI)
									break;
								case '01': dec = setDecimalFields(dec, '101', '0', '0', bcd[idx.P], bcd[idx.Q], '0', '0');				// Case 101 (AEI)
									break;
								case '00': dec = setDecimalFields(dec, '110', '0', '0', '0', '0', bcd[idx.P], bcd[idx.Q]);				// Case 110 (AEI)
									break;
								case '11': dec = setDecimalFields(dec, '111', '0', '0', '0', '0', '0', '0');							// Case 111 (AEI)
									break;
							}
			}	
		}

		var d1 = Converter.convertBinaryToDecimal(dec.substring(0, 4));
		var d2 = Converter.convertBinaryToDecimal(dec.substring(4, 8));
		var d3 = Converter.convertBinaryToDecimal(dec.substring(8, 12));

		return d1 + d2 + d3;
	},

	/*
		@params		{string} 	combo 	- combinational component of a binary decimal
		@params		{string} 	expcon 	- expo contiuation of a binary decimal 
		@params 	{array}				-  
		
		Converts a given comboinational and exponent continuation to its non-compressed format
	*/
	convertCombinationToMSDAndExp: (combo, expcon) => {
		switch (combo) {
			case '11111': return ['NaN', '0'];
			case '11110': return ['Inf', '0'];
			default:
					if (combo.substring(0, 2) == '11') {				// 8-9 Case
						var msd = '100' + combo[4];						// e
						var exp =  combo[2] + combo[3] + expcon;		// c d
						return [msd, exp];

					} else {											// 0-7 Case
						var msd = '0' + combo[2] + combo[3] + combo[4]; // c d e
						var exp = combo[0] + combo[1] + expcon;			// a b
						return [msd, exp];
					}
		}
	},

	/*
		@params		{string} 	bin  	- combinational component of a binary decimal
		@params 	{string}			
		
		Converts a given 64 bit decimal floating point to it's decimal equivalent
	*/
	convertFloatingPointDecimalToDecimal: (bin) => {
		// Sign
		var sig = (bin[0] == 0) ? '+' : '-';

		// Most Significant Digit 
		var val = Converter.convertCombinationToMSDAndExp(bin.substring(1, 6), bin.substring(6, 14));
		var msd = Converter.convertBinaryToDecimal(val[0]);

		// Exponent
		var exp = parseInt(Converter.convertBinaryToDecimal(val[1]), 10) - 398;

		// Coefficient Continuation
		var cf1 = Converter.convertDPBCDToDecimal(bin.substring(14, 24));						
		var cf2 = Converter.convertDPBCDToDecimal(bin.substring(24, 34));
		var cf3 = Converter.convertDPBCDToDecimal(bin.substring(34, 44));
		var cf4 = Converter.convertDPBCDToDecimal(bin.substring(44, 54));
		var cf5 = Converter.convertDPBCDToDecimal(bin.substring(54, 64));

		return sig + msd + cf1 + cf2 + cf3 + cf4 + cf5 + ' x10^' + exp;
	}
}

module.exports = Converter;

// console.log(Converter.convertFloatingPointDecimalToDecimal('0011111010001010101100010010100011100101011010111101001000100110'));
// console.log(Converter.convertFloatingPointDecimalToDecimal('1110100111101011111001011000110100011100010111011110000010000000'));

// 0011111010001010101100010010100011100101011010111101001000100110 = 7531123456574426 x 10^20
// 1110100111101011111001011000110100011100010111011110000010000000 = -8765432345678100 x 10-20




