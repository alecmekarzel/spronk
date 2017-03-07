const os = require('os')
const path = require('path')
const child = require('child_process')
const { exec, spawn } = child
const { assert } = require('chai')

const cpuCount = os.cpus().length

const optionsFixture = path.join(__dirname, 'fixtures', 'options')
const startFixture = path.join(__dirname, 'fixtures', 'start')
const exitFixture = path.join(__dirname, 'fixtures', 'exit')
const lifetimeFixture = path.join(__dirname, 'fixtures', 'lifetime')
const cpusFixture = path.join(__dirname, 'fixtures', 'cpus')
const gracefulFixture = path.join(__dirname, 'fixtures', 'graceful')
const killFixture = path.join(__dirname, 'fixtures', 'kill')
const infiniteFixture = path.join(__dirname, 'fixtures', 'infinite')

function run(file, context, done) {
	var child = spawn('node', [file])

	context.stdout = ''
	context.startTime = Date.now()
	child.stdout.on('data', function(data) {
		context.stdout += data.toString()
	})
	child.stderr.on('data', function(data) {
		context.stdout += data.toString()
	})
	child.on('close', function(code) {
		context.endTime = Date.now()
		done()
	})

	return child
}

describe('spronk()', function() {

	describe('with no options', function() {
		before(function(done) {
			run(optionsFixture, this, done)
		})
		it('throws an error', function() {
			assert.notEqual(this.stdout.indexOf('You didn\'t define any options. A set of options is required.'), -1)
		})
	})

	describe('with no start function', function() {
		before(function(done) {
			run(startFixture, this, done)
		})
		it('throws an error', function() {
			assert.notEqual(this.stdout.indexOf('You didn\'t define a start function. A start function is required.'), -1)
		})
	})

	describe('with a start function and 3 workers', function() {

		describe('with lifetime of 0', function() {
			before(function(done) {
				run(exitFixture, this, done)
			})
			it('starts 3 workers that immediately exit', function() {
				var starts = this.stdout.match(/worker/g).length
				assert.equal(starts, 3)
			})
		})

		describe('with lifetime of 500ms', function() {
			before(function(done) {
				run(lifetimeFixture, this, done)
			})
			it('starts 3 workers repeatedly', function() {
				var starts = this.stdout.match(/worker/g).length
				assert.ok(starts > 3)
			})
			it('keeps workers running for at least 500ms', function() {
				assert.ok(this.endTime - this.startTime > 500)
			})
		})

		describe('with no lifetime specified', function() {
			before(function(done) {
				this.timeout(4000)
				var child = run(infiniteFixture, this, done)
				setTimeout(function() {
					child.kill()
				}.bind(this), 2000)
			})
			it('starts 3 workers repeatedly', function() {
				var starts = this.stdout.match(/worker/g).length
				assert.ok(starts > 3)
			})
			it('keeps workers running until killed externally', function() {
				assert.closeTo(this.endTime - this.startTime, 2000, 200)
			})
		})
	})

	describe('with no worker count specified', function() {
		before(function(done) {
			run(cpusFixture, this, done)
		})
		it('starts one worker', function() {
			var starts = this.stdout.match(/worker/g).length
			assert.equal(starts, cpuCount)
		})
	})

	describe('signal handling', function() {

		describe('with 3 workers that exit gracefully', function() {
			before(function(done) {
				var child = run(gracefulFixture, this, done)
				setTimeout(function() {
					child.kill()
				}, 750)
			})
			it('starts 3 workers', function() {
				var starts = this.stdout.match(/worker/g).length
				assert.equal(starts, 3)
			})
			it('allows the workers to shut down', function() {
				var exits = this.stdout.match(/exiting/g).length
				assert.equal(exits, 3)
			})
		})

		describe('with 3 workers that fail to exit', function() {
			before(function(done) {
				var child = run(killFixture, this, done)
				setTimeout(function() {
					child.kill()
				}, 750)
			})
			it('starts 3 workers', function() {
				var starts = this.stdout.match(/ah ha ha ha/g).length
				assert.equal(starts, 3)
			})
			it('notifies the workers that they should exit', function() {
				var exits = this.stdout.match(/stayin alive/g).length
				assert.equal(exits, 3)
			})
			it('kills the workers after 250ms', function() {
				assert.closeTo(this.endTime - this.startTime, 1000, 100)
			})
		})

	})
})
