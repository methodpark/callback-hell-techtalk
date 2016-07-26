let timelyResponse = require('./timely');

module.exports = {
    'tweet': function (tweet, callback) {
        timelyResponse(500, callback, null, {url: 'https://twitter.com/'});
    },

    'plus': function (post, callback) {
        timelyResponse(1100, callback, null, {url: 'https://plus.google.com/'});
    },

    'facebook': function (post, callback) {
        timelyResponse(300, callback, 'Session time out', null);
    }
};