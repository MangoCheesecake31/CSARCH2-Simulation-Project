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
		@returns 	{stroing}
	
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
	}
}

module.exports = Converter;

// Tests
// console.log(Converter.convertDPBCDToDecimal('0010011001'));			// 119
// console.log(Converter.convertDPBCDToDecimal('0001000100'));			// 044
// console.log(Converter.convertDPBCDToDecimal('0011111111'));			// 999
// console.log(Converter.convertDPBCDToDecimal('0000000001'));			// 001
// console.log(Converter.convertDPBCDToDecimal('1001010110'));			// 456
// console.log(Converter.convertDPBCDToDecimal('1111101000'));			// 768















