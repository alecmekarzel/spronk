const spronk = require('../../src')

spronk({
	workers: 3,
	lifetime: 0,
	grace: 250,
	start: () => {
		console.log('ah ha ha ha')

		process.on('SIGTERM', function () {
			console.log('stayin alive')
		})
	},
})
