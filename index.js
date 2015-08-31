var postcss = require('postcss');
var Basecss = require('basecss');

module.exports = postcss.plugin('postcss-basecss', function (opts) {
    opts = opts || {};

    return function (css) {

        new Basecss(opts).process(css);

    };
});
