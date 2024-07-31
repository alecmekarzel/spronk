#!/usr/bin/env node

// NOTE: this script will be used when the user attempts to use the CLI

const path = require('path')
const spronk = require('./index')
const { program } = require('commander')
const package = require('../package.json')

program.version(package.version).description(package.description).usage('<file> [options]')

program
	.arguments('<file>')
	.option('-w, --workers <n>', 'number of workers to start [#CPUS]', parseInt)
	.option('-g, --grace <n>', 'ms grace period after worker SIGTERM [5000]', parseInt)
	.option('-l, --lifetime <n>', 'ms to keep cluster alive if workers exit [Infinity]', parseInt)
	.action(function (file) {
		const options = program.opts()
		const resolvedPath = path.resolve(file)

		spronk({
			start: function () {
				require(resolvedPath)
			},
			workers: options.workers,
			grace: options.grace,
			lifetime: options.lifetime,
		})
	})

program.parse(process.argv)
