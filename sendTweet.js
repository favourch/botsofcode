const T = require('./modules/T');
const https = require('https');
const Twitter = require('./modules/twitter');
const url = 'https://ireade.github.io/bitsofcode-backups/bitsofcode.ghost.json';

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, function (res) {
            let body = '';
            res.on('data', function (data) {
                data = data.toString();
                body += data;
            });

            res.on('end', function () {
                body = JSON.parse(body);
                resolve(body);
            });

        }).on('error', function (err) {
            reject(err);
        });

    })
}


function createTweet(post, tags) {
    let hashtags = '';
    tags.map(tag => hashtags += `#${tag} `)
    const tweetText = `'${post.title}' https://bitsofco.de/${post.slug} ${hashtags}`;
    console.log(tweetText);
    Twitter.tweet(tweetText);
}

fetch(url).then((response) => {

    const posts = response.db[0].data.posts;
    const posts_tags = response.db[0].data.posts_tags;
    const tags = response.db[0].data.tags;

    function getRandomPost() {
        for (let i = 0; i < posts.length; i++) {
            let post = posts[Math.floor(Math.random()*posts.length)];
            let isPost = post.page === 0;
            let isPublished = post.status === 'published';
            let isPublic = post.visibility === 'public';
            if ( isPost && isPublished && isPublic ) {
                return post;
                break;
            }
        }
    }

    function getPostTags(postID) {
        const postTagsIds = [];
        posts_tags.find((posts_tag) => {
            if ( posts_tag.post_id === postID ) postTagsIds.push(posts_tag.tag_id);
        });
        const postTags = [];
        postTagsIds.map((postTagsID) => {
            tags.find((tag) => {
                if ( tag.id === postTagsID ) return postTags.push(tag.name);
            })
        })
        return postTags;
    }

    const randomPost = getRandomPost();
    const randomPostTags = getPostTags(randomPost.id);
    createTweet(randomPost, randomPostTags)
})
