const fs = require('fs');
const path = require('path');
const { getCurrentProgram } = require('../tools/persistData');

const firstCamel = value => {
    const words =  value.split();
    words[0] = words[0].toLocaleLowerCase();
    return words.join();
};

exports.generateRoute = function({ path: route, name }) {
    const { path: programPath } = getCurrentProgram();
    const filePath = path.join(programPath, '/src/router/routeConfig.js');
    const fileBuffer = fs.readFileSync(filePath);
    let fileString = fileBuffer.toString();
    fileString = fileString.replace(/const routeConfig = \[/, `
    import ${name} from '../view/${firstCamel(name)}/${name}';
    const routeConfig = \[
        { path: '/${route}', component: ${name} },
    `);
    fs.writeFileSync(filePath, fileString);
};
