let html = require('remark-html');
let flat = require('flat')
let zone = require('mdast-zone')

const visit = require('unist-util-visit')

let {
    $fs, $b, _
} = require('zaccaria-cli')

let $r = require('remark')()
let $h = require('remark')().use(html, {xhtml: true, entities: 'numbers'});
    //.use(html, {xhtml: true, entities: 'numbers'});


function getExercise(p) {
    /* Json schema of the vertical {
       content: ...
       lang:
       code:
            base:
            solution:
            validation:
            context
            lang
       grader_payload: (base64 encode of {^code})
     }
    */
    let cha = p.ast.children
    let init = p.init
    let content = (p.content.split('\n').slice(0, p.lastParagraphLine)).join('\n')
    p = {
        content: content,
        lang: cha[init].lang,
        code: {
            base: cha[init].value,
            solution: cha[init+1].value,
            validation: cha[init+2].value,
            context: "",
            lang: cha[init].lang
        },
        type: "exercise"
    }
    p.ast = undefined
    p.grader_payload = "XYZ"
    return p;
}


function readFile(dir, o) {
    o.content = $fs.readFileAsync(`${dir}/${o.file}`, 'utf8')
    return $b.props(o)
}

function expandContent(o) {
    o.ast = $r.parse(o.content)
    o.markdown = $r.process(o.content)
    return $b.props(o)
}

function getBreaks(o) {
    o.breakpoints = [0]
    visit(o.ast, 'thematicBreak', (x) => o.breakpoints.push(x.position.start.line - 1))
    return o
}

function isExercise(p) {
    let bitmap = _.map(p.ast.children, (x) => x.type === 'code');
    for(let i=0; i<bitmap.length-2; i++) {
        if(bitmap[i] && bitmap[i+1] && bitmap[i+2]) {
            p.isExercise = true;
            p.init = i;
            p.lastParagraphLine = p.ast.children[i].position.start.line - 1;
            return getExercise(p);
        }
    }
    p.isExercise = false;
    p.type = 'normal'
    p.ast = undefined
    return p;
}

function analyzeChunk(o) {
    let p = {}
    p.content = o
    p.ast = $r.parse(p.content)
    return isExercise(p)
}

function splitOnBreaks(o) {
    const c = o.markdown.split('\n')
    o.breakpoints.push(c.length -1)
    let verticals = []

    // so o.breakpoints has at least 2 values
    const s = o.breakpoints.length
    for(let i=0; i< (s-1); i++) {
        verticals.push(c.slice(o.breakpoints[i], o.breakpoints[i+1]))
    }
    verticals = _.map(verticals, (c) => c.join('\n'))
    verticals = _.map(verticals, analyzeChunk)
    verticals = _.map(verticals, (v) => {
        v.content = $h.process(v.content)
        return v
    })
    o.verticals = verticals
    o.breakpoints = undefined
    o.ast = undefined
    o.content = undefined
    o.markdown = undefined
    return o
}

function readVerticals(dir, file) {
    return readFile(dir, file)
    .then(expandContent)
    .then(getBreaks)
    .then(splitOnBreaks)
}

module.exports = { readVerticals }
