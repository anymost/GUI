// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');

exports.handleError = () => {
    ipcRenderer.on('handleError', (event, message) => {
        callback({
            type: 'error',
            content: message
        })
    });
};

exports.handleMessage = (callback) => {
    ipcRenderer.on('handleMessage', (event, message) => {
        callback(message)
    });
};

exports.createProgram = () => {
    ipcRenderer.send('createProgram');
};

exports.installDependencies = () => {
    ipcRenderer.send('installDependencies');
};

exports.runProgram = () => {
    ipcRenderer.send('runProgram');
};

exports.buildProgram = () => {
    ipcRenderer.send('buildProgram');
};


