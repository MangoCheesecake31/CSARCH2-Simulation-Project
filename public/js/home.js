import { Converter } from './converter.js';

window.onload = () => {
	const binDiv = document.getElementById('64-bit-binary')
	const hexDiv = document.getElementById('16-digit-hex')
	let isBin = false

	const switchBtn = document.getElementById('switch-btn')

	switchBtn.addEventListener('click', () => {
		if (isBin) {
			switchBtn.innerHTML = 'Switch to Bin Input'
			binDiv.style.display = 'none'
			hexDiv.style.display = 'block'
		} else {
			switchBtn.innerHTML = 'Switch to Hex Input'
			binDiv.style.display = 'block'
			hexDiv.style.display = 'none'
		}
		isBin = !isBin
	})

	function display_output(){
		console.log("Hello World")
		var p = document.getElementById("output_message");
		p.style.display ="block";
	}
	var cleave = new Cleave('#exponent', {
		blocks: [4, 4]
	});
	var cleave = new Cleave('#coefficient', {
		blocks: [10, 10, 10, 10, 10]
	});
}

$(document).ready(() => {

});