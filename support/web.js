
let timelyResponse = require('./timely');

module.exports = {
    'get': function (url, callback) {
        timelyResponse(400, callback, {status: 200, username: 'mp', session: '12345'});
    },

    'post': function (url, data, callback) {
        timelyResponse(1100, callback, {status: 200, length: 1024, url: 'https://submissions.example.com/12345'});
    }
};