import inq from 'inquirer';
import fs from 'fs';

function enterUsers() {
    inq.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter user\'s name: ',
        },
        {
            type: 'list',
            name: 'gender',
            message: 'Enter user\'s gender: ',
            choices: [
                'male',
                'female',
                'NaN',
                'helicopter',
            ],
            when: (answers) => {
                return answers.name !== '';
            },
        },
        {
            type: 'input',
            name: 'age',
            message: 'Enter user\'s age: ',
            when: (answers) => {
                return answers.name !== '';
            },
        },
    ]).then(answers => {
        if (answers.name === '') {
            askSearch();
        } else {
            fs.readFile('DB.txt', (e, data) => {
                let content;
                if (data.length) {
                    content = [...JSON.parse(data.toString()), answers];
                } else {
                    content = [answers];
                }
                fs.writeFile('DB.txt', JSON.stringify(content), (e) => {
                    if (e) {
                        console.log(e);
                    }
                    enterUsers();
                });
            });
        }
    });
}

function askSearch() {
    inq.prompt([{
        name: 'choice',
        type: 'list',
        choices: ['Yes', 'No'],
        message: 'Do you want to find user by name?',
    }]).then(((answer) => {
        if (answer.choice === 'No') {
            process.exit(0);
        } else {
            findUser();
        }
    }));
}

function findUser() {
    inq.prompt([{
        name: 'name',
        type: 'input',
        message: 'Enter user\'s name?',
    }]).then(((answer) => {
        fs.readFile('DB.txt', (e, usersData) => {
            const filtered = JSON.parse(usersData.toString())
                .filter((user) => {
                 return user.name.toLowerCase()
                    .includes(answer.name.toLowerCase());
            });
            if (filtered.length) {
                console.log('Found!');
                console.log(filtered);
            } else {
                console.log('No such user in DB');
            }
        });
    }));
}

enterUsers();
