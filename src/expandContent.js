let { $fs, $b, _ } = require('zaccaria-cli')
let html = require('remark-html');
// Use xhtml for remark to force self closing tags..
let $r = require('remark')().use(html, {xhtml: true});
let Liquid = require("liquid-node")
let engine = new Liquid.Engine
let datejs = require('moment')

let { warn, info, error } = require('./messages')

function toMarkdown(content) {
    return $r.process(content)
}

function expandContent(dir, o) {
    info(`reading ${dir}/${o.file}`);
    o.content = $fs.readFileAsync(`${dir}/${o.file}`, 'utf8').then(toMarkdown)
    return $b.props(o)
}

let files = {
    '/course.xml': $fs.readFileSync(__dirname+'/../templates/course.xml', 'utf-8'),
    '/about/overview.html': $fs.readFileSync(__dirname+'/../templates/overview.html', 'utf-8'),
    '/about/short_description.html': $fs.readFileSync(__dirname+'/../templates/short_description.html', 'utf-8')
}

engine.registerFilters({
    markdown: $r.process,
    datejs: (input) => {
        return datejs(new Date(input)).toISOString()
    }
})


function expandTemplates(config) {
    config.originalFiles = $b.props(files)
    config.expandedFiles = config.originalFiles.then((_files) => {
        // (1) Once template files have been read
        return $b.props(_.mapValues(_files, (content) => {
            // (3) Render then content with config
            return engine.parseAndRender(content, config)
        }))
    })
    return $b.props(config)
}



module.exports = { expandContent, expandTemplates }
