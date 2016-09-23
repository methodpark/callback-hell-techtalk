const web = require('./support/web'),
      social = require('./support/social'),
      fs = require('fs');


let readFileAsync = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, fileContent) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(fileContent);
        });
    });
};

let loginAsync = (url) => {
    return new Promise((resolve, reject) => {
        web.get(url, response => {
            if (response.status !== 200) {
                reject(`Could not login: ${response.status}`);
                return;
            }

            resolve();
        });
    });
};

let postFileAsync = (url, content) => {
    return new Promise((resolve, reject) => {
        web.post(url, content, response => {
            if (response.status !== 200) {
                reject(`Could not submit: ${response.status}`);
                return;
            }

            resolve(response.url);
        });
    });
};

let makeSocialAsync = (what) => {
    return (url) => {
        return new Promise(resolve => {
            social[what](url, (error, response) => {
                if (error) {
                    resolve({what, error});
                    return;
                }

                resolve({what, response});
            });
        });
    };
};

let socialAsync = {
    tweet: makeSocialAsync('tweet'),
    facebook: makeSocialAsync('facebook'),
    plus: makeSocialAsync('plus')
};

let fileContent;
readFileAsync('./support/web.js')
    .then(content => {
        fileContent = content;
        return loginAsync('https://login.example.com/');
    })
    .then(() => {
        return postFileAsync('https://submit.example.com/', fileContent);
    })
    .then(url => {
        return Promise.all([
            socialAsync.facebook(url),
            socialAsync.tweet(url),
            socialAsync.plus(url)
        ]);
    })
    .then(results => {
        for(let result of results) {
            if (result.error) {
                console.log(`Sharing on ${result.what} failed: ${result.error}`);
            } else {
                console.log(`Successfully shared on ${result.what}`);
            }
        }
    })
    .catch(error => {
        console.warn(error);
    });
