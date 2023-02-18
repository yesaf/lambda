interface Array<T> {
    join(separator?: string): string;
    multiply(factor?: number): T[];
    all(predicate?: (value: T) => boolean): boolean;
    any(predicate?: (value: T) => boolean): boolean;
    associateBy<K, V = T>(keySelector: (value: T) => K, valueTransform: (value: T) => V): Map<K, V>;
    average(): number;
    chunked(size: number): T[][];
    distinctBy<K>(selector: (value: T) => K): T[];
    filter(predicate: (value: T) => boolean): T[];
    filterIndexed(predicate: (value: T, index: number) => boolean): T[];
    filterNot(predicate: (value: T) => boolean): T[];
    find(predicate: (value: T) => boolean): T | undefined;
    findLast(predicate: (value: T) => boolean): T | undefined;
    flatten(): T;
    fold<R = T>(initial: R, operation: (acc: R, value: T) => R): R;
    maxBy<R = number>(selector: (value: T) => R): T;
    minBy<R = number>(selector: (value: T) => R): T;
    count(predicate: (value: T) => boolean): number;
    groupBy<K = string, V = T>(keySelector: (value: T) => K, valueTransform: (value: T) => V): Map<K, V>;
}

Array.prototype.join = function (separator = ','): string {
    let result = '';
    for (let i = 0; i < this.length; i++) result += this[i] + separator;
    return result;
}

Array.prototype.multiply = function (factor = 10) {
    return this.map((value) => value * factor);
}

Array.prototype.all = function (predicate = (value) => value) {
    for (let i = 0; i < this.length; i++) if (!predicate(this[i])) return false;
    return true;
}

Array.prototype.any = function (predicate = (value) => value) {
    for (let i = 0; i < this.length; i++) if (predicate(this[i])) return true;
    return false;
}

Array.prototype.associateBy = function (keySelector, valueTransform = (value) => value) {
    const result = new Map();
    for (let i = 0; i < this.length; i++) {
        result.set(keySelector(this[i]), valueTransform(this[i]));
    }
    return result;
}

Array.prototype.average = function () {
    let sum = 0;
    for (let i = 0; i < this.length; i++) sum += this[i];
    return sum / this.length;
}

Array.prototype.chunked = function (size) {
    const result = [];
    for (let i = 0; i < this.length; i += size) {
        result.push(this.slice(i, i + size));
    }
    return result;
}

Array.prototype.distinctBy = function (selector) {
    const result = [];
    const set = new Set();
    for (let i = 0; i < this.length; i++) {
        const key = selector(this[i]);
        if (!set.has(key)) {
            set.add(key);
            result.push(this[i]);
        }
    }
    return result;
}

Array.prototype.filter = function (predicate) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) result.push(this[i]);
    }
    return result;
}

Array.prototype.filterIndexed = function (predicate) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i)) result.push(this[i]);
    }
    return result;
}

Array.prototype.filterNot = function (predicate) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (!predicate(this[i])) result.push(this[i]);
    }
    return result;
}

Array.prototype.find = function (predicate) {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) return this[i];
    }
    return undefined;
}

Array.prototype.findLast = function (predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i])) return this[i];
    }
    return undefined;
}

Array.prototype.flatten = function () {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (Array.isArray(this[i])) {
            result.push(...this[i].flatten());
        } else {
            result.push(this[i]);
        }
    }
    return result;
}

Array.prototype.fold = function (initial, operation) {
    let result = initial;
    for (let i = 0; i < this.length; i++) {
        result = operation(result, this[i]);
    }
    return result;
}

Array.prototype.maxBy = function (selector) {
    let max = this[0];
    for (let i = 1; i < this.length; i++) {
        if (selector(this[i]) > selector(max)) max = this[i];
    }
    return max;
}

Array.prototype.minBy = function (selector) {
    let min = this[0];
    for (let i = 1; i < this.length; i++) {
        if (selector(this[i]) < selector(min)) min = this[i];
    }
    return min;
}

Array.prototype.count = function (predicate) {
    let count = 0;
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) count++;
    }
    return count;
}

Array.prototype.groupBy = function (keySelector, valueTransform = (value) => value) {
    const map = new Map();
    for (let i = 0; i < this.length; i++) {
        const key = keySelector(this[i]);
        const value = valueTransform(this[i]);
        if (map.has(key)) {
            map.get(key).push(value);
        } else {
            map.set(key, [value]);
        }
    }
    return map;
}

