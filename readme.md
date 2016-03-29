# gitbook3toedx
> Convert a YAML course definition into importable EDX OLX

## Install

Install it with

```
npm install gitbook3toedx
```
## Usage

```
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

```

## Author

* Vittorio Zaccaria

## License
Released under the BSD License.

***



# New features

-     add tests -- [Mar 29th 16](../../commit/82d5bd3144c34db6448d29a4329180f5cc17f891)
-     emit grading policy file -- [Mar 24th 16](../../commit/fffec90e8f799df3f34f98335c790188917f6490)
-     add exercise conversion -- [Mar 22nd 16](../../commit/36d137297e30ac6dfa4a7c3e117843f379cb4b4c)
-     split sequentials into verticals and identify exercises -- [Mar 18th 16](../../commit/b2700346039d3874aaf1a6860145149b0399ea02)
-     produce one vertical for each sequential -- [Mar 14th 16](../../commit/0d0f7362bbc1ca1cbcfc41f786eef06776292c59)
-     add pack option -- [Mar 11th 16](../../commit/8a0a147e455c0f2d7142679c6a2ee7552b337f71)
-     invoke liquid node for xml generation -- [Mar 8th 16](../../commit/44002e8453bc1af1c62b7ddb00aa26b9606e8b33)
-     use config file in yaml format for everything -- [Mar 7th 16](../../commit/0f732a4c672d3aac81887e009adad339afce0ab4)
-     Read and parse config file -- [Mar 2nd 16](../../commit/2512f5698b575e2bc623dda1f4da7c91b58c1dce)
-     initial import -- [Mar 1st 16](../../commit/11740e549ddc06090a575f17b2a72676bbf938ca)

# Bug fixes

-     add missing dependency -- [Mar 29th 16](../../commit/9bebf09bb7e5cdc74828f8a58a4f64456b084ec2)
-     add moment package -- [Mar 29th 16](../../commit/1f5cdfc6ce71ed6d0e7c6ebd355e79eccd2602b7)
-     remove thematic breaks -- [Mar 21st 16](../../commit/a96c76eb3561f09cdcd4f3cb0fe73e2658ad3ccd)
-     sequential format property -- [Mar 11th 16](../../commit/f86acb960f2d656144af2b5e212fdee3ab873b69)
