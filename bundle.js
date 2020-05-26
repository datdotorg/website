(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const csjs = require('csjs-inject')
const main = require('../')
const theme = require('theme')

const el = (err, loadPage) => {
    const vars = theme
    const styles = csjs`
    * {
        box-sizing: border-box;
    }
    html {
        font-size: 62.5%;
    }
    body {
        font-family: var(--bodyFont);
        font-size: var(--bodyFontSize);
        color: var(--bodyColor);
        margin: 0;
        padding: 0;
    }
    img {
        width: 100%;
        height: auto;
    }
    button {
        border: none;
        background: none;
        cursor: pointer;
    }
    `
    document.body.style = styles

    if (err) {
        document.body.style = `color: red; font-size: 1.6rem; text-align:center; background-color: #d9d9d9;`
        document.body.innerHTML = `<p>${err.stack}</p>`
    } else {
        document.body.appendChild(loadPage)
    }

    updateTheme(vars)
} 

function updateTheme (vars) {
    Object.keys(vars).forEach(name => {
      document.body.style.setProperty(`--${name}`, vars[name])
    })
}



main({theme}, el)
},{"../":27,"csjs-inject":7,"theme":2}],2:[function(require,module,exports){
const defines = {
    font: {
        arial: 'Arial, Helvetica, sans-serif',
        courier: '"Courier New", Courier, monospace'
    },
    size: {
        'xx-small'      : '1.2rem',
        'x-small'       : '1.3rem',
        small           : '1.4rem',
        medium          : '1.6rem',
        large           : '2rem',
        'x-large'       : '3rem',
        'xx-large'      : '4rem',
        'xxx-large'     : '5rem',
    },
    color: {
        white: '#fff',
        black: '#000',
        greyCC: '#ccc',
        greyD9: '#d9d9d9',
        greyDD: '#DDDDDD',
        greyEA: '#EAEAEA',
        grey88: '#888',
        grey70: '#707070',
        blue: 'blue',
        red: 'red',
        orange: 'orange',
    }
    
}

const { font, size, color } = defines

const theme = {
    '// Body setting' : '---------------------',
    bodyFont: font.arial,
    bodyFontSize: size.medium,
    bodyColor: color.black,
    '// Desktop app list setting' : '---------------------',
    appNameFontSize: size['xx-small'],
    appNameColor: color.black,
    appHoverColor: color.blue,
    '// OpenWindow setting' : '---------------------',
    panelBodyBgColor: color.white,
    panelHeaderBgColor: color.white,
    panelHeaderTitleColor: color.grey70,
    panelHeaderTitleSize: size['xx-small'],
    panelBorder: '4px',
    panelBorderColor: color.grey70,
    panelBodyBgColor: color.white,
    '// AppInfo setting' : '---------------------',
    appInfoSidebarBgColor: color.greyEA,
    appInfoSidebarFontSize: size['xx-small'],
    appInfoSidebarColor: color.black,
    appInfoSidebarNavCurrentBgColor: color.white,
    appInfoSidebarShrinkBgColor: color.greyDD,
    appInfoSidebarShrinkHoverBgColor: color.greyCC,
}

module.exports = theme
},{}],3:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],4:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":3,"hyperx":25}],5:[function(require,module,exports){
(function (global){
'use strict';

var csjs = require('csjs');
var insertCss = require('insert-css');

function csjsInserter() {
  var args = Array.prototype.slice.call(arguments);
  var result = csjs.apply(null, args);
  if (global.document) {
    insertCss(csjs.getCss(result));
  }
  return result;
}

module.exports = csjsInserter;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"csjs":10,"insert-css":26}],6:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":9}],7:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":5,"./get-css":6}],8:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":14}],9:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":18}],10:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":8,"./get-css":9}],11:[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],12:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":13}],13:[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],14:[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":12,"./composition":13,"./css-extract-extends":15,"./css-key":16,"./extract-exports":17,"./scopeify":23}],15:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":13}],16:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],17:[function(require,module,exports){
'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}

},{"./regex":20}],18:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":16}],19:[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],20:[function(require,module,exports){
'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};

},{}],21:[function(require,module,exports){
var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./regex":20}],22:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":11,"./hash-string":19}],23:[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

},{"./regex":20,"./replace-animations":21,"./scoped-name":22}],24:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],25:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":24}],26:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],27:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')
const Desktop = require('Desktop')
const OpenWindow = require('OpenWindow')
const AppInfo = require('AppInfo')

