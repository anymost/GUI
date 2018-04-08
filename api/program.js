const {ipcMain, dialog} = require('electron');
const git = require('nodegit');
const childProcess = require('child_process');
let directoryPath = '';

async function createProgram() {
    let event;
    try {
        event = await new Promise(resolve => {
            ipcMain.on('createProgram', event => resolve(event));
        });

        const path = await new Promise((resolve, reject) => {
            dialog.showOpenDialog({
                title: '请选择安装目录',
                properties: ['openDirectory']
            }, path => {
                if (!path) {
                    reject('已取消安装项目');
                }
                resolve(path[0]);
            });
        });

        await git.Clone('https://github.com/anymost/vue-auto-generate.git', path);
        directoryPath = path;
        event.sender.send('handleMessage', '项目下载完成');
    } catch (error) {
        console.log(error);
        if (event) {
            event.sender.send('handleError', `error is ${error}`);
        }
    }
}


async function installDependencies() {
    let event;
    try {
        event = await new Promise(resolve => {
            ipcMain.on('installDependencies', event => resolve(event));
        });
        await new Promise((resolve, reject) => {
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
        console.log('start install dependencies');
        await new Promise((resolve, reject) => {
           childProcess.exec(`cd ${directoryPath} && npm i`, error => {
                if (error) {
                    reject(error);
                }
                resolve();
           });
        });
        event.sender.send('handleMessage', '依赖安装完成');
    } catch (error) {
        console.log(error);
        if (event) {
            event.sender.send('handleError', `error is ${error}`);
        }
    }
}


module.exports = function () {
    createProgram();
    installDependencies();
};