const web = require('./support/web'),
    social = require('./support/social'),
    fs = require('fs');


function postHandler(callback) {
    return (response) => {
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
    };
}

function loginHandler(fileContent, callback) {
    return (response) => {
        if (response.status != 200) {
            callback('Could not login: ' + response.status);
            return;
        }

        web.post('https://submit.example.com/', fileContent, postHandler(callback));
    };
}

function uploadFileHandler(callback) {
    return (error, fileContent) => {
        if (error) {
            callback(error);
            return;
        }

        web.get('https://login.example.com/', loginHandler(fileContent, callback));
    };
}

function publishFile(path, callback) {
    fs.readFile(path, uploadFileHandler(callback));
}

publishFile('./support/web.js', (error) => {
    if (error) {
        console.warn(error);
    }

    console.log('done');
});