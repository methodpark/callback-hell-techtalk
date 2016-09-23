
function promisedFunction() {
    console.log(`Start promisedFunction`);

    console.log(`Create promise`);
    let promise = new Promise(resolve => {
        const delayInMilliseconds = 1500;
        console.log(`Start timer`);
        setTimeout(() => {
            console.log(`Timer finished`);
            resolve('some value');
        }, delayInMilliseconds);
    });

    console.log(`Finished promisedFunction`);
    return promise;
}

async function asyncFunction() {
    console.log(`Start asyncFunction`);

    let value = await promisedFunction();

    console.log(`"Returned" value: ${value}`);
    console.log(`Finished asyncFunction`);
}

console.log(`Call asyncFunction`);
asyncFunction();
console.log(`Exited asyncFunction`);