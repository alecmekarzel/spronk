'use strict'

const spronk = require('../../src')

spronk({
	lifetime: 0,
	start: () => {
		console.log('worker')
		process.exit()
	},
})
