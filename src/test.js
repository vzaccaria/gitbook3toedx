/*eslint quotes: [0] */

var chai = require('chai')
chai.use(require('chai-as-promised'))
var should = chai.should()

var z = require('zaccaria-cli')
var promise = z.$b
var fs = z.$fs
let _ = require('zaccaria-cli')._

/**
 * Promised version of shelljs exec
 * @param  {string} cmd The command to be executed
 * @return {promise}     A promise for the command output
 */
function exec(cmd) {
    "use strict"
    return new promise((resolve, reject) => {
        require('shelljs').exec(cmd, {
            async: true,
            silent: true
        }, (code, output) => {
            if (code !== 0) {
                reject(output)
            } else {
                resolve(output)
            }
        })
    })
}

/*global describe, it, before, beforeEach, after, afterEach */

describe('#command', () => {
    "use strict"
    it('should show help', () => {
        var usage = fs.readFileSync(`${__dirname}/../docs/usage.md`, 'utf8')
        return exec(`${__dirname}/../index.js -h`).should.eventually.contain(usage)
    })
})

let jsonTest = [{
    msg: "generate valid html",
    cmd: "SILENT=1 ./index.js json ./fixtures/source | jq '.chapters[].sequentials[].verticals[].content'",
    file: './fixtures/test/content.json'
}, {
    msg: "recognize types of verticals",
    cmd: "SILENT=1 ./index.js json ./fixtures/source | jq '.chapters[].sequentials[].verticals[].type'",
    file: './fixtures/test/types.json'
}]

describe('#json', () => {
    _.map(jsonTest, (j) => {
        let q = j
        it(`should ${q.msg} [ ${q.cmd} > ${q.file} ] `, () => {
            let f = fs.readFileSync(q.file, 'utf8');
            return exec(q.cmd).should.eventually.equal(f);
        })
    })
})
