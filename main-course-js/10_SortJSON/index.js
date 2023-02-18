import axios from 'axios';

const endpoints = [
    'https://jsonbase.com/lambdajson_type1/793',
    'https://jsonbase.com/lambdajson_type1/955',
    'https://jsonbase.com/lambdajson_type1/231',
    'https://jsonbase.com/lambdajson_type1/931',
    'https://jsonbase.com/lambdajson_type1/93',
    'https://jsonbase.com/lambdajson_type2/342',
    'https://jsonbase.com/lambdajson_type2/770',
    'https://jsonbase.com/lambdajson_type2/491',
    'https://jsonbase.com/lambdajson_type2/281',
    'https://jsonbase.com/lambdajson_type2/718',
    'https://jsonbase.com/lambdajson_type3/310',
    'https://jsonbase.com/lambdajson_type3/806',
    'https://jsonbase.com/lambdajson_type3/469',
    'https://jsonbase.com/lambdajson_type3/258',
    'https://jsonbase.com/lambdajson_type3/516',
    'https://jsonbase.com/lambdajson_type4/79',
    'https://jsonbase.com/lambdajson_type4/706',
    'https://jsonbase.com/lambdajson_type4/521',
    'https://jsonbase.com/lambdajson_type4/350',
    'https://jsonbase.com/lambdajson_type4/64',
];

function countTrueFalse(endpoints) {
    let trueValues = 0;
    let falseValues = 0;

    Promise.all(endpoints.map((endpoint) => axios
        .get(endpoint)
        .then((res) => {
            const dataStr = JSON.stringify(res.data);
            const isDoneValue = dataStr.match(/"isDone":(true|false)/)[0].split(':')[1];
            console.log(endpoint + ': isDone - ' + isDoneValue);
            if (isDoneValue === 'true') {
                trueValues++;
            } else {
                falseValues++;
            }
        }).catch((error) => {
            console.log(error);
        }),
    )).then(() => {
        console.log('True values: ' + trueValues);
        console.log('False values: ' + falseValues);
    });
}

countTrueFalse(endpoints);
