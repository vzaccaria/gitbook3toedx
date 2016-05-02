let {
    $d, $o, $fs, $yaml, _
    // $r.stdin() -> Promise  ;; to read from stdin
} = require('zaccaria-cli')

let $t = require('moment')
let uid = require('uid')
let {
    expandTemplates
} = require('./expandContent')
let {
    readVerticals
} = require('./readVerticals')
let {
    warn, info, error
} = require('./messages')
let debug = require('debug')(__filename)

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
    if (!_.isUndefined(s.gradeAs) && _.isUndefined(config.grading.GRADER[s.gradeAs])) {
        throw `grading type ${s.gradeAs} does not exist as a key in the GRADER subsection`
    } else {
        s.format = s.gradeAs
        s.graded = !_.isUndefined(s.format)
    }
    s.displayName = s.name
    s.urlName = slugify(s.name) + `-${uid(8)}`

    return s;
}

function fixChaptersAndSequentialsNames(config) {
    config.chapters = _.map(config.chapters, (c) => {
        c = fixStartDate(config.course.start, c)
        c.sequentials = [{
            name: c.name,
            scheduledWeek: c.scheduledWeek,
            file: c.file
        }].concat(c.sequentials)
        c.sequentials = _.map(c.sequentials, _.curry(fixSequentialNameAndType)(config))
        c.displayName = c.name
        c.urlName = slugify(c.name) + `-${uid(8)}`
        c.file = undefined
        c.scheduledWeek = undefined
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
            return readVerticals(dir, s) //
        })
        return $b.props(c)
    })
    return $b.props(config)
}

function produceVertical(name, vertical) {
    // should have an urlName and a type (default=='normal') and a content
    vertical.urlName = slugify(name) + `-${uid(8)}`
    return vertical
}

function produceVerticals(config) {
    config.chapters = _.map(config.chapters, (c) => {
        // Each sequential has a markdown file that should become a vertical
        c.sequentials = _.map(c.sequentials, (s) => {
            s.verticals = _.map(s.verticals, _.curry(produceVertical)(s.name))
            return s
        });
        return c
    })
    return config
}

function printGradingInfo(data) {
    let Table = require('easy-table');
    info('Grading information:\n' + Table.print(data));
}

function addGradingPolicy(config) {
    let data = []
    let gradedVerticals = []
    config.chapters = _.map(config.chapters, (c) => {
        c.sequentials = _.map(c.sequentials, (s) => {
            s.verticals = _.map(s.verticals, (v, k, o) => {
                if(v.type !== 'normal' && _.isUndefined(s.gradeAs)) {
                    //warn(`Exercise not graded: vertical n. ${k} in ${c.displayName}/${s.displayName} - type ${v.type}`)
                    data.push({verticalName: `${c.displayName}/${s.displayName}`, type: v.type, graded: false, gradedAs: ''})
                } else {
                    if(v.type !== 'normal') {
                        v.gradeAs = s.gradeAs
                        //info(`Exercise graded    : vertical n. ${k} in ${c.displayName}/${s.displayName} - type ${v.type} graded as ${v.gradeAs}`)
                        gradedVerticals.push(v)
                        data.push({verticalName: `${c.displayName}/${s.displayName}`, type: v.type, graded: true, gradedAs: v.gradeAs})
                    }
                }
                return v
            })
            return s
        })
        return c
    })
    if (!_.isUndefined(config.grading)) {
        let grading = config.grading;
        grading.GRADER = _.map(grading.GRADER, (v, k) => {
            v.short_label = k
            v.min_count = _.countBy(gradedVerticals, (g) => {
                return g.gradeAs === k
            }).true
            return v
        })
        config.expandedFiles[`/policies/${config.course.urlName}/grading_policy.json`] = JSON.stringify(config.grading, 0, 4)
    }
    printGradingInfo(data)
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
        .then(addGradingPolicy)
}


module.exports = parse