function main(opts, done) {
    const { theme } = opts
    const css = style
    let apps = [
        {
            id: 1,
            name: css.software,
            title: 'DatDot.install',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 2,
            name: css.software1,
            title: 'Long name app Long name app Long name app Long name app',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 3,
            name: css.software2,
            title: 'App1',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 4,
            name: css.software1,
            title: 'App2',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 5,
            name: css.software2,
            title: 'App3',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 6,
            name: css.software1,
            title: 'App4',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 7,
            name: css.software2,
            title: 'App5',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 8,
            name: css.software1,
            title: 'App6',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 9,
            name: css.software2,
            title: 'App7',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 10,
            name: css.software1,
            title: 'App8',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 11,
            name: css.software2,
            title: 'App9',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 12,
            name: css.software1,
            title: 'App10',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 13,
            name: css.software2,
            title: 'App11',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 14,
            name: css.software1,
            title: 'App12',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 15,
            name: css.software2,
            title: 'App13',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 16,
            name: css.software1,
            title: 'App14',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 17,
            name: css.software2,
            title: 'App15',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 18,
            name: css.software1,
            title: 'App16',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 19,
            name: css.software2,
            title: 'App17',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 20,
            name: css.software1,
            title: 'App88',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 21,
            name: css.software2,
            title: 'App89',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        }
    ]

    const loadPage = bel`${Desktop(apps, openTarget)}`
    return done(null, loadPage)

    function loadAppContent(el, app) {
        return bel`${el}`
    }

    function openTarget(app) {
        if (app.open) return
        const newApps = [...apps]
        newApps.map( obj => app.id === obj.id ? obj.open = true : obj )
        apps = newApps
        // console.log(apps)
        return loadPage.appendChild( OpenWindow(app, AppInfo, loadAppContent) )
    }

}
const style =  csjs`
.software {}
.software1 {}
.software2 {}
`
module.exports = main
},{"AppInfo":28,"Desktop":29,"OpenWindow":31,"bel":4,"csjs-inject":7}],28:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')
// widgets
const Graphic = require('Graphic')


function AppInfo(app, protocol) {
    const css = style
    let info = Graphic('./src/node_modules/assets/svg/info.svg', css.icon)
    let doc = Graphic('./src/node_modules/assets/svg/doc.svg', css.icon)
    let settings = Graphic('./src/node_modules/assets/svg/settings.svg', css.icon)
    let news = Graphic('./src/node_modules/assets/svg/news.svg', css.icon)
    let about = Graphic('./src/node_modules/assets/svg/about.svg', css.icon)
    let chat = Graphic('./src/node_modules/assets/svg/chat.svg', css.icon)
    let supplyTree = Graphic('./src/node_modules/assets/svg/supply-tree.svg', css.icon)
    let shrink = Graphic('./src/node_modules/assets/svg/double-arrow.svg', css.icon)

    const nav = bel` 
    <nav class=${css.nav}>
        <a href="#info" class=${css.current} onclick=${()=>switchPageHandler('#info')}>${info} Introduction</a>
        <a href="#doc" onclick=${()=>switchPageHandler('#doc')}>${doc} Documentation</a>
        <a href="#settings" onclick=${()=>switchPageHandler('#settings')}>${settings} Settings</a>
        <a href="#news" onclick=${()=>switchPageHandler('#news')}>${news} News</a>
        <a href="#about" onclick=${()=>switchPageHandler('#about')}>${about} About</a>
        <a href="#chat" onclick=${()=>switchPageHandler('#chat')}>${chat} Support Chat</a>
        <a href="#supplyTree" onclick=${()=>switchPageHandler('#supplyTree')}>${supplyTree} Supply tree</a>
    </nav>`

    const el = bel`
    <div class=${css.container}>
        <div class=${css.sidebar}>
           ${nav}
            <button class="${css.btn} ${css.shrink}">${shrink}</button>
        </div>
        <div class=${css.content}></div>
    </div>
    `
    return el

    function switchPageHandler(target) {
        // get all a tag name from nav
        const pages = nav.querySelectorAll('a')
        // switch current page
        pages.forEach( page => { 
            page.getAttribute('href') === target
            ? page.classList.add(css.current) 
            : page.classList.remove(css.current) } ) 
        }
}



const style = csjs`
.container {
    display: grid;
    grid-template: 1fr / 150px auto;
    height: 100%;
}
.sidebar {
    display: grid;
    grid-template-columns: 150px;
    grid-template-rows: auto 30px;
    grid-template-areas: 
    'nav'
    'shrink';
    background-color: var(--appInfoSidebarBgColor);
}
.nav {
    grid-area: nav;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, 44px);
    grid-auto-flow: column;
}
.nav a {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 38px auto;
    align-items: center;
    font-size: var(--appInfoSidebarFontSize);
    color: var(--appInfoSidebarColor);
    text-decoration: none;
}
/* current page info */
.current {
    background-color: var(--appInfoSidebarNavCurrentBgColor);
}
.icon {
    justify-self: center;
}
.btn {
   outline: none;
}
.btn:hover {
    background-color: var(--appInfoSidebarShrinkHoverBgColor);
}
.shrink {
    grid-area: shrink;
    display: block;
    text-align: right;
    background-color: var(--appInfoSidebarShrinkBgColor);
}
/* App info */
.content {

}

`

