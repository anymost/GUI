const { ipcRenderer } = require('electron');
const constant = require('../constant');

exports.DirectorySelectStart = () => {
    ipcRenderer.send(constant.DIRECTORY_SELECT__START);
};

exports.DirectorySelectDone = (callback) => {
    ipcRenderer.on(constant.DIRECTORY_SELECT__DONE, (event, path) => {
        callback(path);
    })
};

exports.CurrentProgramFetchStart = () => {
    ipcRenderer.send(constant.CURRENT_PROGRAM__FETCH);
};

exports.CurrentProgramFetchDone = (callback, cancel) => {
    if (!cancel) {
        ipcRenderer.on(constant.CURRENT_PROGRAM__FETCH, (event, path) => {
            callback(path);
        })
    } else {
        ipcRenderer.removeAllListeners(constant.CURRENT_PROGRAM__FETCH);
    }
};

exports.ProgramListFetchStart = () => {
    ipcRenderer.send(constant.PROGRAM_LIST__FETCH);
};

exports.ProgramListFetchDone = (callback, cancel) => {
    if (!cancel) {
        ipcRenderer.on(constant.PROGRAM_LIST__FETCH, (event, path) => {
            callback(path);
        })
    } else {
        ipcRenderer.removeAllListeners(constant.PROGRAM_LIST__FETCH);
    }
};

exports.CurrentProgramSetStart = (info) => {
    ipcRenderer.send(constant.CURRENT_PROGRAM__SET, info);
};

exports.CurrentProgramSetDone = (callback, cancel) => {
    if (!cancel) {
        ipcRenderer.on(constant.CURRENT_PROGRAM__SET, (event, info) => {
            callback(info);
        })
    } else {
        ipcRenderer.removeAllListeners(constant.CURRENT_PROGRAM__SET);
    }
};

