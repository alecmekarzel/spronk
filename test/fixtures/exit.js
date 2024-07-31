'use strict'

const spronk = require('../../src')

spronk({
	workers: 3,
	lifetime: 0,
	start: () => {
		console.log('worker')
		process.exit()
	},
})
