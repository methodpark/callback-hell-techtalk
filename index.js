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
                let done = {
                        twitter: false,
                        facebook: false,
                        plus: false
                    },
                    errors = [],
                    handleDone = (what, error, response) => {
                        done[what] = response || true;

                        if (error) {
                            errors.push(`${what}: ${error}`);
                        }

                        if (done.twitter && done.facebook && done.plus) {
                            if (errors.length === 0) {
                                errors = undefined;
                            }
                            callback(errors);
                        }
                    };

                if (response.status != 200) {
                    callback('Could not post: ' + response.status);
                }

                social.tweet('Just published this thing: ' + response.url, (error, response) => {
                    handleDone('twitter', error, response);
                });

                social.facebook('Just published this thing: ' + response.url, (error, response) => {
                    handleDone('facebook', error, response);
                });

                social.plus('Just published this thing: ' + response.url, (error, response) => {
                    handleDone('plus', error, response);
                });
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