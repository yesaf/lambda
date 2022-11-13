import inq from 'inquirer';
import uploadImage from './uploadImage.js';
import axios from 'axios';

inq.prompt([
    {
        type: 'input',
        name: 'path',
        message: 'Drag\'n\'drop image: ',
    },
    {
        type: 'list',
        name: 'changeName',
        message: (answers) => `Your file name will be ${answers.path.split('\\').pop()}. Do you want to rename it?`,
        choices: ['Yes', 'No'],
    },
    {
        type: 'input',
        name: 'name',
        message: 'Enter new name(without file extensions like .jpg, .js):',
        when: (answers) => answers.changeName === 'Yes',
    },
]).then(answers => {
    const origName = answers.path.split(/[\\, /]/).pop();
    const [fileName, fileExtension] = [answers.name ? answers.name : origName.split('.')[0], origName.split('.')[1]];

    uploadImage(answers.path, fileName + '.' + fileExtension)
        .then((id) => {
            console.log(`File uploaded with id: ${id}`);
            inq.prompt([
                {
                    type: 'list',
                    name: 'shorten',
                    message: 'Would you like to shorten your link?',
                    choices: ['Yes', 'No'],
                },
            ]).then(answers => {
                if (answers.shorten === 'No') {
                    process.exit(0);
                }
                const alias = fileName.replace('_', ' ');

                axios.post('https://api.tinyurl.com/create', {
                        url: `https://drive.google.com/file/d/${id}/view`,
                        domain: 'tiny.one',
                        alias: alias,
                    },
                    {
                        params: {
                            api_token: '1g9cHiOUIaag3TTWYrkZUTn1DqyIIzPGw2uNKPWfr9jFrLriCBZxmUMSRF77',
                        },
                    },
                ).then((res) => {
                    console.log(res.data.data.tiny_url);
                }).catch((err) => {
                    console.log(err.response.data.errors);
                });
            });
        });
});
