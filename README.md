# PostCSS BaseCSS [![Build Status][ci-img]][ci]

[PostCSS] plugin which extracts basic CSS rules for inlining them in your index.html, similar to critical CSS.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/Keyes/postcss-baseCSS.svg
[ci]:      https://travis-ci.org/Keyes/postcss-baseCSS

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-baseCSS') ])
```

See [PostCSS] docs for examples for your environment.
