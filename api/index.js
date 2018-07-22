const program = require('./program');
const directory = require('./directory');
const page = require('./page');

module.exports = function() {
    program();
    directory();
    page();
};

