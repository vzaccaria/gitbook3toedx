let {
    $d, $o, $fs, $yaml
    // $r.stdin() -> Promise  ;; to read from stdin
} = require('zaccaria-cli')



function parse(dir, config) {
    return $fs.readFileAsync(config, 'utf8').then((config) => {
        return $yaml(config)
    })
}

module.exports = parse
