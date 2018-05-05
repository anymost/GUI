const { ipcMain, dialog } = require('electron');
const constant = require('../constant');
const persistData = require('../tools/persistData');

function directorySelect() {
    ipcMain.on(constant.DIRECTORY_SELECT__START, async event => {
        try {
            const path = await new Promise((resolve, reject) => {
                dialog.showOpenDialog({
                    title: '请选择安装目录',
                    properties: ['openDirectory']
                }, path => {
                    !path && reject('cancel');
                    resolve(path[0]);
                });
            });
            event.sender.send(constant.DIRECTORY_SELECT__DONE, path);
        } catch (error) {
            if (error !== 'cancel') {
                event && event.sender.send(constant.HANDLE_ERROR, error);
            }
        }
    });
}


function currentProgramFetch() {
    ipcMain.on(constant.CURRENT_PROGRAM__FETCH, event => {
        const info = persistData.getCurrentProgram();
        event.sender.send(constant.CURRENT_PROGRAM__FETCH, info)
    })
}

function currentProgramSet() {
    ipcMain.on(constant.CURRENT_PROGRAM__SET, (event, info)=> {
        persistData.setCurrentProgram(info);
        event.sender.send(constant.CURRENT_PROGRAM__SET, info);
        event.sender.send(constant.HANDLE_MESSAGE, {type: 'success', content: '当前目录切换完成'});
    })
}

function programListFetch() {
    ipcMain.on(constant.PROGRAM_LIST__FETCH, async event => {
        const info = persistData.getHistoryPrograms();
        event.sender.send(constant.PROGRAM_LIST__FETCH, info)
    });
}


module.exports = function() {
    directorySelect();
    currentProgramFetch();
    currentProgramSet();
    programListFetch();
};