Usage:
    gitbook3toedx json DIR [ -c CONFIG ]
    gitbook3toedx pack [ -r ]
    gitbook3toedx ( -h | --help )

Options:
    -c, --config CONFIG     specify course configuration [ default: DIR/config.yml ]
    -h, --help              help for gitbook3toedx
    -r, --remove            remove local _course

Commands:
    json                    generate the complete json representation of the course
    pack                    expects a json on stdin, produces a course.tar.gz to be uploaded

Arguments:
    DIR                     directory containing the course
