const {ipcMain, dialog} = require('electron');
const git = require('nodegit');
const childProcess = require('child_process');
const detectNNPM = require('../tools/detectNPM');
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
                !path && reject('已取消安装项目');
                resolve(path[0]);
            });
        });

        await git.Clone('https://github.com/anymost/vue-auto-generate.git', path);
        directoryPath = path;
        event.sender.send('handleMessage', {type: 'success', content: '项目下载完成'});
    } catch (error) {
        console.log(error);
        event && event.sender.send('handleError', `error is ${error}`);
    }
}


async function installDependencies() {
    let event;
    try {
        event = await new Promise(resolve => {
            ipcMain.on('installDependencies', event => resolve(event));
        });
        await detectNNPM();
        await new Promise((resolve, reject) => {
            childProcess.exec(`cd ${directoryPath} && npm i`, error => {
                error && reject(error);
                resolve();
            });
        });
        event.sender.send('handleMessage', {type: 'success', content: '依赖安装完成'});
    } catch (error) {
        console.log(error);
        event && event.sender.send('handleError', `error is ${error}`);
    }
}

async function runProgram() {
    let event;
    try {
        event = await new Promise(resolve => {
            ipcMain.on('runProgram', event => resolve(event));
        });
        await detectNNPM();
        await new Promise((resolve, reject) => {
            childProcess.exec(`cd ${directoryPath} && npm run serve`, error => {
                error && reject(error);
                resolve();
            });
        });
        event.sender.send('handleMessage', {type: 'success', content: '项目已开始运行'});
    } catch (error) {
        console.log(error);
        event && event.sender.send('handleError', `error is ${error}`);
    }
}

async function buildProgram() {
    let event;
    try {
        event = await new Promise(resolve => {
            ipcMain.on('runProgram', event => resolve(event));
        });
        await detectNNPM();
        await new Promise((resolve, reject) => {
            childProcess.exec(`cd ${directoryPath} && npm run build`, error => {
                error && reject(error);
                resolve();
            });
        });
        event.sender.send('handleMessage', {type: 'success', content: '项目已编译完成'});
    } catch (error) {
        console.log(error);
        event && event.sender.send('handleError', `error is ${error}`);
    }
}


module.exports = function () {
    createProgram();
    installDependencies();
    runProgram();
    buildProgram();
};