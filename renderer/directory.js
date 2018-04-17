const { ipcRenderer } = require('electron');
const constant = require('../constant');

exports.DirectorySelectStart = () => {
    ipcRenderer.send(constant.DIRECTORY_SELECT__START);
};

exports.DirectorySelectDone = (callback) => {
    ipcRenderer.on(constant.DIRECTORY_SELECT__DONE, (event, message) => {
        callback(message);
    })
};