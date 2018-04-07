const {ipcMain, dialog} = require('electron');
const gitClone = require('git-clone-or-pull');
const childProcess = require('child_process');



const createProgram = () => {
    ipcMain.on('createProgram', () => {
        new Promise((resolve, reject) => {
            dialog.showOpenDialog({
                title: '请选择安装目录',
                properties: ['openDirectory']
            }, path => {
                if (!path) {
                    reject('已取消安装项目');
                }
                resolve(path[0])
            });
        })
        .then(path => {
            gitClone('https://github.com/anymost/vue-auto-generate.git', path, err => {
                console.log(err);
                if (err) {
                    return new Error(err);
                }
                ipcMain.send('createProgramDone');
            });
        })
        .catch(err => {
            console.log(err);
            ipcMain.send('error', `err is ${err}`);
        })

    });
};

module.exports = function (){
    createProgram();
};