const {ipcMain, dialog} = require('electron');
const git = require('nodegit');
const childProcess = require('child_process');
const Store = require('electron-store');
const detectNNPM = require('../tools/detectNPM');
const store = new Store();

async function createProgram() {
    ipcMain.on('createProgram', async event => {
        try {
            const path = await new Promise((resolve, reject) => {
                dialog.showOpenDialog({
                    title: '请选择安装目录',
                    properties: ['openDirectory']
                }, path => {
                    !path && reject('已取消安装项目');
                    resolve(path[0]);
                });
            });
            event.sender.send('handleMessage', {type: 'info', content: '项目下载中，请稍等'});
            await git.Clone('https://github.com/anymost/vue-auto-generate.git', path);
            store.set('directoryPath', path);
            event.sender.send('handleMessage', {type: 'success', content: '项目下载完成'});
        } catch (error) {
            console.log(error);
            event && event.sender.send('handleError', error);
        }
    });
}


async function installDependencies() {
    ipcMain.on('installDependencies', async event => {
        try {
            await detectNNPM();
            const path = store.get('directoryPath');
            event.sender.send('handleMessage', {type: 'info', content: '依赖安装中，请稍等'});
            await new Promise((resolve, reject) => {
                childProcess.exec(`cd ${path} && npm i --registry=https://registry.npm.taobao.org`, error => {
                    error && reject(error);
                    resolve();
                });
            });
            event.sender.send('handleMessage', {type: 'success', content: '依赖安装完成'});
        } catch (error) {
            console.log(error);
            event && event.sender.send('handleError', error);
        }
    });
};

async function runProgram() {
    ipcMain.on('runProgram', async event => {
        try {
            await detectNNPM();
            const path = store.get('directoryPath');
            event.sender.send('handleMessage', {type: 'info', content: '项目正在启动，请稍等'});
            await new Promise((resolve, reject) => {
                childProcess.exec(`cd ${path} && npm run serve`, error => {
                    error && reject(error);
                    resolve();
                });
            });
            event.sender.send('handleMessage', {type: 'success', content: '项目已开始运行'});
        } catch (error) {
            console.log(error);
            event && event.sender.send('handleError', error);
        }
    });
}

async function buildProgram() {
    ipcMain.on('buildProgram', async event => {
        try {
            await detectNNPM();
            const path = store.get('directoryPath');
            event.sender.send('handleMessage', {type: 'info', content: '项目开始编译，请稍等'});
            await new Promise((resolve, reject) => {
                childProcess.exec(`cd ${path} && npm run build`, error => {
                    error && reject(error);
                    resolve();
                });
            });
            event.sender.send('handleMessage', {type: 'success', content: '项目已编译完成'});
        } catch (error) {
            console.log(error);
            event && event.sender.send('handleError', error);
        }
    });
}


module.exports = function () {
    createProgram();
    installDependencies();
    runProgram();
    buildProgram();
};