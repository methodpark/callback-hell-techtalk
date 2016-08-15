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


async function publishFile() {
    try {
        let fileContent = await readFileAsync('./support/web.js');
        await loginAsync('https://login.example.com/');
        let url = await postFileAsync('https://submit.example.com/', fileContent);

        await Promise.all([
            socialAsync.tweet(url),
            socialAsync.facebook(url),
            socialAsync.plus(url)
        ]);
    } catch (exception) {
        console.warn(exception);
    }
}

publishFile();