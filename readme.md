[![npm version](https://badge.fury.io/js/neoman-engine.svg)](https://badge.fury.io/js/neoman-engine)
[![Build Status](https://travis-ci.org/cdibbs/neoman-engine.svg?branch=master)](https://travis-ci.org/ossplz/neoman-engine)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/6ngl64ck83opvekl?svg=true)](https://ci.appveyor.com/project/cdibbs/neoman-engine)
[![dependencies Status](https://david-dm.org/cdibbs/neoman-engine/status.svg)](https://david-dm.org/cdibbs/neoman-engine)
[![devDependencies Status](https://david-dm.org/cdibbs/neoman-engine/dev-status.svg)](https://david-dm.org/cdibbs/neoman-engine?type=dev)
[![codecov](https://codecov.io/gh/cdibbs/neoman-engine/branch/master/graph/badge.svg)](https://codecov.io/gh/cdibbs/neoman-engine)

[![MIT License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

# Neoman engine

**neoman** - _Old Saxon_. None, nobody.

A template manager that intends to be _nobody_ and _nothing_; it doesn't want to impose. Neoman knows that your code shouldn't have to become a project template, _because it already is one._ :relieved:

## Basic Usage

Drop the following folder and file into your project, and Neoman will have all it needs.

`MyProject/.neoman.config/template.json`

or

`.neoman.config/template.json`
`MyProject/` (you can also put it in parallel and adjust the root attribute).

A minimal `template.json` would look like this:

```json
{
    "name": "My Project Template",
    "description": "My useful project template will lead many to triumph.",
    "author": "Noh Body",
    "url": "https://en.wikipedia.org/wiki/Outis",
    "identity": "myprojtmp",

    "input": {
        "use": "prompt",
        "define": {
            "namespace": "What will the root namespace of your project be?"
        }
    },

    "transform": [
        { "subject": "my.project.namespace", "with": "{{namespace}}" }
    ],

    "#": "You don't need 'files' if you want the 'transform' and 'pathTransform' sections to apply to all files",
    "files": ["**/*.ts"]
}
```

Once your project is ready, setup a folder to store your templates, and copy the project folder there. Then,
it's ready to use via [neoman.io](https://www.neoman.io).

## Documentation

For documentation, please refer to [the wiki](https://github.com/cdibbs/neoman-engine/wiki).

[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[LICENSE]: https://github.com/ossplz/neoman-engine/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/ossplz/neoman-engine/blob/master/other/code_of_conduct.md