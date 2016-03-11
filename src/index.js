/* eslint quotes: [0], strict: [0] */
const {
    $d, $o, $f
    // $r.stdin() -> Promise  ;; to read from stdin
} = require('zaccaria-cli')

const path = require('path')
const debug = require('debug')(__filename)
const parse = require('./lib/parse')
const packit = require('./lib/pack')
let { warn, info, error } = require('./lib/messages')

const getOptions = doc => {
    "use strict"
    const o = $d(doc)
    const help = $o('-h', '--help', false, o)
    const remove = $o('-r', '--remove', false, o)
    const json = o['json'] || false;
    const pack = o['pack'] || false;
    const dir = o.DIR || false;
    if (pack) {
        return { pack, json, remove }
    } else {
        const config = $o('-c', '--config', path.normalize(path.join(dir, 'config.yaml')), o);
        const rt = {
            help, dir, config, json, pack
        }
        debug(rt)
        return rt
    }
}

const main = () => {
    $f.readLocal('docs/usage.md').then(it => {
        const {
            help, dir, config, json, pack, remove
        } = getOptions(it);
        if (json) {
            parse(dir, config).then((json) => {
                console.log(JSON.stringify(json, 0, 4));
            })
        } else {
            if (pack) {
                warn('packing up')
                packit({remove}).catch((e) => {
                    error(e);
                });
            } else {
                if (help) {
                    console.log(it)
                }
            }
        }
    })
}

main()
