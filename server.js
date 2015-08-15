var express = require('express')
var spark = require('spark')
var tally = 0

/**
 * Set up express server:
 * - tell it to list to port 3000
 */

var app = express()

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Server listening at http://%s:%s', host, port)
})

server.listen(app.get('port'))

/**
 * Login
 * When the server logs in, listen for
 * the `Foo` event emitted from the server
 */

spark.on('login', function () {
  console.log('server logged in')

  // Listen for 'Foo'
  // - update the running tally
  // - call `Bar` with the new tally
  spark.onEvent('Foo', function (e) {
    console.log('Server received: ', e.data)
    tally = Number(e.data) + 1
    spark.publishEvent('Bar', tally)
  })

  // Kick of the initial event to get it all started
  spark.publishEvent('Bar', tally)
})

spark.login({
  username: 'you@email.com',
  password: 'password'
})
