const spronk = require('../../src')

spronk({
	workers: 3,
	start: () => {
		console.log('worker')

		process.on('SIGTERM', function() {
			console.log('exiting')
			process.exit()
		})
	}
})
