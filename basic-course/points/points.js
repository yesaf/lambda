String.prototype.insertOnIndex = function (index, str) {
    return this.slice(0, index) + str + this.slice(index);
}

function points(s) {
    let numberOfSets = 1 << (s.length - 1);
    let results = [];
    for (let i = 0; i < numberOfSets; i++) {
        let str = s;
        for (let j = 0; j < s.length - 1; j++) {
            const pointIndex = j*2+1;
            if (((1 << j) & i) > 0) {
                str = str.insertOnIndex(pointIndex, '.');
            } else {
                str = str.insertOnIndex(pointIndex, ' ');
            }
        }
        results.push(str.replace(/\s/g, ''));
    }
    return results;
}

console.log(points('abc'));
console.log(points('abcd'));
