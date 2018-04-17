const Store = require('electron-store');

const store = new Store();

const setCurrentProgram = ({ path, name }) => {
    store.set('currentPath', path);
    store.set('currentName', name);
};

exports.setCurrentProgram = setCurrentProgram;

exports.getCurrentProgram = () => {
    return {
        path: store.get('currentPath'),
        name: store.get('currentName')
    };
};

exports.appendHistoryProgram = (info) => {
    setCurrentProgram(info);
    let historyPrograms = store.get('historyPrograms');
    if (historyPrograms) {
        historyPrograms = JSON.parse(historyPrograms);
        historyPrograms.push(info);
    } else {
        historyPrograms = [info];
    }
    store.set('historyPrograms', JSON.stringify(historyPrograms));
};

exports.getHistoryPrograms = () => {
    let historyPrograms = store.get('historyPrograms');
    if (historyPrograms) {
        return JSON.parse(historyPrograms);
    }
    return [];
};

exports.removeHistoryPrograms = () => {

};

