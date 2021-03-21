const express = require('express');
const cors = require('cors');
const PORT = 5000;

const app = express();

app.use(cors());

const fs = require('fs');
const dir = 'C:/Users/gxlizy/Desktop/javascript/bobs_ippo/posts/';

const queue = [];

for (const file of fs.readdirSync(dir)) {
    const path = dir + file + '/';
    const items = fs.readdirSync(path);

    // comments
    queue.push({
        type: 'comments',
        path: path + items[0],
    });
    
    // likes
    queue.push({
        type: 'likes',
        path: path + items[2],
    });
    
    const imagePath = path + 'images/';

    for (const image of fs.readdirSync(imagePath)) {
        if (image !== 'download') {
            queue.push({
                type: 'image',
                path: imagePath + image,
            })
        }
    }
}

const server = require('http').createServer();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', async (socket, req) => {
    console.log('connected')
    for (const file of queue) {
        if (file.type === 'image') {
            fs.readFile(file.path, (err, buf) => {
                socket.send(`${file.type}我${file.path.split('/posts')[1].substring(1)}我${buf.toString('base64')}`);
            })
        }
        else if (file.type === 'comments') {
            socket.send(`${file.type}我${file.path.split('/posts')[1].substring(1)}我${JSON.stringify(require(file.path))}`);
        }
        else {
            socket.send(`${file.type}我${file.path.split('/posts')[1].substring(1)}我${fs.readFileSync(file.path).toString()}`);
        }
    }
})

server.listen(PORT, () => console.log('Listening on port:', PORT));