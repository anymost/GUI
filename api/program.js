const {ipcMain, dialog} = require('electron');
const git = require('nodegit');



async function createProgram() {
    let event;
    try {
        event = await new Promise(resolve => {
            ipcMain.on('createProgram',event => resolve(event));
        });
        const path = await new Promise((resolve, reject) => {
            dialog.showOpenDialog({
                title: '请选择安装目录',
                properties: ['openDirectory']
            }, path => {
                if (!path) {
                    reject('已取消安装项目');
                }
                resolve(path[0])
            });
        });
        await git.Clone('https://github.com/anymost/vue-auto-generate.git', path);
        event.sender.send('handleMessage', '项目下载完成');
    } catch (error) {
        console.log(error);
        if (event) {
            event.sender.send('handleError', `err is ${error}`);
        }
    }
}


module.exports = function (){
    createProgram();
};