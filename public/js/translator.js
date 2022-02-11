function outputDecimalOfBinary(){

    if(validateBinaryInput()){
        var signBit = $('#sign-bit').val();
        var combiField = $('#combination').val();
        var expoField = $('#exponent').val();
        var coefficient = $('#coefficient').val();

        expoField = expoField.replace(/\s+/g, '');
        coefficient = coefficient.replace(/\s+/g, '');


        var decimalOutput = translateBinaryToDecimal(signBit, combiField, expoField, coefficient);

        if($('#fixed_point_bin').prop('checked')){
           var decimalPlaces = parseInt($("#dropdown_bin :selected").val());
           decimalOutput = Number.parseFloat(decimalOutput).toFixed(decimalPlaces);
        }
        console.log("Decimal Output: " + decimalOutput); //TODO: REMOVE

        $('#output_message').text(decimalOutput);
        $('#output_message').css("display", "block");
    }
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

    if(validateHexInput()){
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


         if($('#fixed_point').prop('checked')){
            var decimalPlaces = parseInt($("#dropdown :selected").val());
            decimalOutput = Number.parseFloat(decimalOutput).toFixed(decimalPlaces);
         }

     $('#output_message').text(decimalOutput);
     $('#output_message').css("display", "block");
     }

}

function copyPaste(){

    document.getElementById('output_copypaste').onclick = function(){
        navigator.clipboard.writeText(document.getElementById('output_message').innerText)
        .then(function() {
            console.log('text copied')
        })
    }
}

function validateHexInput(){
    var hexInput =  $('#hex-input').val();
    var inputLen = hexInput.length;

    $('#output_message').css("display", "none");
    if (inputLen < 16){
      $('#output_message').text("Insufficient digits.");
      $('#output_message').css("display", "block");
      return false;
    }
    var binaryInput = Converter.convertHexToBinary(hexInput);
    if(binaryInput.includes("NaN")){
        $('#output_message').text("Invalid Hex Digits.");
        $('#output_message').css("display", "block");
        return false;
    }
    return true;
}

function validateBinaryInput(){
    var signBit = $('#sign-bit').val();
    var combiField = $('#combination').val();
    var expoField = $('#exponent').val();
    var coefficient = $('#coefficient').val();

    expoField = expoField.replace(/\s+/g, '');
    coefficient = coefficient.replace(/\s+/g, '');

     console.log("signBit: " + signBit);
     console.log("signBit: " + combiField);
     console.log("signBit: " + expoField);
     console.log("signBit: " + coefficient);


    if(signBit.length < 1){
         $('#output_message').text("Insufficient digits at Sign Bit");
         $('#output_message').css("display", "block");
         return false;
    }
    if(combiField.length < 5){
         $('#output_message').text("Insufficient digits at Combination Field");
         $('#output_message').css("display", "block");
         return false;
    }
    if(expoField.length < 8){
          $('#output_message').text("Insufficient digits at Exponent Continuation");
          $('#output_message').css("display", "block");
          return false;
    }
    if(coefficient.length < 50){
          $('#output_message').text("Insufficient digits at Coefficient Continuation");
          $('#output_message').css("display", "block");
          return false;
    }
    if(!checkIfBinary(signBit)){
          $('#output_message').text("Sign bit is not binary.");
          $('#output_message').css("display", "block");
          return false;
    }
    if(!checkIfBinary(combiField)){
           $('#output_message').text("Combination Field is not binary.");
           $('#output_message').css("display", "block");
           return false;
    }
    if(!checkIfBinary(expoField)){
           $('#output_message').text("Exponent Continuation is not binary.");
           $('#output_message').css("display", "block");
           return false;
    }
    if(!checkIfBinary(coefficient)){
            $('#output_message').text("Coefficient Combination is not binary.");
            $('#output_message').css("display", "block");
            return false;
    }

    return true;
}


function checkIfBinary(str) {
  let isBinary = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "0" || str[i] == "1") {
      isBinary = true;
    } else {
      return false;
    }
  }
  return isBinary;
}


