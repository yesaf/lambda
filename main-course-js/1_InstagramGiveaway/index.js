const fs = require('fs');

const dirPath = './data/';

benchmark = false;

function readFiles(
    dirname,
    onFileContent,
    onEnd = () => {
    },
    onError = (err) => {
        throw err;
    },
) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }

        filenames.forEach(function(filename) {
            const content = fs.readFileSync(dirname + filename, 'utf-8');
            onFileContent(filename, content);
        });

        onEnd();
    });
}

function uniqueValues() {
    if (benchmark) console.time('uniqueValues');
    let unique = new Set();

    readFiles(dirPath, (filename, content) => {
        for (const row of content.split('\n')) {
            unique.add(row);
        }
    }, () => {
        console.log('Unique values: ' + unique.size);
        if (benchmark) console.timeEnd('uniqueValues');
    });

}

function existInNArrays(arrays, n) {
    const set = new Map();
    for (let i=0; i<arrays.length; i++) {
        const setArr = new Set(arrays[i])
        for(const elem of setArr) {
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
    let data = [];

    readFiles(dirPath, (filename, content) => {
        const newData = content.split('\n');
        data.push(newData);
    }, () => {
        console.log('Exist in all files: ' + existInNArrays(data, data.length).length);
        if (benchmark) console.timeEnd('existInAllFiles');
    });
}

function existInAtLeastTen() {
    if (benchmark) console.time('existInAtLeastTen');
    let data = [];

    readFiles(dirPath, (filename, content) => {
        const newData = content.split('\n');
        data.push(newData);
    }, () => {
        console.log('Exist in at least 10 files: ' + existInNArrays(data, 10).length);
        if (benchmark) console.timeEnd('existInAtLeastTen');
    });
}


uniqueValues();
existInAllFiles();
existInAtLeastTen();

