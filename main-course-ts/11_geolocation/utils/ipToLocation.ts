function binarySearch(arr: Array<Array<string>>, l: number, r: number, x: number): number {
    if (r >= l) {
        let mid = l + Math.floor((r - l) / 2);

        if (x >= Number(arr[mid][0]) && x <= Number(arr[mid][1])) {
            return mid;
        }

        if (Number(arr[mid][0]) > x) {
            return binarySearch(arr, l, mid - 1, x);
        }

        return binarySearch(arr, mid + 1, r, x);
    }

    return -1;
}

function ipToDecimal(ip: string): number {
    let ipArr = ip.split('.');
    let result = 0;
    for (let i = 0; i < 4; i++) {
        result += Number(ipArr[i]) * Math.pow(256, 3 - i);
    }
    return result;
}

function ipToLocation(data: Array<Array<string>>, ip: string): number {
    return binarySearch(
        data,
        0,
        data.length - 1,
        ipToDecimal(ip)
    );
}

export default ipToLocation;
