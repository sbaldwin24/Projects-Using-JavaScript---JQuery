let fib = (() => {
	let memo = {};

	function f(n) {
		let value;

		if (n in memo) {
			value = memo[n];
		} else {
			if (n === 0 || n === 1) {
				value = n;
			} else {
				value = f(n - 1) + f(n - 2);
				memo[n] = value;
			}
		}

		return value;
	}

	return f;
})();

const calc = document.querySelector('.calculate');

calc.addEventListener('click', (e) => {
	e.preventDefault();

	let inputValue = document.querySelector('input').value;
	let listItem = document.createElement('li');

	let x = Number(inputValue);
	x = fib(x);
	let result = document.createTextNode(`${inputValue} is equal to ${x}`);

	listItem.prepend(result);
	document.querySelector('.result').prepend(listItem);

});