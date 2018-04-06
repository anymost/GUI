const {ipcMain, dialog} = require('electron');
const childProcess = require('child_process');


exports.createProgram = () => {
    ipcMain.on('createProgram', () => {
        new Promise(resolve => {
            dialog.showOpenDialog({
                title: '请选择安装目录',
                properties: ['openFile', 'openDirectory', 'multiSelections']
            }, filePaths => resolve(filePaths));
        })
            .then(filePath => {
                childProcess.exec(`cd ${filePath} && git clone https://github.com/anymost/vue-auto-generate.git`, err => {
                    if (!err) {
                        console.log('ok');
                        return '';
                    }
                });
            })
            .catch(err => {
                console.log(`err is ${err}`);
            })

    });
};