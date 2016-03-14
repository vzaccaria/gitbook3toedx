let {
    $d, $o, $fs, $yaml, _
    // $r.stdin() -> Promise  ;; to read from stdin
} = require('zaccaria-cli')

let $t = require('moment')
let uid = require('uid')
let { expandContent, expandTemplates } = require('./expandContent')
let { warn, info, error } = require('./messages')

let slugify = require("underscore.string/slugify");

let $b = require('bluebird');

function fixStartDate(d, x) {
    if (!_.isUndefined(x.scheduledWeek)) {
        x.start = $t(d, "YYYY MM DD").add(x.scheduledWeek, 'week').format("YYYY MM DD")
    }
    return x;
}

function fixSequentialNameAndType(config, s) {
    s = fixStartDate(config.course.start, s)
    if(!_.isUndefined(s.gradeAs) && _.isUndefined(config.grading.GRADER[s.gradeAs])) {
        throw `grading type ${s.gradeAs} does not exist`
    } else {
        s.format = s.gradeAs
        s.graded = !_.isUndefined(s.format)
    }
    s.displayName = s.name
    s.urlName = slugify(s.name)+`-${uid(8)}`

    return s;
}

function fixChaptersAndSequentialsNames(config) {
    config.chapters = _.map(config.chapters, (c) => {
        c = fixStartDate(config.course.start, c)
        c.sequentials = _.map(c.sequentials, _.curry(fixSequentialNameAndType)(config))

        c.displayName = c.name
        c.urlName = slugify(c.name)+`-${uid(8)}`
        return c;
    })
    return config
}

function fixCourseAndOrganizationName(config) {
    // Fix course
    config.course.urlName = `${config.course.year}-${config.course.season}`;
    config.course.displayName = config.course.name
    config.course.name = slugify(config.course.name)

    // Fix organization
    config.organization.displayName = config.organization.name
    config.organization.name = slugify(config.organization.name)

    // Delete the following..
    return config

}

function loadAllMarkdownContent(dir, config) {
    config.chapters = $b.map(config.chapters, (c) => {
        c.sequentials = $b.map(c.sequentials, (s) => {
            return expandContent(dir, s) //
        })
        c = expandContent(dir, c) // Expand chapter introduction.
        return c
    })
    return $b.props(config)
}

function produceVertical(name, content) {
    // should have an urlName and a type (default=='normal') and a content
    const urlName = slugify(name)+`-${uid(8)}`
    const type = 'normal'
    return { urlName, type, content }
}

function produceVerticals(config) {
    config.chapters = _.map(config.chapters, (c) => {

        // Each sequential has a markdown file that should become a vertical
        c.sequentials = _.map(c.sequentials, (s) => {
            s.verticals = [ produceVertical(s.displayName, s.content ) ]
            s.content = undefined
            return s
        });

        // Each chapter has an initial sequential with a single vertical
        const vertical = produceVertical(c.displayName, c.content);
        const firstsequential = {
            displayName: c.name,
            urlName: c.urlName+'-STARTSEQ',
            verticals: [ vertical ]
        }
        c.sequentials = [ firstsequential ].concat(c.sequentials)
        c.content = undefined
        return c
    })
    return config
}

function parse(dir, config) {
    let files = [
        config
    ];
    files = _.map(files, (x) => $fs.readFileAsync(x, 'utf8'))
    return $b.all(files).then(([config]) => {
        config = $yaml(config);
        return config
    })
        .then(fixCourseAndOrganizationName)
        .then(fixChaptersAndSequentialsNames)
        .then((config) => loadAllMarkdownContent(dir, config))
        .then(produceVerticals)
        .then(expandTemplates)
}


module.exports = parse
