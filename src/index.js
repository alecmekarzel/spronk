#!/usr/bin/env node

// NOTE: this script will be used when the user imports/requires

const os = require('os')
const cluster = require('cluster')

const defaults = require('lodash.defaults')
const isPlainObject = require('lodash.isplainobject')
const isFunction = require('lodash.isfunction')

module.exports = function spronk(options) {
	if (!isPlainObject(options)) throw new Error("You didn't define any options. A set of options is required.")
	if (!isFunction(options.start)) throw new Error("You didn't define a start function. A start function is required.")

	let startFn = options.start || function () {}

	// if the cluster is a worker, return the user defined
	// function so that cluster runs that instead
	if (cluster.isWorker) return startFn()

	// if user left some options out then we'll
	// add our default options to the user defined options
	options = defaults(options, {
		workers: os.cpus().length,
		lifetime: Infinity,
		grace: 5000,
	})

	let isRunning = true
	let runStart = Date.now()
	let runEnd = runStart + options.lifetime

	listen()

	// fork the cluster for each worker defined
	for (var i = 0; i < options.workers; i++) {
		cluster.fork()
	}

	function listen() {
		// if there's an error and the process exits
		// and this is still meant to be running, and has time left
		// then revive the process by forking the cluster again
		cluster.on('exit', revive)

		// if the user quits the process
		// then shutdown all processes
		process.on('SIGINT', shutdown).on('SIGTERM', shutdown)
	}

	function revive(worker, code, signal) {
		if (isRunning && Date.now() < runEnd) cluster.fork()
	}

	function shutdown() {
		isRunning = false
		for (var id in cluster.workers) {
			cluster.workers[id].process.kill()
		}
		setTimeout(function forceKill() {
			for (var id in cluster.workers) {
				cluster.workers[id].kill()
			}
			process.exit()
		}, options.grace).unref()
	}
}
