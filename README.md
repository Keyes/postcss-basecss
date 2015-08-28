# PostCSS BaseCSS [![Build Status][ci-img]][ci]

[PostCSS] plugin which extracts basic CSS rules for inlining them in your index.html, similar to critical CSS.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/Keyes/postcss-basecss.svg?branch=master
[ci]:      https://travis-ci.org/Keyes/postcss-basecss

## Installation

```
npm install postcss-basecss --save
```


## Usage

```js
postcss([ require('postcss-basecss')(options) ])
```

### Options

Default options:
```js
{
    cssFile:   '',
    htmlFile:  '',
    selectors: [
    ],
    propertiesExclude: [
        'animation[\-a-z]*', 'transition[\-a-z]*',
        'cursor', 'nav[\-a-z]*', 'resize',
        'image[\-a-z]*'
    ],
    includeFontFace: true
}
```

#### options.cssFile
Only necessary of you use basecss standalone

#### options.htmlFile
File, in which the CSS should be included. Needs a head-Element.

#### options.selectors
Array of selectors for which should be looked. Can contain regular expressions.

For example:

```js
selectors: [
	'.base-',
    '.col-(sm,lg)-',
    'nav', 
    'article'
]
```

#### options.propertiesExclude
CSS properties that should be excluded. It's mostly good to leave the default value here, you mostly do not want animations to appear.

#### options.includeFontFace
Basecss includes by default all @font-face rules in the beginning of the css, so that your fonts get rendered properly. You may want to disable this.

---

See [PostCSS] docs for examples for your environment.
