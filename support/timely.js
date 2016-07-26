module.exports = function timelyResponse(delay, callback) {
    let callbackArgs = Array.from(arguments).slice(2);

    setTimeout(function () {
        callback.apply(this, callbackArgs);
    }, delay);
};