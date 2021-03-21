const sleep = seconds => new Promise(res => setTimeout(res, seconds * 1000 + Math.random()));

module.exports = {
    sleep,
};