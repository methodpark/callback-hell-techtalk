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
        return new Promise((resolve, reject) => { 
            social[what](url, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(response);
            });
        });
    };
}

let socialAsync = {
    tweet: makeSocialAsync('tweet'),
    facebook: makeSocialAsync('facebook'),
    plus: makeSocialAsync('plus')
};

let fileContent;
let uploadUrl;
readFileAsync('./support/web.js')
    .then(content => {
        fileContent = content;
        return loginAsync('https://login.example.com/');
    })
    .then(result => {
        return postFileAsync('https://submit.example.com/', fileContent);
    })
    .then(() => {
        return socialAsync.tweet(uploadUrl);
    })
    .then(url => {
        uploadUrl = url;
        return socialAsync.facebook(uploadUrl);
    })
    .then(() => {
        return socialAsync.plus(uploadUrl);
    })
    .catch(error => {
        console.warn(error);
    });
