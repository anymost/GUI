const { ipcMain } = require('electron');
const childProcess = require('child_process');
const detectNNPM = require('../tools/detectNPM');
const constant = require('../constant');
const { appendHistoryProgram, setCurrentProgram, getCurrentProgram, getHistoryPrograms} = require('../tools/persistData');


function programCreate() {
    ipcMain.on(constant.PROGRAM_CREATE, async (event, info) => {
        try {
            const { path } = info;
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '项目下载中，请稍等'});
            await new Promise(((resolve, reject) => {
                // childProcess.exec('git clone ssh://git@git.sankuai.com/bfe/fine-template.git', { cwd: path }, err => {
                //     if (err) {
                //         reject(err)
                //     }
                //     resolve();
                // })
            }));
            const finalInfo = {name: info.name, path: info.path + '/fine-template'};
            setCurrentProgram(finalInfo);
            appendHistoryProgram(finalInfo);
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'success', content: '项目下载完成'});
            event.sender.send(constant.PROGRAM_INFO, {
                current: getCurrentProgram(),
                list: getHistoryPrograms()
            });
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
            const  { path } = getCurrentProgram();
            if (!path) {
                throw new Error('当前安装目录不存在');
            }
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
            if(error.killed){
                return;
            }
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
}

function programRun() {
    let runInstance = null;
    // 项目开始运行
    ipcMain.on(constant.PROGRAM_RUN__START, async event => {
        try {
            await detectNNPM();
            const  { path } = getCurrentProgram();
            if (!path) {
                throw new Error('当前安装目录不存在');
            }
            runInstance = childProcess.spawn('npm', ['run', 'start'], { cwd: path });
            event.sender.send(constant.PROGRAM_RUN__STATUS, 'running');
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'success', content: '项目即将开始运行，请稍等'});
        } catch (error) {
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
    // 项目停止运行
    ipcMain.on(constant.PROGRAM_RUN__STOP, (event) => {
        if (runInstance) {
            try {
                runInstance.kill();
            } catch (e) {
                console.log(e);
            }
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
            const  { path } = getCurrentProgram();
            if (!path) {
                throw new Error('当前安装目录不存在');
            }
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
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
    // 项目停止编译
    ipcMain.on(constant.PROGRAM_BUILD__STOP, (event) => {
        if (buildInstance) {
            buildInstance.kill();
            event.sender.send(constant.HANDLE_MESSAGE, {type: 'info', content: '项目已停止编译'});
            event.sender.send(constant.PROGRAM_BUILD__STATUS, 'stopped');
            buildInstance = null;
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