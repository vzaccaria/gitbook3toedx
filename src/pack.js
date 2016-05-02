const {
    $r, $s, _
} = require('zaccaria-cli')
let { warn, info, error } = require('./messages')

const path = require('path')


function packit(options) {
    const coursedir = path.normalize(path.join(process.cwd(), '_course'))
    return $r.stdin().then((j) => {
        let config = JSON.parse(j)
        warn(`removing ${coursedir} if existing`);
        $s.rm('-rf', coursedir);
        info(`creating ${coursedir}`);
        $s.mkdir('-p', coursedir);
        $s.mkdir('-p', `${coursedir}/about`);
        $s.mkdir('-p', `${coursedir}/policies`);
        //$s.mkdir('-p', `${coursedir}/static/assets`);
        $s.mkdir('-p', `${coursedir}/policies/${config.course.urlName}`);
        _.map(config.expandedFiles, (v, k) => {
            info(`writing ${coursedir}${k}`)
            v.to(`${coursedir}${k}`)
        })
        //$s.cp(__dirname + '/../static/assets/*', `${coursedir}/static/assets`)
        //$s.cp(__dirname + '/../static/index.html', `${coursedir}/static`)
        info('linting course.xml')
        return $s.execAsync(`xmllint ${coursedir}/course.xml --output ${coursedir}/course.xml --pretty 1`);
    }).then(() => {
        info('Creating archive');
        $s.execAsync(`tar cvzf course.tar.gz _course`).then(() => {
            info('done')

            if(options.remove) {
                info(`removing ${coursedir}`)
                $s.rm('-rf', coursedir);
            }
        })
    })
}

module.exports = packit
