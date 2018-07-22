const { ipcMain } = require('electron');
const constant = require('../constant');
const childProcess = require('child_process');
const detectNPM = require('../tools/detectNPM');
const { getCurrentProgram } = require('../tools/persistData');
const { generateRoute } = require('../tools/generateRoute');


function createPage() {
    ipcMain.on(constant.PAGE_CREATE, async (event, config) => {
        try {
            await detectNPM();
            const  { path: currentProgramPath } = getCurrentProgram();
            const { path, name } = config;
            if (!currentProgramPath) {
                throw new Error('当前安装目录不存在');
            }
            await new Promise((resolve, reject) => {
                childProcess.exec(`vg view ${name} -f`, {cwd: currentProgramPath},
                error => {
                    error && reject(error);
                    resolve();
                });
            });
            generateRoute({ path, name });
        } catch (error) {
            if(error.killed){
                return;
            }
            console.log(error);
            event && event.sender.send(constant.HANDLE_ERROR, error);
        }
    });
}

function createComponent() {

}

function createVuexStore() {

}

function createFineStore() {

}

module.exports = function () {
  createPage();
  createComponent();
  createVuexStore();
  createFineStore();
};