let html = require("remark-html");
let flat = require("flat");
let zone = require("mdast-zone");
let b64 = require("base64-url");

const visit = require("unist-util-visit");
let { warn, info, error } = require("./messages");

let { $fs, $b, _ } = require("zaccaria-cli");

let $r = require("remark")();
let $h = require("remark")().use(html, {
  xhtml: true,
  entities: "numbers"
});
//.use(html, {xhtml: true, entities: 'numbers'});

function extractQuiz(p) {
  p.type = "quiz";
  p.choices = p.code.base.split("\n");
  p.solutions = p.code.solution.split("\n");
  p.feedback = p.code.validation;
  p.items = _.map(p.choices, it => {
    return {
      text: it,
      correct: _.includes(p.solutions, it)
    };
  });
  p.code = undefined;
  p.lang = undefined;
  return p;
}

function getExercise(p, init, lastParagraphLine) {
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
  let cha = p.ast.children;
  let content = p.content.split("\n").slice(0, lastParagraphLine).join("\n");
  p = {
    content: content,
    lang: cha[init].lang,
    code: {
      base: cha[init].value,
      solution: cha[init + 1].value,
      validation: cha[init + 2].value,
      context: "",
      lang: cha[init].lang
    },
    type: "exercise"
  };
  if (p.lang === "quiz") {
    return extractQuiz(p);
  } else {
    p.ast = undefined;
    p.grader_payload = {
      payload: b64.encode(JSON.stringify(p.code))
    };
    p.grader_payload = JSON.stringify(p.grader_payload);
    p.code.base = _.escape(p.code.base);
    p.code.solution = _.escape(p.code.solution);
    p.code.validation = _.escape(p.code.validation);
    p.code.context = _.escape(p.code.context);
    return p;
  }
}

function readFile(dir, o) {
  o.content = $fs.readFileAsync(`${dir}/${o.file}`, "utf8");
  return $b.props(o);
}

function expandContent(o) {
  o.markdown = $r.process(o.content);
  return $b.props(o).then(_o => {
    _o.ast = $r.parse(_o.markdown);
    return $b.props(_o);
  });
}

function _debug(o, fn) {
  if (o.file === "arrays/length.md") {
    fn(o);
  }
}

function getBreaks(o) {
  o.breakpoints = [0];
  visit(o.ast, "thematicBreak", x => {
    o.breakpoints.push(x.position.start.line - 1);
  });
  return o;
}

function _isExercise(p) {
  let bitmap = _.map(p.ast.children, x => x.type === "code");
  for (let i = 0; i < bitmap.length - 2; i++) {
    if (bitmap[i] && bitmap[i + 1] && bitmap[i + 2]) {
      return {
        isExercise: true,
        init: i,
        lastParagraphLine: p.ast.children[i].position.start.line - 1
      };
    }
  }
  return {
    isExercise: false
  };
}

function analyzeChunk(o) {
  let p = {};
  p.content = o;
  p.ast = $r.parse(p.content);

  let { isExercise, init, lastParagraphLine } = _isExercise(p);
  if (isExercise) {
    p = getExercise(p, init, lastParagraphLine);
  } else {
    p = _.assign(p, {
      type: "normal"
    });
    p.ast = undefined;
  }
  return p;
}

function displayFileInfo(o) {
  let vrt = [];
  const s = o.breakpoints.length;
  for (let i = 0; i < s - 1; i++) {
    vrt.push(o.breakpoints[i + 1] - o.breakpoints[i]);
  }
  warn(
    `File ${o.file} - pre: ${vrt}, post: ${_.map(
      o.verticals,
      x => x.content.split("\n").length
    )}`
  );
}

function splitOnBreaks(o) {
  const c = o.markdown.split("\n");
  o.breakpoints.push(c.length - 1);

  // so o.breakpoints has at least 2 values
  let verticals = [];

  const s = o.breakpoints.length;
  for (let i = 0; i < s - 1; i++) {
    verticals.push(c.slice(o.breakpoints[i], o.breakpoints[i + 1]));
  }

  verticals = _.map(verticals, c => c.join("\n"));
  verticals = _.map(verticals, c => c.replace(/\* \* \*/g, ""));
  verticals = _.map(verticals, analyzeChunk);
  verticals = _.filter(verticals, v => v.content.length !== 0);
  verticals = _.map(verticals, v => {
    v.content = $h.process(v.content);
    return v;
  });
  o.verticals = verticals;
  o.breakpoints = undefined;
  o.ast = undefined;
  o.content = undefined;
  o.markdown = undefined;
  return o;
}

function readVerticals(dir, file) {
  return readFile(dir, file)
    .then(expandContent)
    .then(getBreaks)
    .then(splitOnBreaks);
}

module.exports = {
  readVerticals
};
