# spronk

Easily cluster your apps via the CLI or with code.

## Installation
```bash
# NPM
$ npm install spronk
$ npm install spronk -g

# Yarn
$ yarn add spronk
$ yarn global add spronk
```

## Getting Started

#### With CLI

```bash
# View Help
$ spronk --help

# Basic Usage
$ spronk <file> [options]

# Basic Example
$ spronk example.js --workers 4
```

#### With Code

```js
const spronk = require('spronk')

spronk({
	workers: 4, // number of workers to start [#CPUS]
	grace: 1000, // ms grace period after worker SIGTERM [5000]
	lifetime: 10000, // ms to keep cluster alive if workers exit [Infinity]
	start: function() {} // worker functions
})
```

## Testing

Simply run `npm test` or `yarn test` (depending on your package manager) and all of the tests in the `test/` directory will be run.

## Issues

We don't accept issues; we accept pull requests.

## Changelog

For milestones, visit the [project's releases](https://github.com/worklovegrow/worklovegrow-web-www/releases).

## License

For license information, visit the [project's license](https://github.com/worklovegrow/worklovegrow-web-www/blob/master/LICENSE).
