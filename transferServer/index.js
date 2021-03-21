const endpoint = 'http://localhost:6969';
let storagePath = 'tempPath/';

// --------------------------------------------------------
const fs = require('fs');
const axios = require('axios');

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

        if (!fs.existsSync(storagePath + p)) {
            fs.mkdirSync(storagePath + p, {recursive: true});
        }

        fs.writeFile(storagePath + path, results, {encoding: 'base64'}, err => err);
    }
    // else {
    //     const p = path.split('/')[0];
    //     if (!fs.existsSync(storagePath + p)) {
    //         fs.mkdirSync(storagePath + p, {recursive: true});
    //     }

    //     fs.writeFile(storagePath + path, results, err => err);
    // }

}