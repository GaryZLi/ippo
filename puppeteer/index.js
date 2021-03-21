const puppeteer = require('puppeteer');
const axios = require('axios');

const scrapePost = require('./scrapePost');
const {
    sleep,
} = require('../actions');

axios.get('http://127.0.0.1:9222/json/version')
.then(res => start(res.data.webSocketDebuggerUrl))
.catch(err => console.log(err, 'err'));


const start = async endpoint => {
    const browser = await puppeteer.connect({
        browserWSEndpoint: endpoint,
        defaultViewport: null,
    });

    const posts = require('../posts.json');

    const queue = new Set([]);

    for (const link of posts) {
        while (queue.size > 3) {
            await sleep(1);
        }

        // while (queue.size > 0) {
        //     return;
        // }

        queue.add(link);
        
        scrapePost(browser, link)
        .then(link => queue.delete(link));
    }
};

