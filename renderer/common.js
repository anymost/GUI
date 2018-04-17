const { ipcRenderer } = require('electron');
const constant = require('../constant');

exports.HandleError = (callback) => {
    ipcRenderer.on(constant.HANDLE_ERROR, (event, message) => {
        callback({
            type: 'error',
            content: JSON.stringify(message)
        })
    });
};

exports.HandleMessage = (callback) => {
    ipcRenderer.on(constant.HANDLE_MESSAGE, (event, message) => {
        callback(message)
    });
};