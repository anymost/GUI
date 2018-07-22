const { ipcRenderer } = require('electron');
const constant = require('../constant');

exports.PageCreate = (config) => {
    ipcRenderer.send(constant.PAGE_CREATE, config);
};

exports.ComponentCreate = () => {
    ipcRenderer.send(constant.COMPONENT_CREATE);
};

exports.VuexStoreCreate = () => {
    ipcRenderer.send(constant.VUEX_STORE_CREATE);
};


exports.FineStoreCreate = () => {
    ipcRenderer.send(constant.FINE_STORE_CREATE);
};