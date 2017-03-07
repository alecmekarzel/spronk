const spronk = require('../../src')

spronk({
	workers: 3,
	start: () => {
		console.log('worker')
		process.exit()
	}
})