module.exports = AppInfo
},{"Graphic":30,"bel":4,"csjs-inject":7}],29:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')
// widgets
const Graphic = require('Graphic')

function Desktop(apps, tartget) {
    const csjs = require('csjs-inject')
    const css = style

    const desktop  = bel`<main class=${css.desktop} role="desktop"></main>`
    const el = bel`
        <div class=${css["app-list"]}>
        ${apps.map( app => {
            if (app.open) return
            return bel`
                <div class="${css.app} ${app.name}" onclick=${()=>tartget(app)}>
                    ${Graphic(app.url)}
                    <span class=${css.appName}>${app.title}</span>
                </div>`
            }
        )}
        </div>
    `

    desktop.appendChild(el)

    return desktop
}


const style = csjs`
.desktop {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: calc(100vh - 43px) 43px;
}
.app-list {
    padding: 20px 20px 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(auto, 88px));
    grid-template-rows: repeat(auto-fit, minmax(auto, 88px));
    gap: 5px 22px;
    grid-auto-flow: column;
    justify-items: center;
}
.app {
    display: grid;
    grid-template: 60px auto / auto;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
}
.appName {
    font-size: var(--appNameFontSize);
    color: var(--appNameColor);
    word-break: break-word;
}
.app:hover div svg g path {
    fill: var(--appHoverColor);
}
.app:hover div svg g rect {
    fill: var(--appHoverColor);
}
.app:hover .appName {
    color: var(--appHoverColor);
    text-decoration: underline;
}
`

module.exports = Desktop
},{"Graphic":30,"bel":4,"csjs-inject":7}],30:[function(require,module,exports){
const loadSVG = require('loadSVG')

function Graphic(url, className) {
    let el = document.createElement('div')
    if (className) {
        el.classList.add(className)
    }
    loadSVG(url, (err, svg) => {
        if (err) return console.error(err)
        el.append(svg)
    })

    return el
}   

module.exports = Graphic
},{"loadSVG":32}],31:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')
// widgets
const Graphic = require('Graphic')

function OpenWindow(app, content, protocol) {
    app.open = true

    const css = style
    let close = Graphic('./src/node_modules/assets/svg/close.svg', css.icon)
    let minmax = Graphic('./src/node_modules/assets/svg/minmax.svg', css.icon)
    const el = bel`
    <div class="${css.window} app_${app.id}">
        <header class=${css["panel-header"]}>
            <span class=${css["panel-title"]}>${app.title}</span>
            <div class=${css["panel-nav"]}>
                <button class="${css.btn} ${css.minmax}" onclick=${() => panelNav(event, "minmax")}>${minmax}</button>
                <button class="${css.btn} ${css.close}" onclick=${() => panelNav(event, "close")}>${close}</button>
            </div>
        </header>
        <div class=${css["panel-body"]}>
            ${content()}
        </div>
    </div>
    `

    function panelNav(event, status) {
        event.preventDefault()
        if (status === 'close') {
            el.remove()
            app.open = false
            return protocol(el, app)
        }
        if (status === 'minmax') {
            el.classList.contains(css.fullscreen) 
            ? el.classList.remove(css.fullscreen)
            : el.classList.add(css.fullscreen)
        }
    }
    
    return protocol(el, app)
}



const style = csjs`
.window {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    width: 960px;
    height: 768px;
    max-width: 100vw;
    max-height: 100vh;
    transform: translate(-50%, -50%);
    background-color: #d9d9d9;
    display: grid;
    grid-template: 29px auto / auto;
}
.panel-header {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto 65px;
    border: var(--panelBorder) solid var(--panelBorderColor);
    background-color: white;
    align-items: center;
}
.panel-nav {
    display: grid;
    grid-template: auto;
    grid-auto-flow: column;
    align-items: center;
}
.panel-title {
    font-size: var(--panelHeaderTitleSize);
    color: var(--panelHeaderTitleColor);
    text-align: center;
}
.panel-body {
    background-color: var(--panelBodyBgColor);
    border: var(--panelBorder) solid var(--panelBorderColor);
    border-top: 0;
    height: 100%;
}
.btn {
}
.icon {
    display: grid;
    align-items: center;
    justify-content: center;
}
.icon svg {
    width: 100%;
    height: auto;
}
.minmax {

}
.fullscreen {
    width: 100vw;
    height: 100vh;
}
.close {

}
@media screen and (max-width: 1024px) {
    .window {
        width: 100vw;
        height: 100vh
    }
}
`

module.exports = OpenWindow
},{"Graphic":30,"bel":4,"csjs-inject":7}],32:[function(require,module,exports){
async function loadSVG (url, done) { 
    const parser = document.createElement('div')
    let response = await fetch(url)
    if (response.status == 200) {
      let svg = await response.text()
      parser.innerHTML = svg
      return done(null, parser.children[0])
    }
    throw new Error(response.status)
}

module.exports = loadSVG
},{}]},{},[1]);
