const { ipcRenderer } = require('electron');
const constant = require('../constant');


exports.ProgramCreate = (info) => {
    ipcRenderer.send(constant.PROGRAM_CREATE, info);
};

exports.ProgramInfo = (callback, cancel) => {
    if (!cancel) {
        ipcRenderer.on(constant.PROGRAM_INFO, (event, info) => {
            callback(info);
        });
    } else {
        ipcRenderer.removeAllListeners(constant.PROGRAM_INFO);
    }
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
