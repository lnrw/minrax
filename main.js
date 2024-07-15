function getRandomBigIntInclusive(min, max) {
	if (min > max) {
		throw new Error('The minimum value must be less than or equal to the maximum value.');
	}

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

function updateNumber() {
	const minInput = document.getElementById("min");
	const maxInput = document.getElementById("max");
	const numDiv = document.querySelector(".random-number");
	var valid = true;
	if (/\p{L}|^$/u.test(minInput.value)) {
		minInput.setCustomValidity("Please enter a number.");
		numDiv.innerHTML = "!";
		valid = false;
	} else {
		minInput.setCustomValidity("");
	}

	if (/\p{L}|^$/u.test(maxInput.value)) {
		maxInput.setCustomValidity("Please enter a number.");
		numDiv.innerHTML = "!";
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
			numDiv.innerHTML = rand;
		} else {
			minInput.setCustomValidity("Min must be less than max.");
			numDiv.innerHTML = "!";
		}
	}
}

function copyNumber() {
	const number = document.querySelector(".random-number").innerHTML;
	const copyBtn = document.getElementById("copyBtn");
	if (copyBtn.innerHTML === "Copy") {
		if (number !== "!") {
			navigator.clipboard.writeText(number).then(() => {
				if (copyBtn.innerHTML === "Copy") {
					copyBtn.innerHTML = "&#x2714;&#xFE0F;";
					setTimeout(() => copyBtn.innerHTML = "Copy", 2500);
				}
			});
		} else {
			copyBtn.innerHTML = "&#x274C;";
			setTimeout(() => copyBtn.innerHTML = "Copy", 2500);
		}
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
updateBtn.addEventListener("click", () => {
	reportValidity();
	updateNumber();
});

const copyBtn = document.getElementById("copyBtn");
copyBtn.addEventListener("click", copyNumber);

const minInput = document.getElementById("min");
const maxInput = document.getElementById("max");
minInput.addEventListener("input", updateNumber);
maxInput.addEventListener("input", updateNumber);
