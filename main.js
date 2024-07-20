function getRandomBigIntInclusive(min, max) {
	const range = max - min + 1n;
	const bitsNeeded = range.toString(2).length;

	const bytesNeeded = Math.ceil(bitsNeeded / 8);
	const uint64sNeeded = Math.ceil(bytesNeeded / 8);
	const mask = (1n << BigInt(bitsNeeded)) - 1n;

	function getRandomUint64s(uint64sNeeded) {
		const buffer = new BigUint64Array(uint64sNeeded);
		crypto.getRandomValues(buffer);
		return buffer;
	}

	function bufferToBigInt(buffer) {
		let result = 0n;
		for (let i = 0; i < buffer.length; i++) {
			result = (result << 64n) | BigInt(buffer[i]);
		}
		return result;
	}

	let randomValue;
	do {
		const randomUint64s = getRandomUint64s(uint64sNeeded);
		randomValue = bufferToBigInt(randomUint64s) & mask;
	} while (randomValue >= range);

	return randomValue + min;
}

var valid = true;
const invalidMsg = "×";

function updateNumber(fromButton) {
	const minInput = document.getElementById("min");
	const maxInput = document.getElementById("max");
	const output = document.querySelector(".number-output");
	minInput.setCustomValidity("");
	maxInput.setCustomValidity("");
	valid = true;
	if (!(/^[0-9]*$/.test(minInput.value))) {
		minInput.setCustomValidity("Please enter an integer.");
		output.innerHTML = invalidMsg;
		valid = false;
	} else if (minInput.value === "") {
		if (fromButton) {
			minInput.setCustomValidity("Please enter an integer.");
		} else {
			minInput.setCustomValidity("");
		}
		
		output.innerHTML = invalidMsg;
		valid = false;
	} else {
		minInput.setCustomValidity("");
	}

	if (!(/^[0-9]*$/.test(maxInput.value))) {
		maxInput.setCustomValidity("Please enter an integer.");
		output.innerHTML = invalidMsg;
		valid = false;
	} else if (maxInput.value === "") {
		if (fromButton) {
			maxInput.setCustomValidity("Please enter an integer.");
		} else {
			maxInput.setCustomValidity("");
		}
		
		output.innerHTML = invalidMsg;
		valid = false;
	} else {
		maxInput.setCustomValidity("");
	}

	if (valid === true) {
		var minVal = minInput.value;
		var maxVal = maxInput.value;
		while (minVal.charAt(0) === "0") minVal = minVal.substring(1);
		while (maxVal.charAt(0) === "0") maxVal = maxVal.substring(1);
		const min = BigInt(minInput.value);
		const max = BigInt(maxInput.value);
		if (min < max) {
			const rand = BigInt(getRandomBigIntInclusive(min, max)).toString();
			output.innerHTML = rand;
		} else {
			minInput.setCustomValidity("Min must be less than max.");
			output.innerHTML = invalidMsg;
			valid = false;
		}
	}
	
	if (fromButton) {
		reportValidity();
	}
}

var latestTimeout;
function copyNumber() {
	const number = document.querySelector(".number-output").innerHTML;
	const copyBtn = document.getElementById("copyBtn");
		if (valid) {
			navigator.clipboard.writeText(number).then(() => {
				if (latestTimeout) clearTimeout(latestTimeout);
				copyBtn.innerHTML = "✔";
				latestTimeout = setTimeout(() => copyBtn.innerHTML = "Copy", 2500);
			});
		} else {
			if (latestTimeout) clearTimeout(latestTimeout);
			copyBtn.innerHTML = "✖";
			latestTimeout = setTimeout(() => copyBtn.innerHTML = "Copy", 2500);
		}
}

function reportValidity() {
	const minInput = document.getElementById("min");
	const maxInput = document.getElementById("max");
	maxInput.reportValidity();
	minInput.reportValidity();
}

window.addEventListener("load", updateNumber, {
	once: true
});

const updateBtn = document.getElementById("updateBtn");
updateBtn.addEventListener("click", () => updateNumber(true));

const copyBtn = document.getElementById("copyBtn");
copyBtn.addEventListener("click", copyNumber);

const minInput = document.getElementById("min");
const maxInput = document.getElementById("max");
minInput.addEventListener("input", () => updateNumber(false));
maxInput.addEventListener("input", () => updateNumber(false));
