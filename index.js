const web = require('./support/web'),
      social = require('./support/social'),
      fs = require('fs');

function publishFile(path, callback) {
    fs.readFile(path, (error, fileContent) => {
        if (error) {
            callback(error);
            return;
        }

        web.get('https://login.example.com/', (response) => {
            if (response.status != 200) {
                callback('Could not login: ' + response.status);
                return;
            }

            web.post('https://submit.example.com/', fileContent, (response) => {
                social.tweet('Just published this thing: ' + response.url, (error, response) => {
                    // do something
                });

                social.facebook('Just published this thing: ' + response.url, (error, response) => {
                    // do something
                });

                social.plus('Just published this thing: ' + response.url, (error, response) => {
                    // do something
                });

                callback();
            });
        });
    });
}

publishFile('./support/web.js', (error) => {
    if (error) {
        console.warn(error);
    }

    console.log('done');
});