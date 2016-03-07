let { $fs, $b } = require('zaccaria-cli')
let html = require('remark-html');
let $r = require('remark')().use(html);

function toMarkdown(content) {
    return $r.process(content)
}

function expandContent(dir, o) {
    o.content = $fs.readFileAsync(`${dir}/${o.file}`, 'utf8').then(toMarkdown)
    return $b.props(o)
}


module.exports = expandContent
