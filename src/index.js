/* eslint quotes: [0], strict: [0] */
let {
    $d, $o, $f
    // $r.stdin() -> Promise  ;; to read from stdin
} = require('zaccaria-cli')

let path = require('path')
let debug = require('debug')(__filename)
let parse = require('./lib/parse')

let getOptions = doc => {
    "use strict"
    let o = $d(doc)
    let help = $o('-h', '--help', false, o)
    let json = o['json'] || false;
    let dir = o.DIR || false;
    let config = $o('-c', '--config', path.normalize(path.join(dir, 'config.yaml')), o);
    let rt = {
        help, dir, config, json
    }
    debug(rt)
    return rt
}

let main = () => {
    $f.readLocal('docs/usage.md').then(it => {
        let {
            help, dir, config, json
        } = getOptions(it);
        if (json) {
            parse(dir, config).then( (json) => {
                console.log(JSON.stringify(json, 0, 4));
            })
        } else {
            if (help) {
                console.log(it)
            }
        }
    })
}

main()
