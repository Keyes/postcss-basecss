var postcss = require('postcss');
var parseCSS = require('css');
var fs = require('fs');
var _ = require('lodash');
var jsdom = require('jsdom-nogyp');

// init Basecss
var Basecss = function (options) {
    // our default options
    this.options = _.extend({
        cssFile:   '',
        htmlFile:  '',
        selectors: [
            // '[^x]small',
            // 'h1'
            // 'large'
        ],
        propertiesExclude: [
            'animation[\-a-z]*', 'transition[\-a-z]*',
            'cursor', 'nav[\-a-z]*', 'resize',
            'image[\-a-z]*'
        ],
        includeFontFace: true
    }, options);

    return this;
};

// get specific data from our css data
Basecss.prototype.getData = function (name) {
    return _.reject(this.cssData, function (n) {
        return n.type !== name;
    });
};

// get specific rules by selector
Basecss.prototype.fetchRulesBySelectors = function (selectorArray) {
    selectorArray = selectorArray || this.options.selectors;
    this.data = _.filter(this.getData('rule'), function (rule) {
        // filter from every rule in the css data
        var selectors = rule.selectors;
        // loop over every selector in this specific rule
        for (var i in selectors) {
            // loop over our selectors from the options
            for (var sel in selectorArray) {
                // do they match?
                if (selectors[i].search(selectorArray[sel]) !== -1) {
                    return true;
                }
            }
        }
    });

    // should we include @font-face rules? we better do...
    if (this.options.includeFontFace) {
        this.data = this.getData('font-face').concat(this.data);
    }

    return this;
};

Basecss.prototype.getRulesBySelectors = function (selectorArray) {
    this.fetchRulesBySelector(selectorArray);
    return this.data;
};

// return our data as perfect CSS-String
Basecss.prototype.toString = function (data) {
    return parseCSS.stringify(
        { stylesheet: { rules: data ? data : this.data } }
    );
};

// write or build css to the html file - inline!
Basecss.prototype.writeToHtmlFile = function () {
    // callback function this=self workaround
    var self = this;
    var htmlFile;

    try {
        htmlFile = fs.readFileSync(this.options.htmlFile);
    } catch(err) {
        console.log(
            'File "' + this.options.htmlFile + '" doesn\'t exist!'
        );
        return false;
    }

    // we need jsdom to nicely traverse through our html code
    jsdom.env(
        htmlFile.toString('utf-8'), [],
        function (err, window) {
            if(err) throw err;

            var csstag = window.document
                .querySelector('style[data-id="base-css"]');

            // do we already have a Basecss style element?
            if (!csstag) {
                // if not, create one and set our data-id
                csstag = window.document.createElement('style');
                csstag.setAttribute('data-id', 'base-css');
            }
            // we need the type attribute!
            csstag.setAttribute('type', 'text/css');
            // append our build css code
            csstag.innerHTML = '\n' + self.toString() + '\n';

            // append our element to the head area
            window.document.querySelector('head').appendChild(csstag);

            // write the html file back to the file system
            fs.writeFileSync(
                this.options.htmlFile,
                window.document.innerHTML
            );

            // yay!
            console.log('Success!');
        }
    );
};

Basecss.prototype.filterRulesByProperties = function (propertyArray) {
    propertyArray = propertyArray || this.options.propertiesExclude;

    var rule;
    var properties;
    var search;

    for (var r in this.data) {
        rule = this.data[r];
        // filter from every rule in the css data
        properties = rule.declarations;

        // loop over every property in this specific rule
        for (var i in properties) {
            // loop over our properties from the options
            for (var prop in propertyArray) {
                // do they match?
                search = properties[i]
                    .property
                    .search(propertyArray[prop]);

                if (search !== -1) {
                    // remove this property!
                    properties.splice(i, 1);
                }
            }
        }
    }

    return this;
};

// shorthand function for the normal way
Basecss.prototype.run = function () {
    // read the css file and parse it
    this.cssData = parseCSS.parse(
        fs.readFileSync(this.options.cssFile).toString('utf-8'),
        { source: this.options.cssFile }
    ).stylesheet.rules;

    this.fetchRulesBySelectors().filterRulesByProperties().writeToHtmlFile();
    return this;
};

Basecss.prototype.process = function (str, options) {
    if (options) _.extend(this.options, options);

    // read the css file and parse it
    this.cssData = parseCSS.parse(str.toString('utf-8')).stylesheet.rules;

    this.fetchRulesBySelectors().filterRulesByProperties().writeToHtmlFile();
    return this;
};

module.exports = postcss.plugin('postcss-basecss', function (opts) {
    opts = opts || {};

    return function (css) {

        new Basecss(opts).process(css);

    };
});
