const fs = require('fs');
const {
    sleep,
} = require('../actions');

const scrapePost = async (browser, url) => {
    let uri = url.split('/');
    uri = uri[uri.length - 2];

    const dir = `./posts/${uri}/`;

    const imageURLs = fs.readFileSync(dir + 'images/download').toString().split('\n');

    if (imageURLs[0].length) {
        return url;
    } 

    // if (fs.readdirSync(dir).length === 3) return url;

    console.log(url);

    const page = await browser.newPage();;

    await page.goto(url);
    // await page.goto('https://www.instagram.com/p/CL7bIwDBLu6/');

    const results = await page.evaluate(async () => {
        const sleep = seconds => new Promise(res => setTimeout(res, seconds * 1000 + Math.random()));

        const images = new Set([]);
        const comments = {};
        const likes = new Set([]);

        const getImages = async () => {
            await sleep(3);

            document.querySelector('button[tabindex="-1"]>div')?.click();

            await sleep(1);

            const nextPic = document.querySelectorAll('button[tabindex="-1"]>div')[1];

            let tries = 0;
            let prev;

            while (tries < 3) {
                document.querySelectorAll('li>div>div>div>div>img').forEach(img => images.add(img.src));
                
                let solo = document.querySelector('div[role="button"][tabindex="0"]>div>div>div>img');

                if (solo) {
                    images.add(solo.src);
                }

                solo = document.querySelector('div[role="button"][tabindex="0"]>div>div>img');

                if (solo) {
                    images.add(solo.src);
                }

                try {
                    nextPic.click();
                }
                catch {
                    tries++;
                }

                await sleep(1);

                if (images.size === prev) tries++;

                prev = images.size;
            }
        };

        const getComments = async () => {
            const commentSection = document.querySelector('article>div>div>ul');
            
            let load = document.querySelector('span[aria-label="Load more comments"]');
            let tries = 0;

            while (tries < 3) {
                load = document.querySelector('span[aria-label="Load more comments"]');
                console.log('clicking', load);

                try {
                    load.click();
                }
                catch {
                    tries++;
                    await sleep(1);
                }

                commentSection.scrollTo(0, 100000);
                await sleep(1);
            }

            for (let i = 0; i < commentSection.childElementCount; i++) {
                if (i === 0 && commentSection.children[0].nodeName === 'DIV') {
                    const first = commentSection.firstChild.firstChild.firstChild.firstChild.childNodes[1];
                    const user = first.childNodes[0].textContent;
                    const post = first.childNodes[1].textContent;

                    comments[user]? comments[user].push(post) : comments[user] = [post];
                }
                else if (commentSection.children[i].nodeName === 'UL') {
                    const first = commentSection.childNodes[i].firstChild.firstChild.firstChild.firstChild.children[1];
                    const user = first.childNodes[0].textContent;
                    const post = first.childNodes[1].textContent;

                    comments[user]? comments[user].push(post) : comments[user] = [post];
                }
            }
        };

        const getLikes = async () => {
            await sleep(3);
            document.querySelector('section>div>div>a>span').parentElement.click()

            await sleep(3);

            
            let prev;
            let tries = 0;
            
            while (tries < 3) {
                const likeSection = document.querySelector('div[role="dialog"]>div').children[1].querySelector('div[aria-labelledby]').parentElement;
                likeSection.childNodes.forEach(child => likes.add(child.children[1].firstChild.textContent));

                if (likes.size === prev) {
                    tries++;
                }

                prev = likes.size;

                likeSection.parentElement.scrollTo(0, 1000000);

                await sleep(1.5);
            }
        };

        await getImages();
        // await getComments();
        // await getLikes();

        return {
            images: [...images],
            // comments: comments,
            // likes: [...likes],
        };
    });

    const imagePath = 'images/';

    if (!fs.existsSync(dir+imagePath)) fs.mkdirSync(dir + imagePath, {recursive: true});
console.log(results.images, url)
    fs.writeFile(`${dir+imagePath}/download`, results.images.join('\n'), err => err);
    // fs.writeFile(`${dir}/comments.json`, JSON.stringify(results.comments), err => err);
    // fs.writeFile(`${dir}/likes`, JSON.stringify(results.likes), err => err);

    page.close();

    return url;
};

module.exports = scrapePost;