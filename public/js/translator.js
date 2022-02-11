function outputDecimalOfBinary(){
    var signBit = $('#sign-bit').val();
    var combiField = $('#combination').val();
    var expoField = $('#exponent').val();
    var coefficient = $('#coefficient').val();

    expoField = expoField.replace(/\s+/g, '');
    coefficient = coefficient.replace(/\s+/g, '');


    var decimalOutput = translateBinaryToDecimal(signBit, combiField, expoField, coefficient);

    console.log("Decimal Output: " + decimalOutput); //TODO: REMOVE

    $('#output_message').text(decimalOutput);
    $('#output_message').css("display", "block");
}


function translateBinaryToDecimal(signBit, combiField, expoField, coefficient){
     var accumulator = 0;
     var leastBCD = coefficient.slice(-10); // slice the Least BCD

     console.log("leastBCD : " + leastBCD); //TODO: REMOVE
     var DecLeastBCD = parseInt(Converter.convertDPBCDToDecimal(leastBCD)); // parse to int the sliced BCD

     console.log("DecLeastBCD : " + DecLeastBCD); //TODO: REMOVE

     accumulator += DecLeastBCD; // add to accumulator

     console.log("accumulator rn : " + accumulator); //TODO: REMOVE

    for(let i = 2; i < 6; i++)
    {
        var subBCD = coefficient.slice(-10 * i, -10 * (i-1)); //slice the next BCD. First iter is -20 to -10
        console.log("subBCD : " + subBCD); //TODO: REMOVE
        var DecSubBCD = parseInt(Converter.convertDPBCDToDecimal(subBCD)); // parse int the sliced BCD
        console.log("DecSubBCD : " + DecSubBCD); //TODO: REMOVE
        accumulator += (DecSubBCD * Math.pow(1000, i-1)); // add to accumulator
        console.log("accumulator after DecSubBCD : " + accumulator); //TODO: REMOVE

    }

    // get most significant digit and exponent
    var MSDandExp = Converter.convertCombinationToMSDAndExp(combiField, expoField);

    if(MSDandExp[0] == 'NaN'){
       return MSDandExp[0];
    }
    else if(MSDandExp[0] == 'Infinity'){
        if(signBit == '1'){
            return '-' + MSDandExp[0];
        }
        return MSDandExp[0];
    }
    console.log("MSD and EXP : " + MSDandExp); //TODO: REMOVE
    var MSD = Converter.convertBinaryToDecimal(MSDandExp[0]);

    console.log("MSD: " + MSD); //TODO: REMOVE
    accumulator = parseInt(MSD.concat(accumulator.toString())); //add MSD in front of accumulator
    console.log("accumulator now: " + accumulator); //TODO: REMOVE
    var exponent = parseInt(Converter.convertBinaryToDecimal(MSDandExp[1])) - 398;
    console.log("exponent: " + exponent); //TODO: REMOVE

    var multiplier = Math.pow(10, exponent);
    console.log("multiplier: " + multiplier); //TODO: REMOVE
    accumulator = accumulator * multiplier;
    console.log("accumulator: " + multiplier); //TODO: REMOVE
    accumulator = accumulator * (1 - (2 * signBit)); // multiply by sign bit

    return accumulator;
}

function outputDecimalOfHex(){

    var hexInput = $('#hex-input').val();
    console.log("Hex input: " + hexInput);
    var binaryInput = Converter.convertHexToBinary(hexInput);
    var paddedBinary = binaryInput.padStart(64,'0');

    console.log("binaryInput: " + binaryInput);
    console.log("paddedBinary: " + paddedBinary);


    var signBit = paddedBinary[0];
    var combiField = paddedBinary.slice(1,6);
    var expoField = paddedBinary.slice(6,14);
    var coefficient = paddedBinary.slice(14);

    console.log("MSD: " + signBit + "/n"); //TODO: REMOVE
    console.log("combiField: " + combiField + "/n"); //TODO: REMOVE
    console.log("expoField: " + expoField + "/n"); //TODO: REMOVE
    console.log("coefficient: " + coefficient + "/n"); //TODO: REMOVE

    translateBinaryToDecimal(signBit,combiField,expoField,coefficient);

     var decimalOutput = translateBinaryToDecimal(signBit, combiField, expoField, coefficient);

     console.log("Decimal Output: " + decimalOutput); //TODO: REMOVE

     $('#output_message').text(decimalOutput);
     $('#output_message').css("display", "block");
     //document.getElementById('ouput_copypaste').style.display = 'block';
     //$('ouput_copypaste').css("display", "block");

}

function copyPaste(){
    document.getElementById('output_copypaste').onclick = function(){
        navigator.clipboard.writeText(document.getElementById('output_message').innerText)
        .then(function() {
            console.log('text copied')
        })
    }



}


