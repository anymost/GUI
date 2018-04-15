// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');
const constant = require('./constant');

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



exports.ProgramCreate = () => {
    ipcRenderer.send(constant.PROGRAM_CREATE);
};

exports.ProgramInstall = (action) => {
    action === 'start'?
    ipcRenderer.send(constant.PROGRAM_INSTALL__START):
    ipcRenderer.send(constant.PROGRAM_INSTALL__STOP);
};

exports.ProgramInstallStatus = (callback) => {
    ipcRenderer.on(constant.PROGRAM_INSTALL__STATUS, (event, message) => {
        callback(message);
    })
};

exports.ProgramRun = (action) => {
    action === 'start'?
    ipcRenderer.send(constant.PROGRAM_RUN__START):
    ipcRenderer.send(constant.PROGRAM_RUN__STOP);
};



exports.ProgramRunStatus = (callback) => {
    ipcRenderer.on(constant.PROGRAM_RUN__STATUS, (event, message) => {
        callback(message);
    })
};


exports.ProgramBuild = (action) => {
    action === 'start' ?
    ipcRenderer.send(constant.PROGRAM_BUILD__START):
    ipcRenderer.send(constant.PROGRAM_BUILD__STOP);
};


exports.ProgramBuildStatus = (callback) => {
    ipcRenderer.on(constant.PROGRAM_BUILD__STATUS, (event, message) => {
        callback(message);
    })
};

