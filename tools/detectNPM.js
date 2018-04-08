const childProcess = require('child_process');
module.exports = function() {
    return new Promise((resolve, reject) => {
        childProcess.exec("npm -v", (error, message) => {
            if (error) {
                reject(error)
            }
            if (/not found/i.test(message)) {
                reject('未检测到npm，请安装');
            }
            resolve();
        })
    });
};