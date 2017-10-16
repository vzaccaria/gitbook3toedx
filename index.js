#!/usr/bin/env node
/* eslint quotes: [0], strict: [0] */
const {
    $d, $o, $f, $fs
    // $r.stdin() -> Promise  ;; to read from stdin
} = require('zaccaria-cli');

const path = require('path');
const debug = require('debug')(__filename);
const parse = require('./lib/parse');
const packit = require('./lib/pack');
let { warn, info, error } = require('./lib/messages');

const getOptions = doc => {
    "use strict";

    const o = $d(doc);
    const help = $o('-h', '--help', false, o);
    const remove = $o('-r', '--remove', false, o);
    const json = o['json'] || false;
    const pack = o['pack'] || false;
    const info = o['info'] || false;
    const dir = o.DIR || false;
    if (pack) {
        return { pack, json, remove };
    } else {
        const config = $o('-c', '--config', path.normalize(path.join(dir, 'config.yaml')), o);
        const rt = {
            help, dir, config, json, pack, info
        };
        debug(rt);
        return rt;
    }
};

function printCourseInfo(it) {
    console.log("Course name:    " + it.course.displayName + " (not part of the url)");
    console.log("Organization:   " + it.organization.name);
    console.log("Course number:  " + it.course.number);
    console.log("Course run:     " + it.course.year + "-" + it.course.season);
}

const main = () => {
    $fs.readFileAsync(__dirname + '/docs/usage.md', 'utf8').then(it => {
        const {
            help, dir, config, json, pack, remove, info
        } = getOptions(it);
        if (json || info) {
            parse(dir, config).then(jj => {
                if (json) {
                    console.log(JSON.stringify(jj, 0, 4));
                } else {
                    printCourseInfo(jj);
                }
            });
        } else {
            if (pack) {
                warn('packing up');
                packit({ remove }).catch(e => {
                    error(e);
                });
            } else {
                if (help) {
                    console.log(it);
                }
            }
        }
    });
};

main();
