let chalk = require('chalk')

function warn(msg) {
    console.error(chalk.yellow('WARN: ') + msg);
}

function info(msg) {
    console.error(chalk.blue('INFO: ') + msg);
}

function error(msg) {
    console.error(chalk.blue(' ERR: ') + msg);
}

module.exports = { warn, info, error }
