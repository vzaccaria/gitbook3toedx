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

function fixSequential(config, s) {
    s = fixStartDate(config.course.start, s)
    if(!_.isUndefined(s.gradeAs) && _.isUndefined(config.grading.GRADER[s.gradeAs])) {
        throw `grading type ${s.gradeAs} does not exist`
    } else {
        s.format = config.grading.GRADER[s.gradeAs]
        s.graded = !_.isUndefined(s.format)
    }
    s.displayName = s.name
    s.urlName = slugify(s.name)+`-${uid(8)}`

    return s;
}

function fixChaptersAndSequentials(config) {
    config.chapters = _.map(config.chapters, (c) => {
        c = fixStartDate(config.course.start, c)
        c.sequentials = _.map(c.sequentials, _.curry(fixSequential)(config))

        c.displayName = c.name
        c.urlName = slugify(c.name)+`-${uid(8)}`
        return c;
    })
    return config
}

function postParse(config) {
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

function expandAllContent(dir, config) {
    config.chapters = $b.map(config.chapters, (c) => {
        c.sequentials = $b.map(c.sequentials, (s) => {
            return expandContent(dir, s)
        })
        c = expandContent(dir, c)
        return c
    })
    return $b.props(config)
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
        .then(postParse)
        .then(fixChaptersAndSequentials)
        .then(_.curry(expandAllContent)(dir))
        .then(expandTemplates)
}


module.exports = parse
