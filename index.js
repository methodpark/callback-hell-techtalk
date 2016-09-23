const web = require('./support/web'),
      social = require('./support/social'),
      fs = require('fs');


let readFileAsync = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, fileContent) => {
            if (error) {
                console.log('rejecting!');
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


Promise.all([
    readFileAsync('./support/web.js'),
    loginAsync('https://login.example.com/')
])
    .then(result => {
        let fileContent = result[0];
        return postFileAsync('https://submit.example.com/', fileContent);
    })
    .then(url => {
        return Promise.all([
            socialAsync.tweet(url),
            socialAsync.facebook(url),
            socialAsync.plus(url)
        ]);
    })
    .then(results => {
        for (let result of results) {
            if (result.error) {
                console.warn(`Error while sharing on ${result.what}: ${result.error}`);
            } else {
                console.log(`Successfully shared on ${result.what}: ${result.response.url}`);
            }
        }
    })
    .catch(console.warn.bind(console));