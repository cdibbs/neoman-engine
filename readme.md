[![npm version](https://badge.fury.io/js/neoman.svg)](https://badge.fury.io/js/neoman)
[![Build Status](https://travis-ci.org/ossplz/neoman.svg?branch=master)](https://travis-ci.org/ossplz/neoman)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/6ngl64ck83opvekl?svg=true)](https://ci.appveyor.com/project/OSSPlz/neoman)
[![dependencies Status](https://david-dm.org/ossplz/neoman/status.svg)](https://david-dm.org/ossplz/neoman)
[![devDependencies Status](https://david-dm.org/ossplz/neoman/dev-status.svg)](https://david-dm.org/ossplz/neoman?type=dev)
[![codecov](https://codecov.io/gh/ossplz/neoman/branch/master/graph/badge.svg)](https://codecov.io/gh/ossplz/neoman)

[![MIT License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

# Neoman Template Manager

**neoman** - _Old Saxon_. None, nobody.

A template manager that intends to be _nobody_ and _nothing_; it doesn't want to impose. Neoman knows that your code shouldn't have to become a project template, _because it already is one._ :relieved:

## Basic Usage

Drop the following folder and file into your project, and Neoman will have all it needs.

`MyProject/.neoman.config/template.json`

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

Once your project is ready, setup a folder to store your templates, and copy the project folder there. Then, just point Neoman to it:

```
neoman setdir ./my-templates-folder
```

Now, you should be ready to start using it:

```
mkdir new-folder
cd new-folder
neoman new myprojtmp
```

Type `neoman help` for command help. If you run into any problems, please refer to the [the wiki](https://github.com/cdibbs/neoman/wiki), first, and if worst comes to worse, [file an issue](https://github.com/cdibbs/neoman/issues).

Happy templating!

## Documentation

For documentation, please refer to [the wiki](https://github.com/cdibbs/neoman/wiki).

## Building

To build and run Neoman from source, clone the repository and, from the root of the cloned repository, run:

```
npm install
npm run build
npm link
neoman
```

## Help Wanted

### Internationalization (i18n)

Fluent in another language? Please consider helping with translations.

### Plugins

Familiar with parsers? Want to see Neoman transforms for your favorite programming language? Please
review existing plugins and see if this might fit in with your hobby time.

[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[LICENSE]: https://github.com/ossplz/neoman/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/ossplz/neoman/blob/master/other/code_of_conduct.md
