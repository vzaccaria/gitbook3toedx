#!/usr/bin/env node
/* eslint quotes: [0], strict: [0] */
"use strict";

var _require = require("zaccaria-cli");

var $d = _require.$d;
var $o = _require.$o;
var $f = _require.$f;
var $fs
// $r.stdin() -> Promise  ;; to read from stdin
= _require.$fs;

var path = require("path");
var debug = require("debug")(__filename);
var parse = require("./lib/parse");
var packit = require("./lib/pack");

var _require2 = require("./lib/messages");

var warn = _require2.warn;
var info = _require2.info;
var error = _require2.error;

var getOptions = function (doc) {
    "use strict";
    var o = $d(doc);
    var help = $o("-h", "--help", false, o);
    var remove = $o("-r", "--remove", false, o);
    var json = o.json || false;
    var pack = o.pack || false;
    var info = o.info || false;
    var dir = o.DIR || false;
    if (pack) {
        return { pack: pack, json: json, remove: remove };
    } else {
        var config = $o("-c", "--config", path.normalize(path.join(dir, "config.yaml")), o);
        var rt = {
            help: help, dir: dir, config: config, json: json, pack: pack, info: info
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

var main = function () {
    $fs.readFileAsync(__dirname + "/docs/usage.md", "utf8").then(function (it) {
        var _getOptions = getOptions(it);

        var help = _getOptions.help;
        var dir = _getOptions.dir;
        var config = _getOptions.config;
        var json = _getOptions.json;
        var pack = _getOptions.pack;
        var remove = _getOptions.remove;
        var info = _getOptions.info;

        if (json || info) {
            parse(dir, config).then(function (jj) {
                if (json) {
                    console.log(JSON.stringify(jj, 0, 4));
                } else {
                    printCourseInfo(jj);
                }
            });
        } else {
            if (pack) {
                warn("packing up");
                packit({ remove: remove })["catch"](function (e) {
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
