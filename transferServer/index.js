const endpoint = 'http://localhost:6969';
let storagePath = 'tempPath/';

// --------------------------------------------------------
const fs = require('fs');

if (storagePath[storagePath.length - 1] !== '/') storagePath += '/';

const dir = storagePath + '/posts/';

const WebSocket = require('ws');
const socket = new WebSocket("ws://localhost:6969");

socket.onmessage = ({data}) => {
    const [type, path, results] = data.split('我');
    
    if (type === 'image') {
        let p = path;
        p = p.split('/');
        p.pop();
        p = p.join('/');

        if (!fs.existsSync(dir + p)) {
            fs.mkdirSync(dir + p, {recursive: true});
        }

        fs.writeFile(dir + path, results, {encoding: 'base64'}, err => err);
    }
    else {
        const p = path.split('/')[0];
        if (!fs.existsSync(dir + p)) {
            fs.mkdirSync(dir + p, {recursive: true});
        }

        fs.writeFile(dir + path, results, err => err);
    }
}