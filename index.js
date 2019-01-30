/* ******************

 Fixes for Heroku
 See http://stackoverflow.com/a/31094668

 ******************* */

const express = require('express');
const app = express();
const path = require('path');
app.set('port', (process.env.PORT || 5000));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/index.html'));
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});


/* ******************

 The Setup

 ******************* */
const T = require('./modules/T');
const Twitter = require('./modules/twitter');

/* ******************

 Key Variables

 ******************* */
const me = {
    id: 201248377,
    screen_name: 'senseifavour'
};

const botsofcode = {
    id: 201248377,
    screen_name: 'senseifavour'
};

const emojis = ['👊', '👊', '🙌', '👍', '💁', '👌', '🙅', '👯'];


/* ******************

 General Functions

 ******************* */
function shouldSendReply() {
    const randomNumber = Math.random();
    if (randomNumber > 0.3) return true;
    return false;
}

function getEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getTweet(tweet) {

    const text = `Thanks for sharing! ${ getEmoji() }`;
    return text;

}


/* ******************

 Stream

 ******************* */

const stream = T.stream('statuses/filter', { track: ['bitsofco.de'] });

stream.on('tweet', (tweet) => {

	if ( tweet.user.id === botsofcode.id ) {
		return;
	}

    Twitter.like(tweet);

	if ( tweet.user.id === me.id ) {
        Twitter.retweet(tweet);
		return;
	}

    if ( tweet.retweeted_status ) return;

	if ( tweet.text.toLowerCase().includes('@senseifavour') ) {
		if ( shouldSendReply() ) {
            Twitter.reply(tweet, getTweet(tweet));
		}
		return;
	}

    Twitter.reply(tweet, getTweet(tweet));

});



