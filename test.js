const axios = require('axios');
const fs = require('fs');


// axios.get('https://www.instagram.com/p/CKXCLS1BoR_/')
// .then(res => fs.writeFile('html.html', res.data, err => err))
// .catch(err => console.log('err'))

const json = require('./test.json');
const post = json.entry_data.PostPage[0].graphql.shortcode_media;
const captions = [];

for (const cap of post.edge_media_to_caption.edges) {
    captions.push(cap.node.text);
}


for (const comment of post.edge_media_to_parent_comment.edges) {
    console.log(comment.node.text)
}