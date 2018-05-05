const { ipcMain, dialog } = require('electron');
const constant = require('../constant');

function directorySelect() {
    ipcMain.on(constant.DIRECTORY_SELECT__START, async event => {
        try {
            const path = await new Promise((resolve, reject) => {
                dialog.showOpenDialog({
                    title: '请选择安装目录',
                    properties: ['openDirectory']
                }, path => {
                    !path && reject('已取消选择');
                    resolve(path[0]);
                });
            });
            event.sender.send(constant.DIRECTORY_SELECT__DONE, path);
            event.sender.send(constant.HANDLE_MESSAGE, { type: 'success', content: '已选择目录' });
        } catch (error) {
            console.log(error);
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
}

module.exports = function() {
    directorySelect();
};