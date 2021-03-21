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

    const posts = [
        "https://www.instagram.com/p/CMVUmv9BkKz/",
        "https://www.instagram.com/p/CMSrr-AhjUO/",
        "https://www.instagram.com/p/CMQE_NAhPZA/",
        "https://www.instagram.com/p/CL7bIwDBLu6/",
        "https://www.instagram.com/p/CLxJUeUh3Od/",
        "https://www.instagram.com/p/CLulQWIBTYu/",
        "https://www.instagram.com/p/CLZ8_yfhZyo/",
        "https://www.instagram.com/p/CLU396EBUUv/",
        "https://www.instagram.com/p/CLNUqCYhIGU/",
        "https://www.instagram.com/p/CLKji3YBp-O/",
        "https://www.instagram.com/p/CLH-JGGhyA6/",
        "https://www.instagram.com/p/CK94kSxhI8h/",
        "https://www.instagram.com/p/CK7FxILhcIg/",
        "https://www.instagram.com/p/CK2BEM9hQ_m/",
        "https://www.instagram.com/p/CKwzmBrBsK1/",
        "https://www.instagram.com/p/CKuNp2FBZ6G/",
        "https://www.instagram.com/p/CKj_UEjhASa/",
        "https://www.instagram.com/p/CKcSMAYBj4_/",
        "https://www.instagram.com/p/CKZnvMWBeUr/",
        "https://www.instagram.com/p/CKXCLS1BoR_/",
        "https://www.instagram.com/p/CKUaUa5h196/",
        "https://www.instagram.com/p/CKRvKjrhOG_/",
        "https://www.instagram.com/p/CKM5P62hJhD/",
        "https://www.instagram.com/p/CKCYUX8heC5/",
        "https://www.instagram.com/p/CJ6uU4uhe4F/",
        "https://www.instagram.com/p/CJ1dSJwBV6Z/",
        "https://www.instagram.com/p/CJy885JB_6E/",
        "https://www.instagram.com/p/CJt3yOMBkvC/",
        "https://www.instagram.com/p/CJmFYUdhSAz/",
        "https://www.instagram.com/p/CJjkNsrBMWE/",
        "https://www.instagram.com/p/CI1cI1vBM37/",
        "https://www.instagram.com/p/CItdxdrhLan/",
        "https://www.instagram.com/p/CIoVNlPBZKP/",
        "https://www.instagram.com/p/CHD5DrJhTdk/",
        "https://www.instagram.com/p/CHBRrXpBjLf/",
        "https://www.instagram.com/p/CG-qTR-h96Y/",
        "https://www.instagram.com/p/CG8FXTYBCLf/",
        "https://www.instagram.com/p/CG5fE7BhIyk/",
        "https://www.instagram.com/p/CG3Ei_ABqg2/",
        "https://www.instagram.com/p/CG0j0RyhY7h/",
        "https://www.instagram.com/p/CGx-8iOhE5W/",
        "https://www.instagram.com/p/CGvLQBMhP9C/",
        "https://www.instagram.com/p/CGqHqI7Bxmc/",
        "https://www.instagram.com/p/CGniLQ5hFQ9/",
        "https://www.instagram.com/p/CGalpybhzEg/",
        "https://www.instagram.com/p/CGS5bgdB9WA/",
        "https://www.instagram.com/p/CGQbe8AhhMU/",
        "https://www.instagram.com/p/CGLIxWJBDUd/",
        "https://www.instagram.com/p/CF-Q586hcWQ/",
        "https://www.instagram.com/p/CF7wYk0Bg0y/",
        "https://www.instagram.com/p/CF5eQxTB-74/",
        "https://www.instagram.com/p/CFxfbuHhmjz/",
        "https://www.instagram.com/p/CFpwdPkBOgb/",
        "https://www.instagram.com/p/CFnHMcqBfua/",
        "https://www.instagram.com/p/CFXu71Ih1dg/",
        "https://www.instagram.com/p/CFP9BeNhe8d/",
        "https://www.instagram.com/p/CFNfc4_B700/",
        "https://www.instagram.com/p/CENMluuBhd6/",
        "https://www.instagram.com/p/CEKqv_IBNRi/",
        "https://www.instagram.com/p/CEH3hUNhrgn/",
        "https://www.instagram.com/p/CEFPyKThl8_/",
        "https://www.instagram.com/p/CECthG0Bumi/",
        "https://www.instagram.com/p/CEAdQEnBXXB/",
        "https://www.instagram.com/p/CD9lNR3BPgN/",
        "https://www.instagram.com/p/CD7d9VbBZBH/",
        "https://www.instagram.com/p/CD4zaIOhPnU/",
        "https://www.instagram.com/p/CDuJ0WOhxp6/",
        "https://www.instagram.com/p/CDrtFM8Bq8P/",
        "https://www.instagram.com/p/CDpSxgvBxHd/",
        "https://www.instagram.com/p/CDkPjEohZY7/",
        "https://www.instagram.com/p/CDh1Q3oBmfQ/",
        "https://www.instagram.com/p/CDcNBhEBdGh/",
        "https://www.instagram.com/p/CDUb_YGhKbI/",
        "https://www.instagram.com/p/CDSF-s1hADt/",
        "https://www.instagram.com/p/CDPUtOxBsX0/",
        "https://www.instagram.com/p/CDARx62hXjN/",
        "https://www.instagram.com/p/CC9cTbyhiE9/",
        "https://www.instagram.com/p/CC7C7UXhqEJ/",
        "https://www.instagram.com/p/CC4GfIrhO-V/",
        "https://www.instagram.com/p/CCzi4oGh3lb/",
        "https://www.instagram.com/p/CCuEu16hYoZ/",
        "https://www.instagram.com/p/CCZJxFKB6Sw/",
        "https://www.instagram.com/p/CCW1rHhBsuL/",
        "https://www.instagram.com/p/CCEvug6hqd2/",
        "https://www.instagram.com/p/B_236YMB3-P/",
        "https://www.instagram.com/p/B_0zOXChCWO/",
        "https://www.instagram.com/p/B_x-PD2BUFm/",
        "https://www.instagram.com/p/B_fmFoeBv5z/",
        "https://www.instagram.com/p/B_d0Lfchl9N/",
        "https://www.instagram.com/p/B_dQ-TLh0rx/",
        "https://www.instagram.com/p/B_acF7XBKu5/",
        "https://www.instagram.com/p/B_X6nnJhf3E/",
        "https://www.instagram.com/p/B_VZus9hGWz/",
        "https://www.instagram.com/p/B-h8WfQBbix/",
        "https://www.instagram.com/p/B9vK0pJBKAP/",
        "https://www.instagram.com/p/B9upc_2BWdn/"
    ];

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

