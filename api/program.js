const {ipcMain, dialog} = require('electron');
const git = require('nodegit');
const childProcess = require('child_process');
const Store = require('electron-store');
const detectNNPM = require('../tools/detectNPM');
const constant = require('../constant');
const store = new Store();



function programCreate() {
    ipcMain.on(constant.PROGRAM_CREATE, async event => {
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
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '项目下载中，请稍等'});
            await git.Clone('https://github.com/anymost/vue-auto-generate.git', path);
            store.set('directoryPath', path);
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'success', content: '项目下载完成'});
        } catch (error) {
            console.log(error);
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
}


function programInstall() {
    let installInstance = null;
    ipcMain.on(constant.PROGRAM_INSTALL__START, async event => {
        try {
            await detectNNPM();
            const path = store.get('directoryPath');
            event.sender.send(constant.PROGRAM_INSTALL__STATUS, 'running');
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '依赖安装中，请稍等'});
            await new Promise((resolve, reject) => {
                // TODO 自定义安装镜像
                installInstance = childProcess.exec('npm i --registry=https://registry.npm.taobao.org', {cwd: path}, error => {
                    error && reject(error);
                    resolve();
                });
            });
            event.sender.send(constant.PROGRAM_INSTALL__STATUS, 'stopped');
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'success', content: '依赖安装完成'});
            installInstance = null;
        } catch (error) {
            console.log(error);
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
    // 项目停止运行
    ipcMain.on(constant.PROGRAM_INSTALL__STOP, (event) => {
        if (installInstance) {
            installInstance.kill();
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '依赖已停止安装'});
            event.sender.send(constant.PROGRAM_INSTALL__STATUS, 'stopped');
            installInstance = null;
        } else {
            event.sender.send(constant.HANDLE_ERROR, '未检测到项目进程');
        }
    });
};

function programRun() {
    let runInstance = null;
    // 项目开始运行
    ipcMain.on(constant.PROGRAM_RUN__START, async event => {
        try {
            await detectNNPM();
            const path = store.get('directoryPath');
            runInstance = childProcess.exec('npm run serve', { cwd: path});
            event.sender.send(constant.PROGRAM_RUN__STATUS, 'running');
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'success', content: '项目即将开始运行，请稍等'});
        } catch (error) {
            console.log(error);
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
    // 项目停止运行
    ipcMain.on(constant.PROGRAM_RUN__STOP, (event) => {
        if (runInstance) {
            runInstance.kill();
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '项目已停止运行'});
            event.sender.send(constant.PROGRAM_RUN__STATUS, 'stopped');
            runInstance = null;
        } else {
            event.sender.send(constant.HANDLE_ERROR, '未检测到项目进程');
        }
    });
}


function programBuild() {
    let buildInstance = null;
    // 项目开始编译
    ipcMain.on(constant.PROGRAM_BUILD__START, async event => {
        try {
            await detectNNPM();
            const path = store.get('directoryPath');
            event.sender.send(constant.PROGRAM_BUILD__STATUS, 'running');
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '项目开始编译，请稍等'});
            await new Promise((resolve, reject) => {
                buildInstance = childProcess.exec(`cd ${path} && npm run build`, error => {
                    error && reject(error);
                    resolve();
                });
            });
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'success', content: '项目已编译完成'});
            event.sender.send(constant.PROGRAM_BUILD__STATUS, 'stopped');
            buildInstance = null;
        } catch (error) {
            console.log(error);
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
    // 项目停止编译
    ipcMain.on(constant.PROGRAM_BUILD__STOP, (event) => {
        if (buildInstance) {
            buildInstance.kill();
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '项目已停止编译'});
            event.sender.send(constant.PROGRAM_BUILD__STATUS, 'stopped');
            runInstance = null;
        } else {
            event.sender.send(constant.HANDLE_ERROR, '未检测到项目进程');
        }
    });
}


module.exports = function () {
    programCreate();
    programInstall();
    programRun();
    programBuild();
};