# Building project with Grunt

Check `gruntfile.js` for project configuration.

Here are the main commands:

## Watch

Run `grunt watch-project` to watch project.

```sh
$ grunt watch-project
```

## Build

Run `grunt build` to compile resources, collect project into `/build`
and prepare it for deployment.

```sh
$ grunt build
```

Run `grunt build-critical` to build project and optimise it's critical
rendering path.

```sh
$ grunt build-critical
```

Run `grunt build-fast` to build project without running tests or
linters.

```sh
$ grunt build-fast
```

Run `grunt build-critical-fast` to build project and optimise it's critical
rendering path without running tests or linters.

```sh
$ grunt build-critical-fast
```

## Process images, scripts, stylesheets and HTML

Run `grunt compile` to generate, optimise and minify images, scripts
([UglifyJS](http://lisperator.net/uglifyjs/)), stylesheets
([autoprefixer](https://github.com/ai/autoprefixer),
[CSScomb](http://csscomb.com/), etc.) and HTML-files.

```sh
$ grunt compile
```

Run `grunt process-sprites` to compile sprites

```sh
$ grunt process-sprites
```

## Linting & testing

Run `grunt quality` to lint project's stylesheets ([CSS Lint](http://csslint.net) and
[CSS Colorguard](https://github.com/SlexAxton/css-colorguard)),
scripts ([ESLint](http://eslint.org/)), HTML-files ([HTMLHint](http://htmlhint.com/)).

```sh
$ grunt quality
```

Run `grunt performance` to check project for potential performance issues.

```sh
$ grunt performance
```

Run `grunt test` to run unit tests.

```sh
$ grunt test
```
