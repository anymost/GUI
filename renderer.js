// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');

exports.handleError = () => {
    ipcRenderer.on('handleError', message => {

    });
};

exports.handleMessage = () => {
    ipcRenderer.on('handleMessage', message => {

    });
};

exports.createProgram = () => {
    ipcRenderer.send('createProgram');
};


