const spronk = require('../../src')

spronk({
	workers: 3,
	lifetime: 500,
	start: () => {
		console.log('worker')
		process.exit()
	}
})
