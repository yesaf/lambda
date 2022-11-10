const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

Array.prototype.unique = function() {
    return this.filter((value, index, self) => self.indexOf(value) === index);
};

const repeat = () => {
    rl.question('Input words and numbers separated with spaces: ', (input) => {
        if (input === 'exit') {
            process.exit(0);
        }
        let inputArr = input.split(' ');
        let numbers = inputArr.filter(v => !Number.isNaN(Number(v)));
        let words = inputArr.filter(v => !numbers.includes(v));

        const ask = () => {
            rl.question(`What would you like to do?
 1) Sort words by alphabet
 2) Sort numbers ascending
 3) Sort numbers descending
 4) Sort words by quantity of letters (ascending)
 5) Show only unique words and numbers
 or 'exit' to exit the program
 Enter command: `, (command) => {
                switch (command) {
                    case 'exit':
                        process.exit(0);
                        break;
                    case '1':
                        words.sort();
                        console.log(words);
                        break;
                    case '2':
                        numbers.sort((a, b) => a - b);
                        console.log(numbers);
                        break;
                    case '3':
                        numbers.sort((a, b) => b - a);
                        console.log(numbers);
                        break;
                    case '4':
                        words.sort((a, b) => a.length - b.length);
                        console.log(words);
                        break;
                    case '5':
                        console.log(inputArr.unique());
                        break;
                    default:
                        ask();
                }

                repeat();
            });
        };
        ask();
    });
};

repeat();

