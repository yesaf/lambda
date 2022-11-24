const fs = require('fs');

const dirPath = './data/';

benchmark = true;

function readFiles(dirname) {
    const fileContents = [];
    fs.readdirSync(dirname).forEach((filename) => {
        fileContents.push(fs.readFileSync(dirname + filename, 'utf-8')
            .split('\n'));
    });
    return fileContents;
}

function uniqueValues() {
    if (benchmark) console.time('uniqueValues');
    let unique = new Set(readFiles(dirPath).reduce((a, b) => a.concat(b), []));
    if (benchmark) console.timeEnd('uniqueValues');

    return unique;
}

function existInNArrays(arrays, n) {
    const set = new Map();
    for (let i = 0; i < arrays.length; i++) {
        const setArr = new Set(arrays[i]);
        for (const elem of setArr) {
            const count = set.get(elem) || 0;
            set.set(elem, count + 1);
        }
    }

    return arrays[0].filter(e => {
        return set.get(e) >= n;
    });
}

function existInAllFiles() {
    if (benchmark) console.time('existInAllFiles');
    let res = existInNArrays(readFiles(dirPath), 20);
    if (benchmark) console.timeEnd('existInAllFiles');
    return res;
}

function existInAtLeastTen() {
    if (benchmark) console.time('existInAllFiles');
    let res = existInNArrays(readFiles(dirPath), 10);
    if (benchmark) console.timeEnd('existInAllFiles');
    return res;
}


console.log('Unique values: ', uniqueValues().size);
console.log('Exist in all files: ', existInAllFiles().length);
console.log('Exist in at least 10 files: ', existInAtLeastTen().length);

