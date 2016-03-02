#!/usr/bin/env node
/* eslint quotes: [0], strict: [0] */
"use strict";

var _require = require("zaccaria-cli");

var $d = _require.$d;
var $o = _require.$o;
var $f
// $r.stdin() -> Promise  ;; to read from stdin
= _require.$f;

var path = require("path");
var debug = require("debug")(__filename);

var getOptions = function (doc) {
    "use strict";
    var o = $d(doc);
    var help = $o("-h", "--help", false, o);
    var dir = o.DIR || false;
    var config = $o("-c", "--config", path.normalize(path.join(dir, "config.yaml")), o);
    var rt = {
        help: help, dir: dir, config: config
    };
    debug(rt);
    return rt;
};

var main = function () {
    $f.readLocal("docs/usage.md").then(function (it) {
        var _getOptions = getOptions(it);

        var help = _getOptions.help;

        if (help) {
            console.log(it);
        }
    });
};

main();
