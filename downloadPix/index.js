const axios = require('axios');
const fs = require('fs');

const queue = fs.readdirSync('./posts');
// const queue = ['B_0zOXChCWO'];

for (const file of queue) {
    const pixPath = './posts/' + file + '/images/';

    if (fs.readdirSync(pixPath).length > 1) {
        continue;
    }
    
    const download = fs.readFileSync(pixPath + 'download').toString().split('\n').filter(link => link.length);

    let current = 0;

    for (const url of download) {
        axios({
            url,
            responseType: 'stream',
        })
            .then(async res => {
                res.data.pipe(fs.createWriteStream(pixPath + `${current++}.png`));
            })
            .catch(err => console.log(err));
    }
}